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
 * Issues the ordering epoch for one page load.
 *
 * Every session that opens the questionnaire gets a number from a single
 * database sequence, and tags its writes with (epoch, seq). Ordering therefore
 * depends on one clock — Postgres's — rather than on each device's. The earlier
 * scheme used `Date.now()` from the browser, which is monotonic only relative to
 * that one device: a laptop running fast set a watermark a phone could not
 * reach, and every edit made on the phone was discarded while it was told the
 * answer had saved.
 */
export async function issueEpoch() {
  const { rows } = await query("SELECT nextval('client_epoch_seq')::bigint AS epoch");
  return Number(rows[0].epoch);
}

/**
 * Reads an assessment and its answers from one database snapshot.
 *
 * The two used to be read separately, so a write committing between them
 * produced a payload holding the new answers under the old revision. The client
 * would then be refused at submission over a change it was already looking at,
 * and could only get out of it by reloading. A repeatable-read transaction
 * gives both from the same point in time.
 */
export async function readSnapshot(token) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN TRANSACTION READ ONLY ISOLATION LEVEL REPEATABLE READ');
    const { rows } = await client.query('SELECT * FROM assessments WHERE token = $1', [token]);
    const assessment = rows[0] || null;
    if (!assessment) {
      await client.query('COMMIT');
      return { assessment: null, answers: {} };
    }

    const { rows: answerRows } = await client.query(
      `SELECT question_id, response, justification, evidence, updated_at
         FROM answers
        WHERE assessment_id = $1 AND response IS NOT NULL`,
      [assessment.id]
    );
    await client.query('COMMIT');

    const answers = {};
    for (const row of answerRows) {
      answers[row.question_id] = {
        response: row.response,
        justification: row.justification,
        evidence: row.evidence,
        updatedAt: row.updated_at,
      };
    }
    return { assessment, answers };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

const warnedHosts = new Set();

/**
 * Base URL for client invite links.
 *
 * PUBLIC_BASE_URL wins, so links stay stable behind a proxy. The fallback is the
 * requesting host, which is a header: a request reaching this service with a
 * Host that is not really this deployment produces a link carrying a live bearer
 * token on somebody else's origin, and an assessor would have no way to tell
 * from looking at it. That is fine for local development and not fine in
 * production, so the fallback says so — in the log and to the admin UI, which
 * shows the warning beside the link it just generated.
 */
export function publicBaseUrl(req) {
  const configured = process.env.PUBLIC_BASE_URL;
  if (configured) return configured.replace(/\/+$/, '');
  const proto = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('host');
  if (!isLocalHost(host) && !warnedHosts.has(host)) {
    warnedHosts.add(host);
    console.warn(
      `PUBLIC_BASE_URL is not set, so client links are being built from the Host header ("${host}"). ` +
        'Set PUBLIC_BASE_URL to this deployment\'s address: a request arriving with another host would ' +
        'otherwise produce a link that puts a working client token on that host.'
    );
  }
  return `${proto}://${host}`;
}

/** Whether generated links would point at a developer's own machine. IPv6 hosts
 *  are bracketed with the port outside the brackets, so they cannot be split on
 *  the first colon. */
export function isLocalHost(host) {
  const raw = (host || '').trim().toLowerCase();
  const name = raw.startsWith('[') ? raw.slice(1, raw.indexOf(']')) : raw.split(':')[0];
  return name === 'localhost' || name === '127.0.0.1' || name === '::1';
}

/** True when a link was built from the request rather than from configuration. */
export function linkBaseIsFromRequest(req) {
  return !process.env.PUBLIC_BASE_URL && !isLocalHost(req.get('host'));
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
