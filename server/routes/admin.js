import { asyncRouter } from '../async-router.js';
import crypto from 'node:crypto';
import { query } from '../db.js';
import { checkAdminPassword, clearSessionCookie, isAdmin, requireAdmin, setSessionCookie } from '../auth.js';
import { scoreAssessment } from '../../shared/scoring.js';
import { VARIANTS } from '../../shared/questions/index.js';
import { buildGapReport, buildAttestation } from '../pdf.js';
import { loadAnswers, publicBaseUrl } from '../helpers.js';

const router = asyncRouter();

// Brute-force damping: a fixed small delay on every failed login attempt.
const FAILED_LOGIN_DELAY_MS = 750;

router.post('/login', async (req, res) => {
  if (!checkAdminPassword(req.body?.password)) {
    await new Promise((r) => setTimeout(r, FAILED_LOGIN_DELAY_MS));
    return res.status(401).json({ error: 'Incorrect password.' });
  }
  setSessionCookie(res);
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
    `SELECT a.id, a.token, a.variant, a.client_name, a.contact_name, a.contact_email,
            a.status, a.created_at, a.updated_at, a.submitted_at,
            COUNT(ans.question_id)::int AS answered
       FROM assessments a
       LEFT JOIN answers ans ON ans.assessment_id = a.id
      GROUP BY a.id
      ORDER BY a.created_at DESC`
  );

  res.json({
    assessments: rows.map((row) => ({
      id: row.id,
      token: row.token,
      variant: row.variant,
      variantLabel: VARIANTS[row.variant].label,
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
  if (!VARIANTS[variant]) {
    return res.status(400).json({ error: 'Choose either the merchant or service provider edition.' });
  }

  const id = crypto.randomUUID();
  // 32 hex characters of entropy: the link is the only credential a client has.
  const token = crypto.randomBytes(16).toString('hex');

  await query(
    `INSERT INTO assessments (id, token, variant, client_name, contact_name, contact_email, dba, scope_summary, internal_notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      id,
      token,
      variant,
      String(clientName).trim(),
      contactName || null,
      contactEmail || null,
      dba || null,
      scopeSummary || null,
      internalNotes || null,
    ]
  );

  res.status(201).json({ id, token, link: `${publicBaseUrl(req)}/q/${token}` });
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
      variantLabel: VARIANTS[assessment.variant].label,
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
    result: scoreAssessment(assessment.variant, answers),
  });
});

router.patch('/assessments/:id', async (req, res) => {
  const assessment = await getAssessmentById(req.params.id);
  if (!assessment) return res.status(404).json({ error: 'Assessment not found.' });

  const { internalNotes, scopeSummary } = req.body || {};
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

router.post('/assessments/:id/reopen', async (req, res) => {
  const assessment = await getAssessmentById(req.params.id);
  if (!assessment) return res.status(404).json({ error: 'Assessment not found.' });

  await query(
    `UPDATE assessments
        SET status = 'in-progress', submitted_at = NULL, submitted_by = NULL,
            submitted_title = NULL, updated_at = now()
      WHERE id = $1`,
    [assessment.id]
  );
  res.json({ ok: true });
});

router.delete('/assessments/:id', async (req, res) => {
  const { rowCount } = await query('DELETE FROM assessments WHERE id = $1', [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: 'Assessment not found.' });
  res.json({ ok: true });
});

router.get('/assessments/:id/report.pdf', async (req, res) => {
  const assessment = await getAssessmentById(req.params.id);
  if (!assessment) return res.status(404).json({ error: 'Assessment not found.' });

  const answers = await loadAnswers(assessment.id);
  const result = scoreAssessment(assessment.variant, answers);
  buildGapReport(res, assessment, result, answers);
});

router.get('/assessments/:id/aoc.pdf', async (req, res) => {
  const assessment = await getAssessmentById(req.params.id);
  if (!assessment) return res.status(404).json({ error: 'Assessment not found.' });

  const answers = await loadAnswers(assessment.id);
  const result = scoreAssessment(assessment.variant, answers);
  buildAttestation(res, assessment, result);
});

export default router;
