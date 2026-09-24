import { asyncRouter } from '../async-router.js';
import { query } from '../db.js';
import { scoreAssessment, RESPONSES } from '../../shared/scoring.js';
import { getSections, getQuestion, VARIANTS } from '../../shared/questions/index.js';
import { determineSaq, prunedAnswers, ELIGIBILITY_STEPS, FIRST_STEP, SAQ_TYPES } from '../../shared/eligibility.js';
import { buildGapReport, buildAttestation } from '../pdf.js';
import { approvedPlan } from '../agent/store.js';
import { issueEpoch, readSnapshot, withLockedAssessment } from '../helpers.js';

const router = asyncRouter();

/** Maximum length of the free-text fields, enforced here and mirrored in the UI. */
export const MAX_TEXT_LENGTH = 4000;

async function getByToken(token) {
  const { rows } = await query('SELECT * FROM assessments WHERE token = $1', [token]);
  return rows[0] || null;
}

/** Resolves :token into req.assessment, 404ing on a bad or unknown link. */
async function withAssessment(req, res, next) {
  const assessment = await getByToken(req.params.token);
  if (!assessment) {
    return res.status(404).json({ error: 'This questionnaire link is not valid. Check the link or ask for a new one.' });
  }
  req.assessment = assessment;
  next();
}

/** Routes that only make sense once eligibility has routed the client to SAQ D. */
function requireVariant(req, res, next) {
  if (!req.assessment.variant) {
    return res.status(409).json({
      error: req.assessment.saq_type
        ? 'This assessment was routed to an SAQ that is not completed in this tool.'
        : 'The eligibility questions have not been completed yet.',
      stage: req.assessment.saq_type ? 'not-administered' : 'eligibility',
    });
  }
  next();
}

function publicView(assessment) {
  return {
    variant: assessment.variant,
    variantLabel: assessment.variant ? VARIANTS[assessment.variant].label : null,
    saqType: assessment.saq_type,
    saqName: assessment.saq_type ? SAQ_TYPES[assessment.saq_type]?.name ?? null : null,
    eligibility: assessment.eligibility,
    eligibilityCompletedAt: assessment.eligibility_completed_at,
    clientName: assessment.client_name,
    contactName: assessment.contact_name,
    dba: assessment.dba,
    scopeSummary: assessment.scope_summary,
    status: assessment.status,
    submittedAt: assessment.submitted_at,
    submittedBy: assessment.submitted_by,
    submittedTitle: assessment.submitted_title,
  };
}

router.get('/:token', withAssessment, async (req, res) => {
  // Until eligibility is settled there is no question bank to serve: the client
  // sees the wizard, and the questionnaire only exists once it routes to SAQ D.
  if (!req.assessment.variant) {
    return res.json({
      stage: req.assessment.saq_type ? 'not-administered' : 'eligibility',
      assessment: publicView(req.assessment),
      eligibility: {
        steps: ELIGIBILITY_STEPS,
        firstStep: FIRST_STEP,
        saqTypes: SAQ_TYPES,
      },
      sections: null,
      answers: {},
      result: null,
    });
  }

  // One snapshot, so the answers below and the revision reported with them are
  // from the same moment. Read separately, a write landing in between produced a
  // payload whose answers were newer than its revision, and the client would be
  // refused at submission over a change it was already looking at.
  const { assessment, answers } = await readSnapshot({ token: req.params.token });
  if (!assessment) {
    return res.status(404).json({ error: 'This questionnaire link is not valid. Check the link or ask for a new one.' });
  }
  if (!assessment.variant) {
    // Eligibility was reset between the middleware's read and this one.
    return res.json({
      stage: assessment.saq_type ? 'not-administered' : 'eligibility',
      assessment: publicView(assessment),
      eligibility: { steps: ELIGIBILITY_STEPS, firstStep: FIRST_STEP, saqTypes: SAQ_TYPES },
      sections: null,
      answers: {},
      result: null,
    });
  }

  res.json({
    stage: 'questionnaire',
    assessment: publicView(assessment),
    sections: getSections(assessment.variant),
    answers,
    result: scoreAssessment(assessment.variant, answers),
    // The ordering epoch for this page load, the revision of the answer set it is
    // showing, and the generation of the questionnaire itself. The client tags
    // each write with the epoch and a per-page counter (see issueEpoch()), sends
    // the generation so a write cannot land on a questionnaire that has since
    // been replaced, and sends the revision back when it submits so the server
    // can refuse to attest an answer set the client never saw.
    session: {
      epoch: await issueEpoch(),
      revision: Number(assessment.answers_revision ?? 0),
      generation: Number(assessment.generation ?? 0),
    },
  });
});

/**
 * Record the client's eligibility answers and settle which SAQ applies.
 *
 * The outcome is always recomputed here from the answers rather than taken from
 * the request, so a client cannot select their own questionnaire by posting a
 * result. Re-running is allowed while nothing has been answered yet; once the
 * questionnaire has content, changing the SAQ type would orphan it, so that
 * needs the assessor to reset it deliberately.
 */
router.post('/:token/eligibility', withAssessment, async (req, res) => {
  const submitted = req.body?.answers;
  if (!submitted || typeof submitted !== 'object' || Array.isArray(submitted)) {
    return res.status(400).json({ error: 'Eligibility answers are required.' });
  }

  let outcome;
  try {
    outcome = determineSaq(submitted);
  } catch {
    return res.status(400).json({ error: 'Those eligibility answers could not be read.' });
  }

  if (!outcome.complete) {
    return res.status(400).json({
      error: 'The eligibility questions are not finished.',
      nextStep: outcome.nextStep.id,
    });
  }

  const record = {
    answers: prunedAnswers(submitted),
    saqType: outcome.saqType,
    path: outcome.path,
    notes: outcome.notes,
    determinedAt: outcome.determinedAt,
  };

  const { status, body } = await withLockedAssessment(req.assessment.id, async (client, current) => {
    // Every guard below reads `current`, the row as it stands under the lock.
    // Using the copy loaded before the lock would let a wizard tab that has been
    // open since before another tab started answering pass these checks and
    // delete that work.
    if (current.status === 'submitted') {
      return { status: 409, body: { error: 'This assessment has been submitted and can no longer be changed.' } };
    }

    const { rows: counted } = await client.query(
      'SELECT COUNT(*)::int AS count FROM answers WHERE assessment_id = $1 AND response IS NOT NULL',
      [req.assessment.id]
    );
    // Any saved answer means a questionnaire is under way, whether the SAQ type
    // came from the wizard or was preset by the assessor. Gating on
    // `eligibility_completed_at` missed the preset case, where that field is
    // null but answers exist, and the change would have deleted them.
    if (counted[0].count > 0) {
      return {
        status: 409,
        body: {
          error:
            'The questionnaire has already been started, so the SAQ type cannot be changed here. Ask your assessor to reset it.',
        },
      };
    }

    await client.query(
      `UPDATE assessments
          SET saq_type = $2,
              variant = $3,
              eligibility = $4,
              eligibility_completed_at = now(),
              -- A different questionnaire from here on, so writes still in
              -- flight against the previous one are no longer valid.
              generation = generation + 1,
              updated_at = now()
        WHERE id = $1`,
      [req.assessment.id, outcome.saqType, outcome.variant, JSON.stringify(record)]
    );

    return {
      status: 200,
      body: {
        saqType: outcome.saqType,
        saq: outcome.saq,
        administered: outcome.administered,
        path: outcome.path,
        notes: outcome.notes,
      },
    };
  });

  res.status(status).json(body);
});

/** Clear a determination so the client can run the wizard again, when nothing has been answered. */
router.post('/:token/eligibility/reset', withAssessment, async (req, res) => {
  const { status, body } = await withLockedAssessment(req.assessment.id, async (client, current) => {
    if (current.status === 'submitted') {
      return { status: 409, body: { error: 'This assessment has been submitted and can no longer be changed.' } };
    }

    const { rows } = await client.query(
      'SELECT COUNT(*)::int AS count FROM answers WHERE assessment_id = $1 AND response IS NOT NULL',
      [req.assessment.id]
    );
    if (rows[0].count > 0) {
      return {
        status: 409,
        body: { error: 'The questionnaire has already been started. Ask your assessor to reset it.' },
      };
    }

    await client.query(
      `UPDATE assessments
          SET saq_type = NULL, variant = NULL, eligibility = NULL,
              eligibility_completed_at = NULL, generation = generation + 1,
              updated_at = now()
        WHERE id = $1`,
      [req.assessment.id]
    );
    return { status: 200, body: { ok: true } };
  });

  res.status(status).json(body);
});

router.put('/:token/answers/:questionId', withAssessment, requireVariant, async (req, res) => {
  const { response, justification = '', evidence = '' } = req.body || {};

  // Reject oversized text rather than silently truncating it: a client whose
  // compensating-control description was cut in half would not find out until
  // the assessor read the report. The type check comes first, so a value that
  // is not a string cannot slip past the limit and be coerced afterwards.
  for (const [field, value] of [['justification', justification], ['evidence', evidence]]) {
    if (typeof value !== 'string') {
      return res.status(400).json({ error: `The ${field} must be text.`, field });
    }
    if (value.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({
        error: `That ${field} is too long. The limit is ${MAX_TEXT_LENGTH.toLocaleString()} characters and you entered ${value.length.toLocaleString()}.`,
        field,
        limit: MAX_TEXT_LENGTH,
      });
    }
  }

  const clearing = response === null || response === '';
  if (!clearing && !RESPONSES[response]) {
    return res.status(400).json({ error: 'Invalid response value.' });
  }

  // Writes are ordered by (epoch, seq): the epoch is issued by the database when
  // the page loads, the sequence counts that page's writes. A write that carries
  // neither is opting out of ordering rather than claiming to be newest: it
  // applies unconditionally but leaves any higher watermark alone, so a write
  // still in flight from another page cannot use it to slip in afterwards.
  const rawGeneration = req.body?.generation;
  const hasGeneration = Number.isSafeInteger(rawGeneration) && rawGeneration >= 0;
  const rawEpoch = req.body?.epoch;
  const rawSeq = req.body?.seq;
  const ordered =
    Number.isSafeInteger(rawEpoch) && rawEpoch > 0 && Number.isSafeInteger(rawSeq) && rawSeq >= 0;
  const epoch = ordered ? rawEpoch : 0;
  const seq = ordered ? rawSeq : 0;

  const { status, body } = await withLockedAssessment(req.assessment.id, async (client, current) => {
    if (current.status === 'submitted') {
      return { status: 409, body: { error: 'This questionnaire has been submitted and can no longer be edited.' } };
    }
    // The SAQ type may have been reset or changed since this request read the
    // assessment, so the requirement is resolved against the locked row.
    if (!current.variant) {
      return { status: 409, body: { error: 'The eligibility questions have not been completed yet.' } };
    }

    // A reset deletes the answers, and with them the per-question watermarks
    // that would otherwise have caught a write still in flight from the page
    // that was filling in the old questionnaire. Once eligibility is settled
    // again that write would find a valid variant and an empty row, and restore
    // an answer the reset had deleted — into somebody's reassessment. The
    // generation says which questionnaire a write was written against.
    if (hasGeneration && Number(current.generation ?? 0) !== rawGeneration) {
      return {
        status: 409,
        body: {
          error: 'This questionnaire was reset or its SAQ type changed. Reload the page to continue.',
          stage: 'generation',
        },
      };
    }

    const question = getQuestion(current.variant, req.params.questionId);
    if (!question) {
      return {
        status: 409,
        body: { error: 'The questionnaire changed while you were answering. Reload the page to continue.' },
      };
    }
    if (!clearing && response === 'na' && !question.allowNA) {
      return {
        status: 400,
        body: {
          error: 'This requirement cannot be marked Not Applicable. It applies to every entity completing SAQ D.',
        },
      };
    }

    // Writes can reach here out of order: the page-hide flush sends with
    // `keepalive` outside the client's per-question queue, so a request carrying
    // older text can arrive after a newer one. The (epoch, seq) pair decides, not
    // arrival order — a write is applied only if it is at least as new as what is
    // stored. Clearing is an upsert too, storing a NULL response rather than
    // removing the row. Deleting it would take the watermark with it, and a write
    // still in flight carrying an older pair would then find no conflict and
    // resurrect the answer the client had just cleared.
    //
    // The stored pair only moves forward. An unordered write still overwrites the
    // answer, but it must not drag the watermark back to (0, 0) — that would
    // reopen the row to every stale write that the real watermark was excluding.
    //
    // The comparison is strict, so a version already stored is a no-op rather
    // than a second write. The page-hide flush sends a buffered edit without
    // removing it, so the debounce that follows sends the same (epoch, seq)
    // again: counted twice, the revision ran ahead of what the page could
    // account for and it blocked its own submission as though another window
    // had been editing.
    const { rows: written } = await client.query(
      `INSERT INTO answers (assessment_id, question_id, response, justification, evidence, client_epoch, client_seq)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (assessment_id, question_id)
       DO UPDATE SET response = EXCLUDED.response,
                     justification = EXCLUDED.justification,
                     evidence = EXCLUDED.evidence,
                     client_epoch = CASE
                       WHEN (EXCLUDED.client_epoch, EXCLUDED.client_seq)
                          >= (answers.client_epoch, answers.client_seq)
                       THEN EXCLUDED.client_epoch ELSE answers.client_epoch END,
                     client_seq = CASE
                       WHEN (EXCLUDED.client_epoch, EXCLUDED.client_seq)
                          >= (answers.client_epoch, answers.client_seq)
                       THEN EXCLUDED.client_seq ELSE answers.client_seq END,
                     updated_at = now()
         WHERE $8::boolean IS FALSE
            OR (answers.client_epoch, answers.client_seq) < (EXCLUDED.client_epoch, EXCLUDED.client_seq)
       RETURNING client_epoch`,
      [
        req.assessment.id,
        question.id,
        clearing ? null : response,
        clearing ? '' : justification,
        clearing ? '' : evidence,
        epoch,
        seq,
        ordered,
      ]
    );
    const applied = written.length > 0;

    // Which page's write is stored. The client compares this with its own epoch:
    // being superseded by itself is the ordinary case of a page-hide flush losing
    // to the edit that followed it, but being superseded by another epoch means a
    // second window is editing the same assessment and this page is now stale.
    let storedEpoch = written[0]?.client_epoch;
    if (!applied) {
      const { rows: stored } = await client.query(
        'SELECT client_epoch FROM answers WHERE assessment_id = $1 AND question_id = $2',
        [req.assessment.id, question.id]
      );
      storedEpoch = stored[0]?.client_epoch;
    }

    // Only a write that changed something moves the revision, so a client can
    // tell how far the answer set has advanced against how many writes of its own
    // it has sent. Anything beyond that came from somewhere else.
    const { rows: bumped } = await client.query(
      `UPDATE assessments
          SET answers_revision = answers_revision + $2, updated_at = now()
        WHERE id = $1
        RETURNING answers_revision`,
      [req.assessment.id, applied ? 1 : 0]
    );

    // A superseded write is not an error: a newer answer already won, which is
    // the outcome the client wanted.
    return {
      status: 200,
      body: {
        ok: true,
        cleared: clearing,
        applied,
        superseded: !applied,
        storedEpoch: storedEpoch === undefined || storedEpoch === null ? null : Number(storedEpoch),
        revision: Number(bumped[0].answers_revision),
      },
    };
  });

  res.status(status).json(body);
});

router.post('/:token/submit', withAssessment, requireVariant, async (req, res) => {
  const { name, title } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Enter the name of the person attesting to these answers.' });
  }

  // The revision the client believes it is attesting to, if it sent one.
  const claimed = req.body?.revision;
  const hasClaim = Number.isSafeInteger(claimed) && claimed >= 0;

  const { status, body } = await withLockedAssessment(req.assessment.id, async (client, current) => {
    if (current.status === 'submitted') {
      return { status: 409, body: { error: 'This questionnaire has already been submitted.' } };
    }
    if (!current.variant) {
      return { status: 409, body: { error: 'The eligibility questions have not been completed yet.' } };
    }

    // Per-answer ordering catches a second window editing the same requirement,
    // but not one editing a different requirement: that write conflicts with
    // nothing and this page never hears about it. Scoring here would then attest
    // an answer the signatory has never seen. The revision covers the whole
    // answer set, so any change from anywhere is caught before anything is
    // locked and signed.
    if (hasClaim && Number(current.answers_revision ?? 0) !== claimed) {
      return {
        status: 409,
        body: {
          error:
            'These answers have changed since this page loaded — the questionnaire is open somewhere else. ' +
            'Reload to see the current answers before submitting them.',
          stale: true,
          revision: Number(current.answers_revision ?? 0),
        },
      };
    }

    const { rows: answerRows } = await client.query(
      'SELECT question_id, response, justification, evidence FROM answers WHERE assessment_id = $1 AND response IS NOT NULL',
      [req.assessment.id]
    );
    const answers = Object.fromEntries(
      answerRows.map((row) => [
        row.question_id,
        { response: row.response, justification: row.justification, evidence: row.evidence },
      ])
    );

    // Scored under the lock, so the answers attested to are exactly the answers
    // stored: no save can land between scoring them and locking them.
    const result = scoreAssessment(current.variant, answers);

    if (result.determination === 'incomplete') {
      return {
        status: 400,
        body: {
          error: 'The questionnaire is not complete.',
          unanswered: result.unanswered.map((q) => q.id),
          missingJustification: result.missingJustification.map((q) => q.id),
        },
      };
    }

    await client.query(
      `UPDATE assessments
          SET status = 'submitted', submitted_at = now(), submitted_by = $2,
              submitted_title = $3, updated_at = now()
        WHERE id = $1`,
      [req.assessment.id, String(name).trim().slice(0, 200), String(title || '').trim().slice(0, 200) || null]
    );

    return { status: 200, body: { ok: true, result } };
  });

  res.status(status).json(body);
});

router.get('/:token/result', withAssessment, requireVariant, async (req, res) => {
  // From one snapshot: a reset landing between the two reads would otherwise
  // score the old questionnaire against the answers it had just deleted.
  const { assessment, answers } = await readSnapshot({ token: req.params.token });
  if (!assessment?.variant) {
    return res.status(409).json({ error: 'This assessment has no questionnaire to report on.', stage: 'eligibility' });
  }
  res.json({
    assessment: publicView(assessment),
    result: scoreAssessment(assessment.variant, answers),
  });
});

router.get('/:token/report.pdf', withAssessment, requireVariant, async (req, res) => {
  const { assessment, answers } = await readSnapshot({ token: req.params.token });
  if (!assessment?.variant) {
    return res.status(409).json({ error: 'This assessment has no questionnaire to report on.', stage: 'eligibility' });
  }
  // An approved remediation plan is included; a draft never is. Approval is the
  // assessor saying the advice is fit to send, and this is where it gets sent.
  const plan = await approvedPlan(assessment);
  buildGapReport(res, assessment, scoreAssessment(assessment.variant, answers), { plan });
});

router.get('/:token/aoc.pdf', withAssessment, requireVariant, async (req, res) => {
  // An attestation summary carries signature blocks. Before submission there is
  // nothing to attest to, so the client-facing copy is withheld until then; the
  // assessor can still pull a working copy from the admin side at any point.
  if (req.assessment.status !== 'submitted') {
    return res.status(409).json({
      error: 'The attestation summary is available once the questionnaire has been submitted.',
    });
  }

  const { assessment, answers } = await readSnapshot({ token: req.params.token });
  if (!assessment?.variant) {
    return res.status(409).json({ error: 'This assessment has no questionnaire to attest to.', stage: 'eligibility' });
  }
  buildAttestation(res, assessment, scoreAssessment(assessment.variant, answers));
});

export default router;
