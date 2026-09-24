import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, Loader2, RefreshCw, Sparkles, Trash2 } from 'lucide-react';
import { api } from '../api';
import { formatDate } from './ui';
import type { RemediationState } from '../types';

/**
 * The remediation advisor, from the assessor's side.
 *
 * Three things this deliberately keeps in front of whoever is reading it: that
 * the plan was machine-drafted, that it is a draft until they approve it, and
 * that approving it puts it in the client's own report. An advisory tool that
 * hides any of those reads as a finding, which is not what it is.
 *
 * A run happens in the background, so this polls while one is in flight rather
 * than holding a request open for a minute and a half.
 */
const POLL_MS = 3000;

export function RemediationPlanCard({ assessmentId }: { assessmentId: string }) {
  const [state, setState] = useState<RemediationState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showRuns, setShowRuns] = useState(false);
  // Held in a ref as well, so the poll can compare without re-subscribing.
  const runningRef = useRef(false);

  const load = useCallback(async () => {
    try {
      const next = await api.get<RemediationState>(`/api/admin/assessments/${assessmentId}/remediation`);
      runningRef.current = Boolean(next.running);
      setState(next);
      // A run that failed reports through the run log; surface its reason once
      // rather than leaving the card looking as though nothing happened.
      const latest = next.runs[0];
      if (!next.running && latest?.status === 'failed' && latest.error) setError(latest.error);
      return next;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [assessmentId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!state?.running) return;
    const timer = setInterval(() => {
      if (runningRef.current) load();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [state?.running, load]);

  const draft = async () => {
    setError(null);
    setBusy(true);
    try {
      await api.post(`/api/admin/assessments/${assessmentId}/remediation`);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const setStatus = async (planId: string, status: 'approve' | 'discard') => {
    if (
      status === 'approve' &&
      !confirm(
        'Approve this plan? It will be added to the full report, including the copy the client can download, and ' +
          'marked there as AI-drafted and assessor-approved.'
      )
    )
      return;
    setError(null);
    setBusy(true);
    try {
      await api.post(`/api/admin/assessments/${assessmentId}/remediation/${planId}/${status}`);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!state) return null;

  if (!state.configured) {
    return (
      <div className="card">
        <h2>Remediation advisor</h2>
        <p className="small muted" style={{ marginBottom: 0 }}>
          Not configured on this deployment. Set <code>ANTHROPIC_API_KEY</code> to have failed requirements drafted into
          a remediation plan for your review. Scoring, reports and attestations do not depend on it and are unaffected.
        </p>
      </div>
    );
  }

  const { plan, running } = state;

  return (
    <div className="card">
      <div className="row-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Remediation advisor</h2>
          <p className="small muted" style={{ marginBottom: 0 }}>
            Drafts a remediation plan for the {state.gapCount} requirement{state.gapCount === 1 ? '' : 's'} that did not
            pass. It reads the requirement text and what the client wrote; it cannot see or change their answers, and it
            has no part in the determination.
          </p>
        </div>
        {plan && (
          <span className={`badge ${plan.status === 'approved' ? 'badge-pass' : 'badge-muted'}`}>
            {plan.status === 'approved' ? 'Approved' : 'Draft'}
          </span>
        )}
      </div>

      {error && (
        <div className="callout callout-fail" style={{ marginTop: 14 }}>
          <p className="small" style={{ marginBottom: 0 }}>{error}</p>
        </div>
      )}

      {running && (
        <div className="callout callout-info" style={{ marginTop: 14 }}>
          <p className="small" style={{ marginBottom: 0 }}>
            <Loader2 size={14} className="spin" style={{ verticalAlign: '-2px', marginRight: 6 }} />
            Drafting. It reads each failed requirement before writing about it, so this takes a minute or two. You can
            leave this page.
          </p>
        </div>
      )}

      {plan?.stale && (
        <div className="callout callout-review" style={{ marginTop: 14 }}>
          <h3>
            <AlertTriangle size={15} style={{ verticalAlign: '-2px', marginRight: 6 }} />
            The assessment has changed since this plan was drafted
          </h3>
          <p className="small" style={{ marginBottom: 0 }}>
            It was written about an earlier set of answers. Draft it again before relying on it.
          </p>
        </div>
      )}

      {!running && state.gapCount === 0 && !plan && (
        <p className="small muted" style={{ marginTop: 14, marginBottom: 0 }}>
          Nothing in this assessment needs remediation yet.
        </p>
      )}

      {plan && (
        <>
          {plan.overview && (
            <div style={{ marginTop: 16 }}>
              <h3 className="small" style={{ marginBottom: 6 }}>Overview</h3>
              <p className="small" style={{ whiteSpace: 'pre-wrap' }}>{plan.overview}</p>
            </div>
          )}

          <div className="stack" style={{ marginTop: 16 }}>
            {plan.items.map((item) => (
              <div
                key={item.questionId}
                style={{ borderLeft: '3px solid var(--line-strong)', paddingLeft: 14 }}
              >
                <button
                  type="button"
                  className="row"
                  style={{ gap: 9, background: 'none', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left' }}
                  onClick={() => setExpanded(expanded === item.questionId ? null : item.questionId)}
                >
                  <span className="badge badge-muted">{item.priority}</span>
                  <span className="question-id">{item.questionId}</span>
                  <strong className="small">{item.summary.split('. ')[0]}</strong>
                </button>

                {expanded === item.questionId && (
                  <div style={{ marginTop: 8 }}>
                    <p className="small">{item.summary}</p>
                    <p className="small" style={{ whiteSpace: 'pre-wrap' }}>
                      <strong>Actions:</strong>
                      {'\n'}
                      {item.steps}
                    </p>
                    {item.evidence && (
                      <p className="small muted">
                        <strong>Evidence to close:</strong> {item.evidence}
                      </p>
                    )}
                    {item.related && (
                      <p className="small muted">
                        <strong>Related:</strong> {item.related}
                      </p>
                    )}
                    <p className="small muted" style={{ marginBottom: 0 }}>
                      {[item.ownerRole && `Owner: ${item.ownerRole}`, item.effort && `Effort: ${item.effort}`]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="small muted" style={{ marginTop: 16 }}>
            Drafted {formatDate(plan.createdAt)} by {plan.model} (brief {plan.promptVersion}) for {plan.items.length}{' '}
            requirement{plan.items.length === 1 ? '' : 's'}.
            {plan.status === 'approved'
              ? ` Approved ${formatDate(plan.reviewedAt)}; it now appears in the full report, including the client's copy.`
              : ' It is not in any report until you approve it.'}
          </p>
        </>
      )}

      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn btn-secondary" onClick={draft} disabled={busy || Boolean(running) || state.gapCount === 0}>
          {plan ? <RefreshCw size={15} /> : <Sparkles size={15} />}
          {plan ? 'Draft again' : 'Draft a plan'}
        </button>
        {plan && plan.status === 'draft' && (
          <button className="btn" onClick={() => setStatus(plan.id, 'approve')} disabled={busy || Boolean(running)}>
            <Check size={15} /> Approve for the report
          </button>
        )}
        {plan && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => setStatus(plan.id, 'discard')}
            disabled={busy || Boolean(running)}
          >
            <Trash2 size={14} /> Discard
          </button>
        )}
        {state.runs.length > 0 && (
          <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowRuns(!showRuns)}>
            {showRuns ? 'Hide' : 'Show'} run log
          </button>
        )}
      </div>

      {showRuns && (
        <div style={{ marginTop: 16 }}>
          <p className="small muted">
            Every drafting run, whether or not it produced a plan. Kept because advice from a model cannot be re-derived
            the way a score can, so the run is the only record of where it came from.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Started</th>
                  <th>Model</th>
                  <th className="num">Turns</th>
                  <th className="num">Tokens in/out</th>
                  <th>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {state.runs.map((run) => (
                  <tr key={run.id}>
                    <td className="small">{new Date(run.startedAt).toLocaleString()}</td>
                    <td className="small muted">{run.model}</td>
                    <td className="num small">{run.iterations}</td>
                    <td className="num small muted">
                      {run.inputTokens.toLocaleString()} / {run.outputTokens.toLocaleString()}
                    </td>
                    <td className="small">
                      {run.status === 'succeeded' ? (
                        <span className="badge badge-pass">Drafted</span>
                      ) : run.status === 'running' ? (
                        <span className="badge badge-muted">Running</span>
                      ) : (
                        <>
                          <span className="badge badge-fail">Failed</span>
                          {run.error && <div className="small muted">{run.error}</div>}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
