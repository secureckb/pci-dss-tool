/**
 * Persistence for the advisor: plans, their items, and the record of every run.
 *
 * A plan is stored against the answers_revision and generation it was drafted
 * from. That is what lets the UI say "this plan was written about answers the
 * client has since changed" instead of presenting it as current — the same
 * staleness mechanism the questionnaire already uses, applied to advice.
 */
import crypto from 'node:crypto';
import { query, pool } from '../db.js';

/** A run still marked running after this long was interrupted — a restart, a
 *  crash — and should not block the next one forever. */
const RUN_STALE_MS = 15 * 60 * 1000;

export async function startRun({ assessmentId, model }) {
  const id = crypto.randomUUID();
  await query(
    `INSERT INTO agent_runs (id, assessment_id, status, model) VALUES ($1, $2, 'running', $3)`,
    [id, assessmentId, model]
  );
  return id;
}

export async function finishRun({ id, planId, status, iterations, usage, stopReason, transcript, error }) {
  await query(
    `UPDATE agent_runs
        SET plan_id = $2, status = $3, iterations = $4, input_tokens = $5, output_tokens = $6,
            stop_reason = $7, error = $8, transcript = $9::jsonb, finished_at = now()
      WHERE id = $1`,
    [
      id,
      planId || null,
      status,
      iterations || 0,
      usage?.input_tokens || 0,
      usage?.output_tokens || 0,
      stopReason || null,
      error ? String(error).slice(0, 2000) : null,
      JSON.stringify(transcript || []),
    ]
  );
}

/**
 * Whether a run is already in flight for this assessment.
 *
 * Two concurrent runs would bill twice and race each other's drafts for no
 * benefit, and the obvious way to cause it is an assessor clicking twice.
 */
export async function runInFlight(assessmentId) {
  await query(
    `UPDATE agent_runs
        SET status = 'failed', error = 'The run was interrupted before it finished.', finished_at = now()
      WHERE assessment_id = $1 AND status = 'running' AND started_at < now() - ($2 || ' milliseconds')::interval`,
    [assessmentId, String(RUN_STALE_MS)]
  );
  const { rows } = await query(
    `SELECT id, started_at FROM agent_runs WHERE assessment_id = $1 AND status = 'running' LIMIT 1`,
    [assessmentId]
  );
  return rows[0] || null;
}

/**
 * Writes a plan and its items in one transaction, retiring any earlier draft.
 *
 * Approved plans are left exactly as they are. They are a record of what an
 * assessor signed off on, and a later draft does not change what was approved
 * last month; the newest approved plan is simply the one the report uses.
 */
export async function savePlan({ assessment, scored, draft }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE remediation_plans SET status = 'discarded', reviewed_at = now()
        WHERE assessment_id = $1 AND status = 'draft'`,
      [assessment.id]
    );

    const id = crypto.randomUUID();
    await client.query(
      `INSERT INTO remediation_plans
         (id, assessment_id, answers_revision, generation, determination, gap_count, overview, model, prompt_version)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        id,
        assessment.id,
        assessment.answers_revision,
        assessment.generation,
        scored.determination,
        draft.items.length,
        draft.overview,
        draft.model,
        draft.promptVersion,
      ]
    );

    for (const item of draft.items) {
      await client.query(
        `INSERT INTO remediation_items
           (plan_id, question_id, priority, summary, steps, evidence, effort, owner_role, related)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [id, item.question_id, item.priority, item.summary, item.steps, item.evidence, item.effort, item.owner_role, item.related]
      );
    }

    await client.query('COMMIT');
    return id;
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

function shapePlan(row, items, assessment) {
  return {
    id: row.id,
    status: row.status,
    determination: row.determination,
    gapCount: row.gap_count,
    overview: row.overview,
    model: row.model,
    promptVersion: row.prompt_version,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
    // True once the assessment has moved under the plan: answers changed, or the
    // questionnaire itself was replaced. The advice may still be sound, but it
    // was written about something else and should not be read as current.
    stale:
      assessment
        ? String(row.answers_revision) !== String(assessment.answers_revision) ||
          String(row.generation) !== String(assessment.generation)
        : false,
    items: items.map((item) => ({
      questionId: item.question_id,
      priority: item.priority,
      summary: item.summary,
      steps: item.steps,
      evidence: item.evidence,
      effort: item.effort,
      ownerRole: item.owner_role,
      related: item.related,
    })),
  };
}

async function loadPlanRow(row, assessment) {
  if (!row) return null;
  const { rows: items } = await query(
    `SELECT * FROM remediation_items WHERE plan_id = $1 ORDER BY priority, question_id`,
    [row.id]
  );
  return shapePlan(row, items, assessment);
}

/** The plan an assessor is currently working with: the newest one not discarded. */
export async function currentPlan(assessment) {
  const { rows } = await query(
    `SELECT * FROM remediation_plans
      WHERE assessment_id = $1 AND status <> 'discarded'
      ORDER BY created_at DESC LIMIT 1`,
    [assessment.id]
  );
  return loadPlanRow(rows[0], assessment);
}

/**
 * The newest approved plan, or nothing.
 *
 * This is the only path by which advisor output reaches a document that leaves
 * the tool. An unapproved draft is visible to the assessor in the console and
 * nowhere else.
 */
export async function approvedPlan(assessment) {
  const { rows } = await query(
    `SELECT * FROM remediation_plans
      WHERE assessment_id = $1 AND status = 'approved'
      ORDER BY created_at DESC LIMIT 1`,
    [assessment.id]
  );
  return loadPlanRow(rows[0], assessment);
}

export async function setPlanStatus({ assessmentId, planId, status }) {
  const { rowCount } = await query(
    `UPDATE remediation_plans SET status = $3, reviewed_at = now()
      WHERE id = $1 AND assessment_id = $2`,
    [planId, assessmentId, status]
  );
  return rowCount > 0;
}

/** The run log for one assessment, newest first. The transcript is left out
 *  here and fetched per run, since it is the largest column by far. */
export async function recentRuns(assessmentId, limit = 10) {
  const { rows } = await query(
    `SELECT id, plan_id, status, model, iterations, input_tokens, output_tokens, stop_reason, error,
            started_at, finished_at
       FROM agent_runs WHERE assessment_id = $1
      ORDER BY started_at DESC LIMIT $2`,
    [assessmentId, limit]
  );
  return rows.map((row) => ({
    id: row.id,
    planId: row.plan_id,
    status: row.status,
    model: row.model,
    iterations: row.iterations,
    inputTokens: row.input_tokens,
    outputTokens: row.output_tokens,
    stopReason: row.stop_reason,
    error: row.error,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
  }));
}

/** One run's full transcript: every tool call the model made and what it got
 *  back. The audit record for a component that cannot be re-run to the same
 *  answer. */
export async function runTranscript({ assessmentId, runId }) {
  const { rows } = await query(
    `SELECT id, transcript, model, status, started_at, finished_at
       FROM agent_runs WHERE id = $1 AND assessment_id = $2`,
    [runId, assessmentId]
  );
  return rows[0] || null;
}
