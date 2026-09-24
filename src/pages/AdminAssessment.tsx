import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, FileText, RotateCcw, Trash2 } from 'lucide-react';
import { SaqResult } from '../components/SaqResult';
import { RemediationPlanCard } from '../components/RemediationPlan';
import { api } from '../api';
import { RESPONSES } from '../responses';
import {
  CopyLink,
  DeterminationCallout,
  ErrorCard,
  Header,
  Loading,
  Progress,
  SectionTable,
  Stat,
  formatDate,
} from '../components/ui';
import type { AdminAssessmentDetail, AnswerMap, GapEntry, Result } from '../types';

interface Payload {
  assessment: AdminAssessmentDetail;
  answers: AnswerMap;
  result: Result | null;
}

export default function AdminAssessment() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  const load = () =>
    api
      .get<Payload>(`/api/admin/assessments/${id}`)
      .then((payload) => {
        setData(payload);
        setNotes(payload.assessment.internalNotes || '');
      })
      .catch((err: any) => {
        if (err.status === 401) navigate('/admin/login', { replace: true });
        else setError(err.message);
      });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) {
    return (
      <>
        <Header />
        <main className="page page-narrow">
          <ErrorCard message={error} />
        </main>
      </>
    );
  }
  if (!data) {
    return (
      <>
        <Header />
        <main className="page">
          <Loading />
        </main>
      </>
    );
  }

  const { assessment, result } = data;
  const counts = result?.totals.counts;
  const reviewCount = counts ? counts['yes-ccw'] : 0;

  const saveNotes = async () => {
    await api.patch(`/api/admin/assessments/${id}`, { internalNotes: notes });
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const reopen = async () => {
    if (!confirm('Reopen this questionnaire so the client can edit their answers again?')) return;
    await api.post(`/api/admin/assessments/${id}/reopen`);
    load();
  };

  const resetEligibility = async () => {
    if (
      !confirm(
        `Reset the SAQ determination for ${assessment.clientName}? They will answer the eligibility questions again, and any answers already recorded will be deleted. This cannot be undone.`
      )
    )
      return;
    await api.post(`/api/admin/assessments/${id}/reset-eligibility`);
    load();
  };

  const remove = async () => {
    if (!confirm(`Permanently delete the assessment for ${assessment.clientName}, including all answers? This cannot be undone.`))
      return;
    await api.del(`/api/admin/assessments/${id}`);
    navigate('/admin', { replace: true });
  };

  return (
    <>
      <Header>
        <Link className="btn btn-secondary btn-sm" to="/admin">
          <ArrowLeft size={14} /> All assessments
        </Link>
      </Header>

      <main className="page">
        <div className="page-head">
          <h1>{assessment.clientName}</h1>
          <p>
            {assessment.saqName ?? 'SAQ not yet determined'} &middot; PCI DSS v4.0.1 &middot; Created{' '}
            {formatDate(assessment.createdAt)}
            {assessment.dba && <> &middot; DBA {assessment.dba}</>}
          </p>
        </div>

        {!result && (
          <div className="card">
            {assessment.saq && assessment.eligibility ? (
              <>
                <div className="callout callout-review">
                  <h3>Routed to {assessment.saq.name}</h3>
                  <p className="small" style={{ marginBottom: 0 }}>
                    The client's eligibility answers point to a questionnaire this tool does not administer, so there is
                    nothing for them to complete here. They have been shown this result and told you will follow up.
                  </p>
                </div>
                <div style={{ marginTop: 16 }}>
                  <SaqResult
                    saq={assessment.saq}
                    path={assessment.eligibility.path}
                    notes={assessment.eligibility.notes}
                  />
                </div>
              </>
            ) : (
              <div className="callout callout-info">
                <h3>Waiting on the client</h3>
                <p className="small" style={{ marginBottom: 0 }}>
                  They have not yet answered the eligibility questions, so the SAQ type is not settled. Send them their
                  link to begin.
                </p>
              </div>
            )}

            <div className="row" style={{ marginTop: 18 }}>
              <button className="btn btn-secondary" onClick={resetEligibility}>
                <RotateCcw size={15} /> Reset determination
              </button>
              <button className="btn btn-danger btn-sm" onClick={remove} style={{ marginLeft: 'auto' }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        )}

        {result && (
        <div className="card">
          <DeterminationCallout result={result} />

          <div style={{ margin: '16px 0 6px' }}>
            <div className="row-between small muted" style={{ marginBottom: 6 }}>
              <span>
                {result.totals.answered} of {result.totals.total} requirements answered
              </span>
              <span>{result.completionPercent}%</span>
            </div>
            <Progress percent={result.completionPercent} />
          </div>

          <div className="grid grid-stats" style={{ marginTop: 18 }}>
            <Stat label="In place" value={counts!.yes} tone="pass" />
            <Stat label="Not in place" value={counts!.no} tone={counts!.no ? 'fail' : undefined} />
            <Stat label="Not applicable" value={counts!.na} />
            <Stat label="Needs review" value={reviewCount} tone={reviewCount ? 'review' : undefined} />
            <Stat label="Unanswered" value={counts!.unanswered} />
            <Stat label="Applicable" value={result.totals.total} />
          </div>

          <div className="row" style={{ marginTop: 18 }}>
            <a className="btn" href={`/api/admin/assessments/${id}/report.pdf`}>
              <Download size={15} /> Full report (PDF)
            </a>
            <a className="btn btn-secondary" href={`/api/admin/assessments/${id}/aoc.pdf`}>
              <FileText size={15} /> Attestation summary (PDF)
            </a>
            {assessment.status === 'submitted' && (
              <button className="btn btn-secondary" onClick={reopen}>
                <RotateCcw size={15} /> Reopen for editing
              </button>
            )}
            <button className="btn btn-danger btn-sm" onClick={remove} style={{ marginLeft: 'auto' }}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
        )}

        <div className="card">
          <h2>Client link</h2>
          <p className="small muted">
            {assessment.status === 'submitted'
              ? 'This questionnaire has been submitted. The link now shows the client their result.'
              : 'Anyone with this link can complete the questionnaire. Share it directly with the intended contact.'}
          </p>
          <CopyLink link={assessment.link} />
          {assessment.submittedBy && (
            <p className="small muted" style={{ marginTop: 12, marginBottom: 0 }}>
              Attested by {assessment.submittedBy}
              {assessment.submittedTitle ? `, ${assessment.submittedTitle}` : ''} on {formatDate(assessment.submittedAt)}.
            </p>
          )}
        </div>

        {result && (
          <div className="card">
            <h2>Result by requirement</h2>
            <SectionTable sections={result.sections} />
          </div>
        )}

        {result && result.gaps.length > 0 && (
          <EntryList title="Failed requirements" tone="fail" entries={result.gaps} notesLabel="Client notes" />
        )}
        {result && result.reviewItems.length > 0 && (
          <EntryList
            title="Compensating controls"
            tone="review"
            entries={result.reviewItems}
            notesLabel="Control description"
            showResponse
          />
        )}
        {result && (result.gaps.length > 0 || result.reviewItems.length > 0) && (
          <RemediationPlanCard assessmentId={id} />
        )}

        {result && result.naItems.length > 0 && (
          <EntryList title="Marked Not Applicable" tone="muted" entries={result.naItems} notesLabel="Justification" />
        )}
        {result && result.unanswered.length > 0 && (
          <div className="card">
            <h2>
              Unanswered <span className="badge badge-muted">{result.unanswered.length}</span>
            </h2>
            <p className="small muted">
              {result.unanswered.map((q) => q.id).join(', ')}
            </p>
          </div>
        )}

        {result && assessment.eligibility && (
          <div className="card">
            <h2>How the SAQ type was determined</h2>
            <p className="small muted">
              The client's own answers on {formatDate(assessment.eligibilityCompletedAt)}. Kept as a record of how the
              scope was set.
            </p>
            <ol className="answer-summary">
              {assessment.eligibility.path.map((entry) => (
                <li key={entry.stepId}>
                  <span className="trail-question">{entry.question}</span>
                  <span className="small" style={{ fontWeight: 600 }}>
                    {entry.label}
                  </span>
                </li>
              ))}
            </ol>
            <div className="row" style={{ marginTop: 14 }}>
              <button className="btn btn-secondary btn-sm" onClick={resetEligibility}>
                <RotateCcw size={14} /> Reset determination
              </button>
              <span className="small muted">Deletes their answers and returns them to the eligibility questions.</span>
            </div>
          </div>
        )}

        {result && !assessment.eligibility && (
          <div className="card">
            <h2>SAQ type</h2>
            <p className="small muted">
              You chose {assessment.saqName} when creating this assessment, so the client did not answer the eligibility
              questions.
            </p>
            <div className="row" style={{ marginTop: 14 }}>
              <button className="btn btn-secondary btn-sm" onClick={resetEligibility}>
                <RotateCcw size={14} /> Reset determination
              </button>
              <span className="small muted">
                Deletes their answers and hands the choice to the client's eligibility answers instead.
              </span>
            </div>
          </div>
        )}

        <div className="card">
          <h2>Internal notes</h2>
          <p className="small muted">Visible only to you. Never shown to the client.</p>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn btn-secondary btn-sm" onClick={saveNotes}>
              Save notes
            </button>
            {notesSaved && <span className="small muted">Saved</span>}
          </div>
        </div>
      </main>
    </>
  );
}

function EntryList({
  title,
  tone,
  entries,
  notesLabel,
  showResponse,
}: {
  title: string;
  tone: 'fail' | 'review' | 'muted';
  entries: GapEntry[];
  notesLabel: string;
  showResponse?: boolean;
}) {
  const border = tone === 'fail' ? 'var(--fail)' : tone === 'review' ? 'var(--review)' : 'var(--line-strong)';
  return (
    <div className="card">
      <h2>
        {title} <span className={`badge badge-${tone}`}>{entries.length}</span>
      </h2>
      <div className="stack">
        {entries.map((entry) => (
          <div key={entry.id} style={{ borderLeft: `3px solid ${border}`, paddingLeft: 14 }}>
            <div className="row" style={{ gap: 9 }}>
              <span className="question-id">{entry.id}</span>
              <strong className="small">{entry.title}</strong>
              {showResponse && entry.response && (
                <span className="badge badge-review">{RESPONSES[entry.response].short}</span>
              )}
            </div>
            <p className="small muted" style={{ margin: '6px 0 0' }}>
              {entry.requirement}
            </p>
            {entry.justification && (
              <p className="small" style={{ margin: '8px 0 0' }}>
                <strong>{notesLabel}:</strong> {entry.justification}
              </p>
            )}
            {entry.evidence && (
              <p className="small muted" style={{ margin: '4px 0 0' }}>
                Evidence: {entry.evidence}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
