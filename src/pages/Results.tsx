import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import { api } from '../api';
import { RESPONSES } from '../responses';
import { DeterminationCallout, ErrorCard, Header, Loading, SectionTable, Stat, formatDate } from '../components/ui';
import type { ClientAssessment, GapEntry, Result } from '../types';

export default function Results() {
  const { token = '' } = useParams();
  const [data, setData] = useState<{ assessment: ClientAssessment; result: Result } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ assessment: ClientAssessment; result: Result }>(`/api/assessment/${token}/result`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [token]);

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
  const counts = result.totals.counts;
  const reviewCount = counts['yes-ccw'];

  return (
    <>
      <Header />
      <main className="page">
        <div className="page-head">
          <h1>{assessment.clientName}</h1>
          <p>
            {assessment.variantLabel} &middot; PCI DSS v4.0.1
            {assessment.submittedAt && <> &middot; Submitted {formatDate(assessment.submittedAt)}</>}
            {assessment.submittedBy && <> by {assessment.submittedBy}{assessment.submittedTitle ? `, ${assessment.submittedTitle}` : ''}</>}
          </p>
        </div>

        <div className="card">
          <DeterminationCallout result={result} />

          <div className="grid grid-stats" style={{ marginTop: 18 }}>
            <Stat label="In place" value={counts.yes} tone="pass" />
            <Stat label="Not in place" value={counts.no} tone={counts.no ? 'fail' : undefined} />
            <Stat label="Not applicable" value={counts.na} />
            <Stat label="Needs assessor review" value={reviewCount} tone={reviewCount ? 'review' : undefined} />
            <Stat label="Unanswered" value={counts.unanswered} />
            <Stat label="Applicable requirements" value={result.totals.total} />
          </div>

          <div className="row" style={{ marginTop: 18 }}>
            <a className="btn" href={`/api/assessment/${token}/report.pdf`}>
              <Download size={15} /> Download full report (PDF)
            </a>
            <a className="btn btn-secondary" href={`/api/assessment/${token}/aoc.pdf`}>
              <FileText size={15} /> Attestation summary (PDF)
            </a>
          </div>
        </div>

        <div className="card">
          <h2>Result by requirement</h2>
          <SectionTable sections={result.sections} />
        </div>

        {result.gaps.length > 0 && (
          <GapList
            title="Gap remediation plan"
            description="Each requirement below was answered No. Under PCI DSS every applicable requirement must be in place, so each of these must be remediated before a compliant attestation can be made."
            tone="fail"
            entries={result.gaps}
            notesLabel="Your notes / planned remediation"
          />
        )}

        {result.reviewItems.length > 0 && (
          <GapList
            title="Requires assessor validation"
            description="A compensating control cannot be self-validated. A Qualified Security Assessor must review the Appendix C worksheet behind each one."
            tone="review"
            entries={result.reviewItems}
            notesLabel="Control description you provided"
            showResponse
          />
        )}

        {result.naItems.length > 0 && (
          <GapList
            title="Marked Not Applicable"
            description="Your assessor will confirm that each of these exclusions is legitimate for your environment."
            tone="muted"
            entries={result.naItems}
            notesLabel="Justification you provided"
          />
        )}

        <div className="card">
          <h2>What this result is, and is not</h2>
          <p className="small muted">
            This is a self-assessment against the PCI DSS v4.0.1 Self-Assessment Questionnaire D. The result reflects the
            responses recorded here and has not been independently validated. It is not an official PCI Security Standards
            Council document and does not constitute a completed SAQ or a signed Attestation of Compliance. The official SAQ D
            and AOC forms must be obtained from the PCI SSC Document Library, completed, and signed before submission to your
            acquirer or payment brand.
          </p>
        </div>
      </main>
    </>
  );
}

function GapList({
  title,
  description,
  tone,
  entries,
  notesLabel,
  showResponse,
}: {
  title: string;
  description: string;
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
      <p className="small muted">{description}</p>

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
            <p className="small" style={{ margin: '8px 0 0' }}>
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
