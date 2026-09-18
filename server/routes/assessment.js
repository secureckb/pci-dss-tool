import { asyncRouter } from '../async-router.js';
import { query } from '../db.js';
import { scoreAssessment, RESPONSES } from '../../shared/scoring.js';
import { getSections, getQuestion, VARIANTS } from '../../shared/questions/index.js';
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

function publicView(assessment) {
  return {
    variant: assessment.variant,
    variantLabel: VARIANTS[assessment.variant].label,
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
  const answers = await loadAnswers(req.assessment.id);
  res.json({
    assessment: publicView(req.assessment),
    sections: getSections(req.assessment.variant),
    answers,
    result: scoreAssessment(req.assessment.variant, answers),
  });
});

router.put('/:token/answers/:questionId', withAssessment, async (req, res) => {
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

router.post('/:token/submit', withAssessment, async (req, res) => {
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

router.get('/:token/result', withAssessment, async (req, res) => {
  const answers = await loadAnswers(req.assessment.id);
  res.json({
    assessment: publicView(req.assessment),
    result: scoreAssessment(req.assessment.variant, answers),
  });
});

router.get('/:token/report.pdf', withAssessment, async (req, res) => {
  const answers = await loadAnswers(req.assessment.id);
  const result = scoreAssessment(req.assessment.variant, answers);
  buildGapReport(res, req.assessment, result, answers);
});

router.get('/:token/aoc.pdf', withAssessment, async (req, res) => {
  const answers = await loadAnswers(req.assessment.id);
  const result = scoreAssessment(req.assessment.variant, answers);
  buildAttestation(res, req.assessment, result);
});

export default router;
