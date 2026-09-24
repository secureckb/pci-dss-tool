/**
 * The advisor's HTTP surface. Assessor-only, and read-only with respect to the
 * assessment itself.
 *
 * Registered onto the admin router, behind its session check, so nothing here is
 * reachable from a client's questionnaire link. That is deliberate and is the
 * main reason the advisor is safe to have at all: a client never sees model
 * output, so no drafted text can nudge the answers that the determination is
 * computed from, and there is no path by which text a client typed becomes an
 * instruction acted on in their own assessment.
 *
 * A run is started in the background and polled. It reads a dozen requirements
 * and writes an item per gap, which takes longer than a request should be held
 * open for, and a plan whose drafting survives a closed laptop lid is worth the
 * extra call.
 */
import { scoreAssessment } from '../../shared/scoring.js';
import { readSnapshot } from '../helpers.js';
import {
  AgentUnavailableError,
  agentConfigured,
  agentModel,
  runRemediationAgent,
} from '../agent/runtime.js';
import {
  approvedPlan,
  currentPlan,
  finishRun,
  recentRuns,
  runInFlight,
  runTranscript,
  savePlan,
  setPlanStatus,
  startRun,
} from '../agent/store.js';

/** Gaps, compensating controls, and answers missing a mandatory justification. */
function countWork(scored) {
  const ids = new Set();
  for (const entry of scored.gaps) ids.add(entry.id);
  for (const entry of scored.reviewItems) ids.add(entry.id);
  for (const entry of scored.missingJustification) ids.add(entry.id);
  return ids.size;
}

export function registerRemediationRoutes(router) {
  router.get('/assessments/:id/remediation', async (req, res) => {
    const { assessment, answers } = await readSnapshot({ id: req.params.id });
    if (!assessment) return res.status(404).json({ error: 'Assessment not found.' });

    const scored = assessment.variant ? scoreAssessment(assessment.variant, answers) : null;
    const [plan, approved, running, runs] = await Promise.all([
      currentPlan(assessment),
      approvedPlan(assessment),
      runInFlight(assessment.id),
      recentRuns(assessment.id),
    ]);

    res.json({
      configured: agentConfigured(),
      model: agentModel(),
      gapCount: scored ? countWork(scored) : 0,
      running: running ? { id: running.id, startedAt: running.started_at } : null,
      plan,
      approvedPlanId: approved?.id ?? null,
      runs,
    });
  });

  router.post('/assessments/:id/remediation', async (req, res) => {
    if (!agentConfigured()) {
      return res.status(503).json({
        error:
          'The remediation advisor is not configured on this deployment. Set ANTHROPIC_API_KEY to enable it; ' +
          'scoring, reports and attestations do not depend on it.',
        configured: false,
      });
    }

    const { assessment, answers } = await readSnapshot({ id: req.params.id });
    if (!assessment) return res.status(404).json({ error: 'Assessment not found.' });
    if (!assessment.variant) {
      return res.status(409).json({ error: 'This assessment has no questionnaire yet, so there is nothing to remediate.' });
    }

    const scored = scoreAssessment(assessment.variant, answers);
    if (countWork(scored) === 0) {
      return res.status(409).json({
        error:
          'Nothing in this assessment needs remediation: no requirement was answered "No", none rests on a ' +
          'compensating control, and no mandatory justification is missing.',
      });
    }

    const already = await runInFlight(assessment.id);
    if (already) {
      return res.status(409).json({
        error: 'A plan is already being drafted for this assessment.',
        running: { id: already.id, startedAt: already.started_at },
      });
    }

    const runId = await startRun({ assessmentId: assessment.id, model: agentModel() });

    // Deliberately not awaited: the response returns now and the client polls.
    // Errors are recorded against the run rather than thrown into nothing, which
    // is the only way the assessor ever finds out a run failed.
    runRemediationAgent({ assessment, scored })
      .then(async (draft) => {
        const planId = await savePlan({ assessment, scored, draft });
        await finishRun({
          id: runId,
          planId,
          status: 'succeeded',
          iterations: draft.iterations,
          usage: draft.usage,
          stopReason: draft.stopReason,
          transcript: draft.transcript,
        });
        if (draft.unaddressed.length) {
          console.warn(
            `Remediation plan ${planId} left ${draft.unaddressed.length} gap(s) without an item: ` +
              draft.unaddressed.join(', ')
          );
        }
      })
      .catch(async (err) => {
        console.error('Remediation run failed:', err);
        await finishRun({
          id: runId,
          status: 'failed',
          stopReason: null,
          transcript: [],
          error: err instanceof AgentUnavailableError ? err.message : err?.message || 'Unknown failure.',
        }).catch((writeErr) => console.error('Could not record the failed run:', writeErr));
      });

    res.status(202).json({ started: true, runId, gapCount: countWork(scored) });
  });

  router.post('/assessments/:id/remediation/:planId/approve', async (req, res) => {
    const ok = await setPlanStatus({ assessmentId: req.params.id, planId: req.params.planId, status: 'approved' });
    if (!ok) return res.status(404).json({ error: 'That plan does not belong to this assessment.' });
    res.json({ ok: true, status: 'approved' });
  });

  router.post('/assessments/:id/remediation/:planId/discard', async (req, res) => {
    const ok = await setPlanStatus({ assessmentId: req.params.id, planId: req.params.planId, status: 'discarded' });
    if (!ok) return res.status(404).json({ error: 'That plan does not belong to this assessment.' });
    res.json({ ok: true, status: 'discarded' });
  });

  router.get('/assessments/:id/remediation/run/:runId', async (req, res) => {
    const run = await runTranscript({ assessmentId: req.params.id, runId: req.params.runId });
    if (!run) return res.status(404).json({ error: 'That run does not belong to this assessment.' });
    res.json({
      id: run.id,
      model: run.model,
      status: run.status,
      startedAt: run.started_at,
      finishedAt: run.finished_at,
      transcript: run.transcript,
    });
  });
}
