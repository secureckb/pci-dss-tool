import React from 'react';
import { CircleCheck, Info, TriangleAlert } from 'lucide-react';
import type { EligibilityPathEntry, SaqType } from '../types';

/**
 * The outcome of the eligibility wizard: which SAQ applies, why, and what to do
 * next. Used by the public wizard and by a client whose link routed them to an
 * SAQ this tool does not administer.
 */
export function SaqResult({
  saq,
  path,
  notes,
  children,
}: {
  saq: SaqType;
  path: EligibilityPathEntry[];
  notes?: { stepId: string; note: string }[];
  children?: React.ReactNode;
}) {
  const needsReview = saq.key === 'review-needed';
  const administered = Boolean(saq.variant);

  return (
    <>
      <div className="card">
        <div className={`callout callout-${needsReview ? 'review' : administered ? 'pass' : 'info'}`}>
          <p className="small" style={{ margin: '0 0 4px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
            {needsReview ? 'No single answer yet' : 'You should complete'}
          </p>
          <h2 style={{ marginBottom: 4 }}>{saq.name}</h2>
          <p className="small" style={{ marginBottom: 0, fontWeight: 500 }}>
            {saq.headline}
          </p>
        </div>

        <p style={{ marginTop: 16 }}>{saq.summary}</p>
        <p className="small muted" style={{ marginBottom: 0 }}>
          <strong>Scope:</strong> {saq.scope}
        </p>

        {children}
      </div>

      {notes && notes.length > 0 && (
        <div className="card">
          <h3 className="row" style={{ gap: 8 }}>
            <Info size={16} /> What this means for you
          </h3>
          <div className="stack">
            {notes.map((note) => (
              <p key={note.stepId} className="small" style={{ margin: 0 }}>
                {note.note}
              </p>
            ))}
          </div>
        </div>
      )}

      {saq.eligibility.length > 0 && (
        <div className="card">
          <h3>What {saq.name} assumes about you</h3>
          <p className="small muted">
            Check each of these still holds. If any one of them is wrong, a different questionnaire applies.
          </p>
          <ul className="criteria-list">
            {saq.eligibility.map((item, i) => (
              <li key={i}>
                <CircleCheck size={15} />
                <span className="small">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <h3>How we got here</h3>
        <ol className="answer-summary">
          {path.map((entry) => (
            <li key={entry.stepId}>
              <span className="trail-question">{entry.question}</span>
              <span className="small" style={{ fontWeight: 600 }}>
                {entry.label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="card">
        <h3 className="row" style={{ gap: 8 }}>
          <TriangleAlert size={16} /> Before you rely on this
        </h3>
        <p className="small muted" style={{ marginBottom: 0 }}>
          This is guidance based on the answers given, not a formal determination. Your acquirer or the payment brands
          decide which validation applies to you and may require something different, and the eligibility criteria in each
          official SAQ are the authority. Confirm the result with your assessor or acquirer before starting work.
        </p>
      </div>
    </>
  );
}
