import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Determination, Result, SectionResult } from '../types';

export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <ShieldCheck size={19} />
          </span>
          <span className="brand-text">
            PCI DSS Self-Assessment
            <small>SAQ D &middot; v4.0.1</small>
          </span>
        </Link>
        <div className="header-spacer" />
        {children}
      </div>
    </header>
  );
}

const DETERMINATION_CLASS: Record<Determination, string> = {
  compliant: 'pass',
  'pending-review': 'review',
  'non-compliant': 'fail',
  incomplete: 'muted',
};

export function DeterminationBadge({ determination, label }: { determination: Determination; label: string }) {
  return <span className={`badge badge-${DETERMINATION_CLASS[determination]}`}>{label}</span>;
}

export function DeterminationCallout({ result }: { result: Result }) {
  const tone = DETERMINATION_CLASS[result.determination];
  return (
    <div className={`callout callout-${tone === 'muted' ? 'info' : tone}`}>
      <h3>{result.determinationDetail.label}</h3>
      <p className="small" style={{ fontWeight: 600 }}>
        {result.determinationDetail.headline}
      </p>
      <p className="small">{result.determinationDetail.summary}</p>
    </div>
  );
}

export function Progress({ percent }: { percent: number }) {
  return (
    <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${percent}%` }} />
    </div>
  );
}

export function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: 'pass' | 'fail' | 'review' }) {
  const color = tone === 'pass' ? 'var(--pass)' : tone === 'fail' ? 'var(--fail)' : tone === 'review' ? 'var(--review)' : 'var(--ink)';
  return (
    <div className="stat">
      <strong style={{ color }}>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

const SECTION_STATUS_LABEL: Record<SectionResult['status'], string> = {
  pass: 'Pass',
  fail: 'Fail',
  review: 'Review',
  incomplete: 'Incomplete',
};

const SECTION_STATUS_CLASS: Record<SectionResult['status'], string> = {
  pass: 'badge-pass',
  fail: 'badge-fail',
  review: 'badge-review',
  incomplete: 'badge-muted',
};

export function sectionLabel(id: number | string) {
  return typeof id === 'number' ? `Requirement ${id}` : `Appendix ${id}`;
}

export function SectionTable({ sections }: { sections: SectionResult[] }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Requirement</th>
            <th className="num">Yes</th>
            <th className="num">No</th>
            <th className="num">N/A</th>
            <th className="num">Unanswered</th>
            <th className="num">Status</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => {
            const yes = section.counts.yes + section.counts['yes-ccw'] + section.counts['yes-customized'];
            return (
              <tr key={String(section.id)}>
                <td>
                  <strong>{sectionLabel(section.id)}</strong>
                  <div className="small muted">{section.title}</div>
                </td>
                <td className="num">{yes}</td>
                <td className="num" style={{ color: section.counts.no ? 'var(--fail)' : undefined, fontWeight: section.counts.no ? 600 : 400 }}>
                  {section.counts.no}
                </td>
                <td className="num">{section.counts.na}</td>
                <td className="num">{section.counts.unanswered}</td>
                <td className="num">
                  <span className={`badge ${SECTION_STATUS_CLASS[section.status]}`}>{SECTION_STATUS_LABEL[section.status]}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="row" style={{ padding: '40px 0', justifyContent: 'center' }}>
      <span className="spinner" />
      <span className="muted">{label}</span>
    </div>
  );
}

export function ErrorCard({ message }: { message: string }) {
  return (
    <div className="card">
      <div className="callout callout-fail">
        <h3>Something went wrong</h3>
        <p className="small" style={{ marginBottom: 0 }}>
          {message}
        </p>
      </div>
    </div>
  );
}

export function CopyLink({ link }: { link: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="link-box">
      <input readOnly value={link} onFocus={(e) => e.currentTarget.select()} />
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(link);
          } catch {
            // Clipboard can be blocked; the input is selectable as a fallback.
          }
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
