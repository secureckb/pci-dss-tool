import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Search, X } from 'lucide-react';
import { api } from '../api';
import { ErrorCard, Header, Loading, Stat, sectionLabel } from '../components/ui';
import type { Question, Section, Variant } from '../types';

interface ResponseMeta {
  key: string;
  label: string;
  hint: string;
  requiresText: boolean;
}

interface DeterminationMeta {
  key: string;
  label: string;
  headline: string;
  summary: string;
}

interface Catalogue {
  standard: string;
  version: string;
  questionnaire: string;
  variants: Record<Variant, { key: Variant; label: string; description: string; count: number }>;
  responses: Record<string, ResponseMeta>;
  determinations: Record<string, DeterminationMeta>;
  sections: Section[];
  totals: { sections: number; questions: number; serviceProviderOnly: number; naPermitted: number };
}

type VariantFilter = 'all' | Variant;

const RESPONSE_ORDER = ['yes', 'no', 'na', 'yes-ccw'];
const DETERMINATION_ORDER = ['compliant', 'pending-review', 'non-compliant', 'incomplete'];

const DETERMINATION_TONE: Record<string, string> = {
  compliant: 'badge-pass',
  'pending-review': 'badge-review',
  'non-compliant': 'badge-fail',
  incomplete: 'badge-muted',
};

/** A requirement is in a variant if it applies to everyone or to that variant specifically. */
function appliesToVariant(question: Question, variant: VariantFilter) {
  if (variant === 'all') return true;
  return question.appliesTo === 'all' || question.appliesTo === variant;
}

function matchesSearch(question: Question, needle: string) {
  if (!needle) return true;
  const haystack = [question.id, question.title, question.question, question.requirement, question.condition ?? '']
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}

/**
 * Who a completed SAQ D actually satisfies.
 *
 * The question bank being complete is not the same as this being the right
 * validation route: PCI's levels decide whether an entity may self-assess at
 * all, and the largest merchants and service providers may not. A catalogue that
 * lists 260 requirements without saying so invites the reader to assume more
 * than it delivers.
 */
function ScopeNote() {
  return (
    <div className="card">
      <h2>What a completed SAQ D does and does not cover</h2>

      <p className="small">
        SAQ D is the most comprehensive self-assessment questionnaire: every PCI DSS requirement applies,
        rather than the subset a narrower SAQ covers. Completing it here records a self-assessment.
      </p>

      <h3 style={{ marginTop: 18 }}>Who may validate with an SAQ</h3>
      <table>
        <thead>
          <tr>
            <th>Entity</th>
            <th>Validation route</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Merchant Level 1 &mdash; over 6M transactions a year, or designated by a payment brand</td>
            <td>
              <strong>Not an SAQ.</strong> An annual onsite assessment by a QSA (or an internal assessor where
              permitted), documented in a Report on Compliance
            </td>
          </tr>
          <tr>
            <td>Merchant Levels 2&ndash;4</td>
            <td>
              SAQ and Attestation of Compliance. Some brand programmes require a QSA or an internal security
              assessor at Level 2 &mdash; confirm with the acquirer
            </td>
          </tr>
          <tr>
            <td>Service Provider Level 1 &mdash; over 300,000 transactions a year</td>
            <td>
              <strong>Not an SAQ.</strong> An annual onsite assessment and a Report on Compliance
            </td>
          </tr>
          <tr>
            <td>Service Provider Level 2</td>
            <td>SAQ D for Service Providers and an Attestation of Compliance</td>
          </tr>
        </tbody>
      </table>
      <p className="small muted" style={{ marginTop: 10 }}>
        Levels are set by the payment brands and by transaction volume, and a breach can move an entity up one.
        The acquirer or brand programme is the authority on which route applies.
      </p>

      <h3 style={{ marginTop: 18 }}>What this tool does not produce</h3>
      <ul className="small">
        <li>
          <strong>The official SAQ D and Attestation of Compliance.</strong> Those come from the PCI SSC Document
          Library and must be completed and signed before anything is submitted to an acquirer. The attestation
          generated here is a working draft, marked as such.
        </li>
        <li>
          <strong>The rest of the official form.</strong> The published SAQ D also carries contact details, an
          executive summary of payment channels and third parties, validation and attestation details, and an
          action plan for requirements not in place. This covers the requirement responses.
        </li>
        <li>
          <strong>Scan and test evidence.</strong> External vulnerability scans (11.3.2) must be run by an
          Approved Scanning Vendor, and penetration tests (11.4) by a qualified tester. Answering those
          requirements records that the work was done; it is not the report.
        </li>
        <li>
          <strong>Compensating control worksheets.</strong> An answer of Yes with Compensating Control takes a
          written description here; the formal Appendix C worksheet is a separate document.
        </li>
        <li>
          <strong>The customized approach.</strong> Deliberately absent: an SAQ cannot be used to document it, and
          an entity validating that way uses the Report on Compliance template instead.
        </li>
      </ul>

      <p className="small muted">
        Every result, count and determination this tool produces is computed from the answers given, by fixed rules,
        with no AI involvement. An assessor may separately have remediation advice drafted for failed requirements by
        a language model; where that advice appears in a report it is labelled as machine-drafted and
        assessor-approved, and it is never an input to the determination.
      </p>

      <p className="small muted" style={{ marginBottom: 0 }}>
        Not affiliated with or endorsed by the PCI Security Standards Council. A determination of Compliant means
        no applicable requirement was answered No &mdash; it does not verify that the answers are accurate, that the
        scope described is correct, or that the supporting evidence exists.
      </p>
    </div>
  );
}

export default function Requirements() {
  const printRestore = React.useRef<boolean | null>(null);
  const [data, setData] = useState<Catalogue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [variant, setVariant] = useState<VariantFilter>('all');
  const [naOnly, setNaOnly] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    api
      .get<Catalogue>('/api/requirements')
      .then((payload) => {
        setData(payload);
        setActiveSection(String(payload.sections[0]?.id ?? ''));
      })
      .catch((err) => setError(err.message));
  }, []);

  // Jump straight to a requirement for a #1.2.3 style hash, both when the page is
  // opened with one and when the hash changes on a page that is already loaded.
  useEffect(() => {
    if (!data) return;

    const jumpToHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const section = data.sections.find((s) => s.questions.some((q) => q.id === id));
      if (!section) return;
      // Clear any filter that would hide the target, then reveal its section.
      setSearch('');
      setNaOnly(false);
      setVariant('all');
      setShowAll(false);
      setActiveSection(String(section.id));
      setTimeout(
        () => document.getElementById(`req-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
        80
      );
    };

    jumpToHash();
    window.addEventListener('hashchange', jumpToHash);
    return () => window.removeEventListener('hashchange', jumpToHash);
  }, [data]);

  const needle = search.trim().toLowerCase();
  const filtering = needle.length > 0 || naOnly || variant !== 'all';

  const filteredSections = useMemo(() => {
    if (!data) return [];
    return data.sections
      .map((section) => ({
        ...section,
        questions: section.questions.filter(
          (q) => appliesToVariant(q, variant) && matchesSearch(q, needle) && (!naOnly || q.allowNA)
        ),
      }))
      .filter((section) => section.questions.length > 0);
  }, [data, variant, needle, naOnly]);

  const matchCount = filteredSections.reduce((sum, s) => sum + s.questions.length, 0);

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
          <Loading label="Loading the requirement catalogue…" />
        </main>
      </>
    );
  }

  // Searching or filtering shows every match across the standard; otherwise browse one
  // requirement at a time, since rendering all 260 at once is rarely what you want.
  const searching = needle.length > 0;

  /**
   * Print every requirement, not just the section being browsed.
   *
   * Only mounted content reaches the printed page, so switch to the all-sections
   * view, let React commit it, then open the dialog and restore afterwards.
   */
  const startPrint = () => {
    if (showAll || searching) {
      window.print();
      return;
    }
    printRestore.current = showAll;
    setShowAll(true);
    // Two frames: one for React to commit, one for layout to settle before the
    // dialog snapshots the page.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        window.print();
        if (printRestore.current !== null) {
          setShowAll(printRestore.current);
          printRestore.current = null;
        }
      })
    );
  };

  const visibleSections =
    showAll || searching ? filteredSections : filteredSections.filter((s) => String(s.id) === activeSection);

  const activeStillVisible = filteredSections.some((s) => String(s.id) === activeSection);

  return (
    <>
      <Header>
        <Link className="btn btn-secondary btn-sm" to="/which-saq">
          Which SAQ?
        </Link>
        <Link className="btn btn-secondary btn-sm" to="/">
          Home
        </Link>
      </Header>

      <main className="page">
        <div className="page-head">
          <h1>Requirement catalogue</h1>
          <p>
            Every requirement this tool assesses: the full {data.standard} v{data.version} {data.questionnaire} question
            bank, in both the merchant and service provider editions.
          </p>
        </div>

        <div className="card">
          <div className="grid grid-stats">
            <Stat label="Requirements in total" value={data.totals.questions} />
            <Stat label="Merchant edition" value={data.variants.merchant.count} />
            <Stat label="Service provider edition" value={data.variants['service-provider'].count} />
            <Stat label="Sections" value={data.totals.sections} />
            <Stat label="Service provider only" value={data.totals.serviceProviderOnly} />
            <Stat label="N/A permitted" value={data.totals.naPermitted} />
          </div>

          <p className="small muted" style={{ margin: '16px 0 0' }}>
            The merchant edition omits the {data.totals.serviceProviderOnly} requirements marked{' '}
            <em>Additional requirement for service providers only</em>, including all of Appendix A1. Requirements where
            Not Applicable is never a legitimate answer have that option disabled in the questionnaire and rejected by the
            server.
          </p>
        </div>

        <ScopeNote />

        <div className="card card-tight filter-bar">
          <div className="search-field">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              value={search}
              placeholder="Search by requirement number or text, e.g. 8.4 or multi-factor"
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search requirements"
            />
            {search && (
              <button type="button" className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="row">
            <select value={variant} onChange={(e) => setVariant(e.target.value as VariantFilter)} aria-label="Edition">
              <option value="all">Both editions</option>
              <option value="merchant">Merchant edition only</option>
              <option value="service-provider">Service provider edition</option>
            </select>

            <label className="checkbox-field">
              <input type="checkbox" checked={naOnly} onChange={(e) => setNaOnly(e.target.checked)} />
              N/A permitted only
            </label>

            <button type="button" className="btn btn-secondary btn-sm" onClick={startPrint}>
              <Printer size={14} /> Print
            </button>
          </div>
        </div>

        {filtering && (
          <p className="small muted" style={{ margin: '0 0 14px' }}>
            {matchCount} requirement{matchCount === 1 ? ' matches' : 's match'}
            {search && <> &ldquo;{search}&rdquo;</>}
            {variant !== 'all' && <> in the {data.variants[variant].label}</>}
            {naOnly && <> where Not Applicable is permitted</>}.
          </p>
        )}

        {matchCount === 0 ? (
          <div className="card">
            <p className="muted" style={{ margin: 0 }}>
              No requirements match these filters.
            </p>
          </div>
        ) : (
          <div className="saq-layout">
            <nav className="saq-nav" aria-label="Sections">
              <button
                type="button"
                className={showAll || searching ? 'active' : ''}
                onClick={() => setShowAll(true)}
                disabled={searching}
              >
                <span>All requirements</span>
                <span className="nav-count">{matchCount}</span>
              </button>
              {filteredSections.map((section) => (
                <button
                  key={String(section.id)}
                  type="button"
                  className={!showAll && !searching && String(section.id) === activeSection ? 'active' : ''}
                  onClick={() => {
                    setShowAll(false);
                    setActiveSection(String(section.id));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>{typeof section.id === 'number' ? `Req ${section.id}` : section.id}</span>
                  <span className="nav-count">{section.questions.length}</span>
                </button>
              ))}
            </nav>

            <div>
              {!showAll && !searching && !activeStillVisible && (
                <div className="card card-tight" style={{ marginBottom: 14 }}>
                  <p className="small muted" style={{ margin: 0 }}>
                    No requirements in this section match the current filters. Pick another section from the list.
                  </p>
                </div>
              )}

              {visibleSections.map((section) => (
                <section key={String(section.id)} style={{ marginBottom: 26 }}>
                  <div className="card card-tight" style={{ marginBottom: 14 }}>
                    <p className="section-goal">{section.goal}</p>
                    <h2 style={{ marginBottom: 4 }}>
                      {sectionLabel(section.id)}
                      {typeof section.id === 'number' ? `: ${section.title}` : ''}
                    </h2>
                    {typeof section.id !== 'number' && (
                      <p className="small" style={{ fontWeight: 500, marginBottom: 6 }}>
                        {section.title}
                      </p>
                    )}
                    <p className="small muted" style={{ marginBottom: 0 }}>
                      {section.intro}
                    </p>
                  </div>

                  {section.questions.map((question) => (
                    <RequirementCard key={question.id} question={question} />
                  ))}
                </section>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <h2>How answers are scored</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Answer</th>
                  <th>Written justification</th>
                  <th>Effect on the result</th>
                </tr>
              </thead>
              <tbody>
                {RESPONSE_ORDER.map((key) => {
                  const response = data.responses[key];
                  if (!response) return null;
                  return (
                    <tr key={key}>
                      <td>
                        <strong>{response.label}</strong>
                      </td>
                      <td className="small">
                        {response.requiresText ? (
                          <span className="badge badge-review">Required</span>
                        ) : (
                          <span className="muted">Optional</span>
                        )}
                      </td>
                      <td className="small muted">{response.hint}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: 20 }}>Possible determinations</h3>
          <div className="stack">
            {DETERMINATION_ORDER.map((key) => {
              const determination = data.determinations[key];
              if (!determination) return null;
              return (
                <div key={key} className="determination-row">
                  <span className={`badge ${DETERMINATION_TONE[key]}`}>{determination.label}</span>
                  <span className="small muted">{determination.summary}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h2>Source and scope</h2>
          <p className="small muted" style={{ marginBottom: 0 }}>
            Requirement text is drawn from PCI DSS v4.0.1. This catalogue is a reference for the questions this tool asks
            and is not affiliated with or endorsed by the PCI Security Standards Council. The authoritative text is the
            standard itself, available from the PCI SSC Document Library.
          </p>
        </div>
      </main>
    </>
  );
}

function RequirementCard({ question }: { question: Question }) {
  return (
    <article id={`req-${question.id}`} className="question requirement-card">
      <div className="row" style={{ gap: 9 }}>
        <span className="question-id">{question.id}</span>
        <strong className="small">{question.title}</strong>
        {question.appliesTo === 'service-provider' && (
          <span className="badge badge-review">Service providers only</span>
        )}
        <span className={`badge ${question.allowNA ? 'badge-muted' : 'badge-fail'}`}>
          {question.allowNA ? 'N/A permitted' : 'N/A not permitted'}
        </span>
      </div>

      <p className="question-text">{question.question}</p>

      <h4 className="detail-label">PCI DSS v4.0.1 requirement</h4>
      <p className="small" style={{ marginBottom: 10 }}>
        {question.requirement}
      </p>

      {question.condition && (
        <>
          <h4 className="detail-label">When Not Applicable is acceptable</h4>
          <p className="small" style={{ marginBottom: 10 }}>
            {question.condition}
          </p>
        </>
      )}

      {question.guidance && (
        <>
          <h4 className="detail-label">Guidance</h4>
          <p className="small" style={{ marginBottom: 10 }}>
            {question.guidance}
          </p>
        </>
      )}

      {question.testing?.length > 0 && (
        <>
          <h4 className="detail-label">What an assessor would examine</h4>
          <ul className="small" style={{ margin: 0, paddingLeft: 18, color: 'var(--ink-soft)' }}>
            {question.testing.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}
