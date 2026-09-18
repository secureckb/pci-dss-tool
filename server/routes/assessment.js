import { asyncRouter } from '../async-router.js';
import { query } from '../db.js';
import { scoreAssessment, RESPONSES } from '../../shared/scoring.js';
import { getSections, getQuestion, VARIANTS } from '../../shared/questions/index.js';
import { determineSaq, prunedAnswers, ELIGIBILITY_STEPS, FIRST_STEP, SAQ_TYPES } from '../../shared/eligibility.js';
import { buildGapReport, buildAttestation } from '../pdf.js';
import { loadAnswers } from '../helpers.js';

const router = asyncRouter();

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

  const answers = await loadAnswers(req.assessment.id);
  res.json({
    stage: 'questionnaire',
    assessment: publicView(req.assessment),
    sections: getSections(req.assessment.variant),
    answers,
    result: scoreAssessment(req.assessment.variant, answers),
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
  if (req.assessment.status === 'submitted') {
    return res.status(409).json({ error: 'This assessment has been submitted and can no longer be changed.' });
  }

  const { rows: answerCount } = await query(
    'SELECT COUNT(*)::int AS count FROM answers WHERE assessment_id = $1',
    [req.assessment.id]
  );
  if (req.assessment.eligibility_completed_at && answerCount[0].count > 0) {
    return res.status(409).json({
      error:
        'The questionnaire has already been started, so the SAQ type cannot be changed here. Ask your assessor to reset it.',
    });
  }

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

  await query(
    `UPDATE assessments
        SET saq_type = $2,
            variant = $3,
            eligibility = $4,
            eligibility_completed_at = now(),
            updated_at = now()
      WHERE id = $1`,
    [req.assessment.id, outcome.saqType, outcome.variant, JSON.stringify(record)]
  );

  res.json({
    saqType: outcome.saqType,
    saq: outcome.saq,
    administered: outcome.administered,
    path: outcome.path,
    notes: outcome.notes,
  });
});

/** Clear a determination so the client can run the wizard again, when nothing has been answered. */
router.post('/:token/eligibility/reset', withAssessment, async (req, res) => {
  if (req.assessment.status === 'submitted') {
    return res.status(409).json({ error: 'This assessment has been submitted and can no longer be changed.' });
  }

  const { rows } = await query('SELECT COUNT(*)::int AS count FROM answers WHERE assessment_id = $1', [
    req.assessment.id,
  ]);
  if (rows[0].count > 0) {
    return res.status(409).json({
      error: 'The questionnaire has already been started. Ask your assessor to reset it.',
    });
  }

  await query(
    `UPDATE assessments
        SET saq_type = NULL, variant = NULL, eligibility = NULL,
            eligibility_completed_at = NULL, updated_at = now()
      WHERE id = $1`,
    [req.assessment.id]
  );
  res.json({ ok: true });
});

router.put('/:token/answers/:questionId', withAssessment, requireVariant, async (req, res) => {
  if (req.assessment.status === 'submitted') {
    return res.status(409).json({ error: 'This questionnaire has been submitted and can no longer be edited.' });
  }

  const question = getQuestion(req.assessment.variant, req.params.questionId);
  if (!question) {
    return res.status(404).json({ error: 'Unknown requirement for this questionnaire.' });
  }

  const { response, justification = '', evidence = '' } = req.body || {};

  // Clearing an answer removes the row rather than storing an empty response.
  if (response === null || response === '') {
    await query('DELETE FROM answers WHERE assessment_id = $1 AND question_id = $2', [
      req.assessment.id,
      question.id,
    ]);
    await query('UPDATE assessments SET updated_at = now() WHERE id = $1', [req.assessment.id]);
    return res.json({ ok: true, cleared: true });
  }

  if (!RESPONSES[response]) {
    return res.status(400).json({ error: 'Invalid response value.' });
  }
  if (response === 'na' && !question.allowNA) {
    return res.status(400).json({
      error: 'This requirement cannot be marked Not Applicable. It applies to every entity completing SAQ D.',
    });
  }

  await query(
    `INSERT INTO answers (assessment_id, question_id, response, justification, evidence)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (assessment_id, question_id)
     DO UPDATE SET response = EXCLUDED.response,
                   justification = EXCLUDED.justification,
                   evidence = EXCLUDED.evidence,
                   updated_at = now()`,
    [req.assessment.id, question.id, response, String(justification).slice(0, 4000), String(evidence).slice(0, 4000)]
  );
  await query('UPDATE assessments SET updated_at = now() WHERE id = $1', [req.assessment.id]);

  res.json({ ok: true });
});

router.post('/:token/submit', withAssessment, requireVariant, async (req, res) => {
  if (req.assessment.status === 'submitted') {
    return res.status(409).json({ error: 'This questionnaire has already been submitted.' });
  }

  const answers = await loadAnswers(req.assessment.id);
  const result = scoreAssessment(req.assessment.variant, answers);

  // An incomplete questionnaire cannot produce a determination, so it cannot be submitted.
  if (result.determination === 'incomplete') {
    return res.status(400).json({
      error: 'The questionnaire is not complete.',
      unanswered: result.unanswered.map((q) => q.id),
      missingJustification: result.missingJustification.map((q) => q.id),
    });
  }

  const { name, title } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Enter the name of the person attesting to these answers.' });
  }

  await query(
    `UPDATE assessments
        SET status = 'submitted', submitted_at = now(), submitted_by = $2,
            submitted_title = $3, updated_at = now()
      WHERE id = $1`,
    [req.assessment.id, String(name).trim().slice(0, 200), String(title || '').trim().slice(0, 200) || null]
  );

  res.json({ ok: true, result });
});

router.get('/:token/result', withAssessment, requireVariant, async (req, res) => {
  const answers = await loadAnswers(req.assessment.id);
  res.json({
    assessment: publicView(req.assessment),
    result: scoreAssessment(req.assessment.variant, answers),
  });
});

router.get('/:token/report.pdf', withAssessment, requireVariant, async (req, res) => {
  const answers = await loadAnswers(req.assessment.id);
  const result = scoreAssessment(req.assessment.variant, answers);
  buildGapReport(res, req.assessment, result, answers);
});

router.get('/:token/aoc.pdf', withAssessment, requireVariant, async (req, res) => {
  const answers = await loadAnswers(req.assessment.id);
  const result = scoreAssessment(req.assessment.variant, answers);
  buildAttestation(res, req.assessment, result);
});

export default router;
