import { asyncRouter } from '../async-router.js';
import crypto from 'node:crypto';
import { query } from '../db.js';
import {
  canAuthenticate,
  checkAdminPassword,
  clearSessionCookie,
  isAdmin,
  requireAdmin,
  setSessionCookie,
} from '../auth.js';
import { scoreAssessment } from '../../shared/scoring.js';
import { VARIANTS } from '../../shared/questions/index.js';
import { SAQ_TYPES } from '../../shared/eligibility.js';
import { buildGapReport, buildAttestation } from '../pdf.js';
import { linkBaseIsFromRequest, loadAnswers, publicBaseUrl, withLockedAssessment } from '../helpers.js';

const router = asyncRouter();

// Brute-force damping. A per-request delay alone does not slow an attacker who
// simply issues attempts in parallel, so failures are also counted and the
// endpoint locks out once there have been too many within the window. One admin
// password means one counter; there is no per-account state to track.
const FAILED_LOGIN_DELAY_MS = 750;
const MAX_FAILED_LOGINS = 10;
const LOCKOUT_MS = 15 * 60 * 1000;
// Each failed attempt is held open for the delay above, so attempts issued in
// parallel accumulate rather than queue. Without a ceiling a burst would tie up
// sockets and heap for as long as the attacker keeps sending, on the one
// endpoint that is reachable without a session. Past the ceiling the answer is
// immediate and cheap, which is also the answer an attacker least wants.
const MAX_CONCURRENT_LOGINS = 8;

const loginFailures = { count: 0, firstAt: 0, lockedUntil: 0 };
let loginsInFlight = 0;

function loginLockRemainingMs() {
  const remaining = loginFailures.lockedUntil - Date.now();
  return remaining > 0 ? remaining : 0;
}

function recordLoginFailure() {
  const now = Date.now();
  // Start a fresh window once the previous one has aged out.
  if (now - loginFailures.firstAt > LOCKOUT_MS) {
    loginFailures.count = 0;
    loginFailures.firstAt = now;
  }
  loginFailures.count += 1;
  if (loginFailures.count >= MAX_FAILED_LOGINS) {
    loginFailures.lockedUntil = now + LOCKOUT_MS;
  }
}

router.post('/login', async (req, res) => {
  if (loginsInFlight >= MAX_CONCURRENT_LOGINS) {
    return res.status(429).json({
      error: 'Too many sign-in attempts are being processed. Try again in a moment.',
      retryAfterSeconds: 1,
    });
  }

  // Checked before the password, so a plaintext attempt never reaches it.
  if (!canAuthenticate(req)) {
    return res.status(403).json({
      error:
        'Signing in requires a secure (HTTPS) connection. This instance is reachable over plain HTTP, which would expose the admin session.',
    });
  }

  const lockedFor = loginLockRemainingMs();
  if (lockedFor > 0) {
    return res.status(429).json({
      error: `Too many failed sign-in attempts. Try again in ${Math.ceil(lockedFor / 60000)} minute(s).`,
      retryAfterSeconds: Math.ceil(lockedFor / 1000),
    });
  }

  if (!checkAdminPassword(req.body?.password)) {
    recordLoginFailure();
    loginsInFlight += 1;
    try {
      await new Promise((r) => setTimeout(r, FAILED_LOGIN_DELAY_MS));
    } finally {
      loginsInFlight -= 1;
    }
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  // Nothing about the lockout is cleared on success. The counter is global
  // because there is one shared password, so resetting it would let an
  // attacker's attempts be wiped by the admin's own routine sign-ins; and an
  // active lockout is never reached here, since it returns 429 above. The
  // window ages out on its own.
  setSessionCookie(req, res);
  res.json({ ok: true });
});

router.post('/logout', (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

router.get('/session', (req, res) => {
  res.json({ signedIn: isAdmin(req) });
});

router.use(requireAdmin);

router.get('/assessments', async (req, res) => {
  const { rows } = await query(
    `SELECT a.id, a.token, a.variant, a.saq_type, a.client_name, a.contact_name, a.contact_email,
            a.status, a.created_at, a.updated_at, a.submitted_at, a.eligibility_completed_at,
            COUNT(ans.question_id)::int AS answered
       FROM assessments a
       LEFT JOIN answers ans ON ans.assessment_id = a.id AND ans.response IS NOT NULL
      GROUP BY a.id
      ORDER BY a.created_at DESC`
  );

  res.json({
    assessments: rows.map((row) => ({
      id: row.id,
      token: row.token,
      variant: row.variant,
      variantLabel: row.variant ? VARIANTS[row.variant].label : null,
      saqType: row.saq_type,
      saqName: row.saq_type ? SAQ_TYPES[row.saq_type]?.name ?? row.saq_type : null,
      administered: Boolean(row.variant),
      eligibilityCompletedAt: row.eligibility_completed_at,
      clientName: row.client_name,
      contactName: row.contact_name,
      contactEmail: row.contact_email,
      status: row.status,
      answered: row.answered,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      submittedAt: row.submitted_at,
      link: `${publicBaseUrl(req)}/q/${row.token}`,
    })),
  });
});

router.post('/assessments', async (req, res) => {
  const { clientName, contactName, contactEmail, dba, scopeSummary, variant, internalNotes } = req.body || {};

  if (!clientName || !String(clientName).trim()) {
    return res.status(400).json({ error: 'A client name is required.' });
  }
  // An empty variant is the normal case: the client's eligibility answers set it.
  if (variant && !VARIANTS[variant]) {
    return res.status(400).json({ error: 'Choose either the merchant or service provider edition, or let the client determine it.' });
  }

  // Field-level caps: the 256kb body limit alone would let one field carry a
  // quarter megabyte into the database and into every PDF generated from it.
  const LIMITS = {
    clientName: 200,
    dba: 200,
    contactName: 200,
    contactEmail: 320,
    scopeSummary: 4000,
    internalNotes: 8000,
  };
  for (const [field, limit] of Object.entries(LIMITS)) {
    const value = { clientName, dba, contactName, contactEmail, scopeSummary, internalNotes }[field];
    if (typeof value === 'string' && value.length > limit) {
      return res.status(400).json({
        error: `That ${field} is too long. The limit is ${limit.toLocaleString()} characters.`,
        field,
        limit,
      });
    }
  }

  const id = crypto.randomUUID();
  // 32 hex characters of entropy: the link is the only credential a client has.
  const token = crypto.randomBytes(16).toString('hex');

  const presetSaqType = variant === 'service-provider' ? 'D-ServiceProvider' : variant === 'merchant' ? 'D-Merchant' : null;

  await query(
    `INSERT INTO assessments (id, token, variant, saq_type, client_name, contact_name, contact_email, dba, scope_summary, internal_notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      id,
      token,
      variant || null,
      presetSaqType,
      String(clientName).trim(),
      contactName || null,
      contactEmail || null,
      dba || null,
      scopeSummary || null,
      internalNotes || null,
    ]
  );

  res.status(201).json({
    id,
    token,
    link: `${publicBaseUrl(req)}/q/${token}`,
    // Tells the admin UI to say where this link's address came from. A link
    // built from the request's Host header is only as trustworthy as that
    // header, and the assessor is the one about to send it to a client.
    linkFromRequestHost: linkBaseIsFromRequest(req),
  });
});

async function getAssessmentById(id) {
  const { rows } = await query('SELECT * FROM assessments WHERE id = $1', [id]);
  return rows[0] || null;
}

router.get('/assessments/:id', async (req, res) => {
  const assessment = await getAssessmentById(req.params.id);
  if (!assessment) return res.status(404).json({ error: 'Assessment not found.' });

  const answers = await loadAnswers(assessment.id);
  res.json({
    assessment: {
      id: assessment.id,
      token: assessment.token,
      variant: assessment.variant,
      variantLabel: assessment.variant ? VARIANTS[assessment.variant].label : null,
      saqType: assessment.saq_type,
      saqName: assessment.saq_type ? SAQ_TYPES[assessment.saq_type]?.name ?? assessment.saq_type : null,
      saq: assessment.saq_type ? SAQ_TYPES[assessment.saq_type] ?? null : null,
      administered: Boolean(assessment.variant),
      eligibility: assessment.eligibility,
      eligibilityCompletedAt: assessment.eligibility_completed_at,
      clientName: assessment.client_name,
      contactName: assessment.contact_name,
      contactEmail: assessment.contact_email,
      dba: assessment.dba,
      scopeSummary: assessment.scope_summary,
      internalNotes: assessment.internal_notes,
      status: assessment.status,
      createdAt: assessment.created_at,
      updatedAt: assessment.updated_at,
      submittedAt: assessment.submitted_at,
      submittedBy: assessment.submitted_by,
      submittedTitle: assessment.submitted_title,
      link: `${publicBaseUrl(req)}/q/${assessment.token}`,
    },
    answers,
    result: assessment.variant ? scoreAssessment(assessment.variant, answers) : null,
  });
});

router.patch('/assessments/:id', async (req, res) => {
  const assessment = await getAssessmentById(req.params.id);
  if (!assessment) return res.status(404).json({ error: 'Assessment not found.' });

  const { internalNotes, scopeSummary } = req.body || {};
  if (typeof internalNotes === 'string' && internalNotes.length > 8000) {
    return res.status(400).json({ error: 'Those internal notes are too long. The limit is 8,000 characters.' });
  }
  if (typeof scopeSummary === 'string' && scopeSummary.length > 4000) {
    return res.status(400).json({ error: 'That scope summary is too long. The limit is 4,000 characters.' });
  }

  await query(
    `UPDATE assessments
        SET internal_notes = COALESCE($2, internal_notes),
            scope_summary  = COALESCE($3, scope_summary),
            updated_at     = now()
      WHERE id = $1`,
    [assessment.id, internalNotes ?? null, scopeSummary ?? null]
  );
  res.json({ ok: true });
});

/**
 * Clear a client's SAQ determination so they can run the wizard again.
 *
 * Any recorded answers belong to the old questionnaire and would be orphaned by
 * a change of SAQ type, so they are removed with it. The client is told this in
 * the UI before the request is made.
 */
router.post('/assessments/:id/reset-eligibility', async (req, res) => {
  const { status, body } = await withLockedAssessment(req.params.id, async (client) => {
    await client.query('DELETE FROM answers WHERE assessment_id = $1', [req.params.id]);
    await client.query(
      `UPDATE assessments
          SET saq_type = NULL, variant = NULL, eligibility = NULL, eligibility_completed_at = NULL,
              status = 'in-progress', submitted_at = NULL, submitted_by = NULL, submitted_title = NULL,
              -- Moving the revision tells a client still holding the old
              -- questionnaire that what it is showing is gone, rather than
              -- letting it submit answers this reset has just deleted. The
              -- generation goes further: a write already in flight from that
              -- page is refused outright, so it cannot restore a deleted answer
              -- into the reassessment once eligibility is settled again.
              answers_revision = answers_revision + 1,
              generation = generation + 1,
              updated_at = now()
        WHERE id = $1`,
      [req.params.id]
    );
    return { status: 200, body: { ok: true } };
  });

  res.status(status).json(body);
});

router.post('/assessments/:id/reopen', async (req, res) => {
  // Takes the same lock as every other assessment mutation, so reopening cannot
  // interleave with a submission in flight.
  const { status, body } = await withLockedAssessment(req.params.id, async (client, current) => {
    if (current.status !== 'submitted') {
      return { status: 409, body: { error: 'This assessment is not submitted, so there is nothing to reopen.' } };
    }

    await client.query(
      `UPDATE assessments
          SET status = 'in-progress', submitted_at = NULL, submitted_by = NULL,
              submitted_title = NULL, updated_at = now()
        WHERE id = $1`,
      [req.params.id]
    );
    return { status: 200, body: { ok: true } };
  });

  res.status(status).json(body);
});

router.delete('/assessments/:id', async (req, res) => {
  const { rowCount } = await query('DELETE FROM assessments WHERE id = $1', [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: 'Assessment not found.' });
  res.json({ ok: true });
});

router.get('/assessments/:id/report.pdf', async (req, res) => {
  const assessment = await getAssessmentById(req.params.id);
  if (!assessment) return res.status(404).json({ error: 'Assessment not found.' });
  if (!assessment.variant) return res.status(409).json({ error: 'This assessment has no questionnaire to report on yet.' });

  const answers = await loadAnswers(assessment.id);
  const result = scoreAssessment(assessment.variant, answers);
  buildGapReport(res, assessment, result, answers);
});

router.get('/assessments/:id/aoc.pdf', async (req, res) => {
  const assessment = await getAssessmentById(req.params.id);
  if (!assessment) return res.status(404).json({ error: 'Assessment not found.' });
  if (!assessment.variant) return res.status(409).json({ error: 'This assessment has no questionnaire to attest to yet.' });

  const answers = await loadAnswers(assessment.id);
  const result = scoreAssessment(assessment.variant, answers);
  buildAttestation(res, assessment, result);
});

export default router;
