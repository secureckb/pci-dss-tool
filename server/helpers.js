import { query, pool } from './db.js';

/** Loads an assessment's answers keyed by question id, the shape the scorer expects. */
export async function loadAnswers(assessmentId) {
  const { rows } = await query(
    `SELECT question_id, response, justification, evidence, updated_at
       FROM answers
      WHERE assessment_id = $1 AND response IS NOT NULL`,
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

/**
 * Run a mutation against an assessment with its row locked, and with the row
 * re-read under that lock.
 *
 * Every write here has a read-then-write shape: check the status, count the
 * answers, decide. Taking the lock is not enough on its own — a request that
 * read the row before the lock and then waited for it will still be holding
 * values from before whatever it waited for. Guards have to run against the row
 * this function passes in, never against one loaded earlier in the request.
 *
 * The handler returns `{ status, body }`. Any 4xx or 5xx rolls the transaction
 * back, so a guard that rejects cannot leave a partial write behind.
 *
 * @param {string} assessmentId
 * @param {(client: import('pg').PoolClient, assessment: any) => Promise<{status: number, body: any}>} handler
 */
export async function withLockedAssessment(assessmentId, handler) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query('SELECT * FROM assessments WHERE id = $1 FOR UPDATE', [
      assessmentId,
    ]);
    if (!rows[0]) {
      await client.query('ROLLBACK');
      return { status: 404, body: { error: 'This assessment no longer exists.' } };
    }

    const outcome = await handler(client, rows[0]);
    if (outcome.status >= 400) {
      await client.query('ROLLBACK');
    } else {
      await client.query('COMMIT');
    }
    return outcome;
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}
