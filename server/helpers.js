import { query } from './db.js';

/** Loads an assessment's answers keyed by question id, the shape the scorer expects. */
export async function loadAnswers(assessmentId) {
  const { rows } = await query(
    'SELECT question_id, response, justification, evidence, updated_at FROM answers WHERE assessment_id = $1',
    [assessmentId]
  );
  const answers = {};
  for (const row of rows) {
    answers[row.question_id] = {
      response: row.response,
      justification: row.justification,
      evidence: row.evidence,
      updatedAt: row.updated_at,
    };
  }
  return answers;
}

/**
 * Base URL for client invite links. PUBLIC_BASE_URL wins so links stay stable
 * behind a proxy; otherwise fall back to the request's own origin.
 */
export function publicBaseUrl(req) {
  const configured = process.env.PUBLIC_BASE_URL;
  if (configured) return configured.replace(/\/+$/, '');
  const proto = req.get('x-forwarded-proto') || req.protocol;
  return `${proto}://${req.get('host')}`;
}
