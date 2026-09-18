import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, CircleAlert, Save } from 'lucide-react';
import { api, ApiError } from '../api';
import { EligibilityWizard } from '../components/EligibilityWizard';
import { SaqResult } from '../components/SaqResult';
import { RESPONSES, RESPONSE_ORDER } from '../responses';
import { Header, Loading, ErrorCard, Progress, sectionLabel } from '../components/ui';
import type {
  Answer,
  AnswerMap,
  ClientAssessment,
  EligibilityAnswers,
  EligibilityOutcome,
  Question,
  Result,
  SaqType,
  Section,
} from '../types';

interface LoadPayload {
  stage: 'eligibility' | 'not-administered' | 'questionnaire';
  assessment: ClientAssessment;
  sections: Section[] | null;
  answers: AnswerMap;
  result: Result | null;
  eligibility?: { steps: Record<string, unknown>; firstStep: string; saqTypes: Record<string, SaqType> };
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

/** Debounce delay for free-text fields, so typing does not hit the API on every keystroke. */
const TEXT_SAVE_DELAY = 700;

/** Matches MAX_TEXT_LENGTH on the server, which rejects anything longer. */
const MAX_TEXT_LENGTH = 4000;

export default function Questionnaire() {
  const { token = '' } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<LoadPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [activeSection, setActiveSection] = useState<string>('');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showIncomplete, setShowIncomplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attestName, setAttestName] = useState('');
  const [attestTitle, setAttestTitle] = useState('');
  const [eligibilityBusy, setEligibilityBusy] = useState(false);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // One promise chain per question, so two saves for the same requirement can
  // never land out of order and leave the older value stored.
  const saveChains = useRef<Record<string, Promise<void>>>({});
  // The latest value for a question whose debounce has not fired yet, so it can
  // be flushed before submitting instead of being cancelled by navigation.
  const pendingText = useRef<Record<string, Answer>>({});
  const inFlight = useRef(0);
  // Set when any save fails and cleared on the next success, so submission can
  // refuse to proceed on answers the server never accepted.
  const saveFailed = useRef(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get<LoadPayload>(`/api/assessment/${token}`)
      .then((payload) => {
        if (cancelled) return;
        if (payload.assessment.status === 'submitted') {
          navigate(`/q/${token}/results`, { replace: true });
          return;
        }
        setData(payload);
        setAnswers(payload.answers);
        setActiveSection(String(payload.sections?.[0]?.id ?? ''));
      })
      .catch((err) => !cancelled && setLoadError(err.message));
    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  useEffect(() => {
    const pending = timers.current;
    return () => Object.values(pending).forEach(clearTimeout);
  }, []);

  const persist = useCallback(
    (questionId: string, answer: Answer | null) => {
      setSaveState('saving');
      setSaveError(null);
      inFlight.current += 1;

      // Queue behind any save already running for this question. The server's
      // write is an unconditional upsert, so ordering has to be guaranteed here.
      const chained = (saveChains.current[questionId] ?? Promise.resolve())
        .catch(() => {})
        .then(async () => {
          try {
            await api.put(`/api/assessment/${token}/answers/${questionId}`, {
              response: answer?.response ?? null,
              justification: answer?.justification ?? '',
              evidence: answer?.evidence ?? '',
            });
            delete pendingText.current[questionId];
            saveFailed.current = false;
          } catch (err) {
            saveFailed.current = true;
            setSaveState('error');
            setSaveError(err instanceof ApiError ? err.message : 'Could not save your answer.');
            throw err;
          }
        })
        .finally(() => {
          inFlight.current -= 1;
          // Only the last save still running may report success, so a fast
          // early request cannot paint "Saved" over a later failure.
          if (inFlight.current === 0) setSaveState((prev) => (prev === 'error' ? 'error' : 'saved'));
        });

      saveChains.current[questionId] = chained.catch(() => {});
      return chained;
    },
    [token]
  );

  const setResponse = (question: Question, response: Answer['response']) => {
    const current = answers[question.id];
    // Clicking the selected option again clears it.
    const next: Answer | null =
      current?.response === response
        ? null
        : {
            response,
            justification: current?.justification ?? '',
            evidence: current?.evidence ?? '',
          };

    setAnswers((prev) => {
      const copy = { ...prev };
      if (next) copy[question.id] = next;
      else delete copy[question.id];
      return copy;
    });

    clearTimeout(timers.current[question.id]);
    delete timers.current[question.id];
    if (next) pendingText.current[question.id] = next;
    else delete pendingText.current[question.id];

    persist(question.id, next).catch(() => {});
  };

  const setText = (question: Question, field: 'justification' | 'evidence', value: string) => {
    setAnswers((prev) => {
      const existing = prev[question.id];
      if (!existing) return prev;
      return { ...prev, [question.id]: { ...existing, [field]: value } };
    });

    clearTimeout(timers.current[question.id]);
    setAnswers((latest) => {
      const answer = latest[question.id];
      // Remember the value even before the debounce fires, so submitting early
      // flushes it rather than losing it to the cleanup that cancels timers.
      if (answer) pendingText.current[question.id] = { ...answer, [field]: value };
      return latest;
    });

    timers.current[question.id] = setTimeout(() => {
      const answer = pendingText.current[question.id];
      if (answer) persist(question.id, answer).catch(() => {});
    }, TEXT_SAVE_DELAY);
  };

  /** Write out every debounced edit that has not been sent yet, and wait for it. */
  const flushPendingSaves = useCallback(async () => {
    Object.values(timers.current).forEach(clearTimeout);
    timers.current = {};

    const pending = Object.entries(pendingText.current);
    pendingText.current = {};
    await Promise.all(pending.map(([questionId, answer]) => persist(questionId, answer)));

    // Saves started earlier may still be running. Those chains swallow their own
    // rejections so they never surface as unhandled, so the failure flag is what
    // reports whether any of them actually landed.
    await Promise.all(Object.values(saveChains.current));
    if (saveFailed.current) {
      throw new Error('At least one answer failed to save.');
    }
  }, [persist]);

  const progress = useMemo(() => {
    if (!data?.sections) return { total: 0, answered: 0, percent: 0, blocking: [] as string[] };
    const all = data.sections.flatMap((s) => s.questions);
    const blocking: string[] = [];
    let answered = 0;

    all.forEach((q) => {
      const answer = answers[q.id];
      if (!answer) {
        blocking.push(q.id);
        return;
      }
      answered += 1;
      const meta = RESPONSES[answer.response];
      if (meta.requiresText && !answer.justification.trim()) blocking.push(q.id);
    });

    return {
      total: all.length,
      answered,
      percent: all.length ? Math.round((answered / all.length) * 100) : 0,
      blocking,
    };
  }, [data, answers]);

  const sectionStatus = useCallback(
    (section: Section) => {
      let done = 0;
      let failed = 0;
      let review = 0;
      let missingText = 0;
      section.questions.forEach((q) => {
        const answer = answers[q.id];
        if (!answer) return;
        done += 1;
        const meta = RESPONSES[answer.response];
        // Mirrors the server: an answer owing a justification is not finished.
        if (meta.requiresText && !answer.justification.trim()) missingText += 1;
        if (answer.response === 'no') failed += 1;
        else if (meta.needsReview) review += 1;
      });
      const complete = done === section.questions.length && missingText === 0;
      const dot = !complete ? 'todo' : failed ? 'fail' : review ? 'review' : 'pass';
      return { done, total: section.questions.length, dot };
    },
    [answers]
  );

  const submit = async () => {
    if (progress.blocking.length > 0) {
      setShowIncomplete(true);
      const first = progress.blocking[0];
      const section = data?.sections?.find((s) => s.questions.some((q) => q.id === first));
      if (section) setActiveSection(String(section.id));
      setTimeout(() => document.getElementById(`q-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
      return;
    }
    if (!attestName.trim()) return;

    setSubmitting(true);
    try {
      // Everything typed must reach the server before the answers are locked,
      // otherwise the attested set would not be what the client last saw.
      await flushPendingSaves();
    } catch {
      setSaveError('Some of your answers could not be saved, so the questionnaire was not submitted. Check your connection and try again.');
      setSubmitting(false);
      return;
    }

    try {
      await api.post(`/api/assessment/${token}/submit`, { name: attestName, title: attestTitle });
      navigate(`/q/${token}/results`);
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : 'Could not submit the questionnaire.');
      setSubmitting(false);
    }
  };

  const submitEligibility = async (eligibilityAnswers: EligibilityAnswers, outcome: EligibilityOutcome) => {
    setEligibilityBusy(true);
    setEligibilityError(null);
    try {
      // The server recomputes the outcome from these answers; the local one is
      // only what the client was shown while answering.
      await api.post(`/api/assessment/${token}/eligibility`, { answers: eligibilityAnswers });
      const refreshed = await api.get<LoadPayload>(`/api/assessment/${token}`);
      setData(refreshed);
      setAnswers(refreshed.answers);
      setActiveSection(String(refreshed.sections?.[0]?.id ?? ''));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setEligibilityError(err instanceof ApiError ? err.message : 'Could not record your answers.');
    } finally {
      setEligibilityBusy(false);
    }
    void outcome;
  };

  const restartEligibility = async () => {
    setEligibilityError(null);
    try {
      await api.post(`/api/assessment/${token}/eligibility/reset`);
      const refreshed = await api.get<LoadPayload>(`/api/assessment/${token}`);
      setData(refreshed);
    } catch (err) {
      setEligibilityError(err instanceof ApiError ? err.message : 'Could not restart the questions.');
    }
  };

  if (loadError) {
    return (
      <>
        <Header />
        <main className="page page-narrow">
          <ErrorCard message={loadError} />
        </main>
      </>
    );
  }
  if (!data) {
    return (
      <>
        <Header />
        <main className="page">
          <Loading label="Loading your questionnaire…" />
        </main>
      </>
    );
  }

  if (data.stage === 'eligibility') {
    return (
      <>
        <Header />
        <main className="page page-narrow">
          <div className="page-head">
            <h1>{data.assessment.clientName}</h1>
            <p>
              Before you start, a few questions about how you take payments will identify which PCI DSS v4.0.1
              self-assessment questionnaire applies to you.
            </p>
          </div>
          <EligibilityWizard
            onComplete={submitEligibility}
            busy={eligibilityBusy}
            error={eligibilityError}
            completeLabel="Confirm and continue"
          />
        </main>
      </>
    );
  }

  if (data.stage === 'not-administered') {
    const record = data.assessment.eligibility;
    const saq = record ? data.eligibility?.saqTypes?.[record.saqType] : undefined;
    return (
      <>
        <Header />
        <main className="page page-narrow">
          <div className="page-head">
            <h1>{data.assessment.clientName}</h1>
            <p>Your answers determine which questionnaire you need.</p>
          </div>

          {saq && record ? (
            <SaqResult saq={saq} path={record.path} notes={record.notes}>
              <div className="callout callout-info" style={{ marginTop: 16 }}>
                <p className="small" style={{ marginBottom: 0 }}>
                  This tool administers SAQ D only, so there is nothing further for you to complete here. Your assessor
                  has been notified of this result and will send you {saq.name} and take it from here.
                </p>
              </div>
            </SaqResult>
          ) : (
            <ErrorCard message="This assessment was routed to a questionnaire that is not available here. Contact your assessor." />
          )}

          {eligibilityError && <p className="error-text">{eligibilityError}</p>}
          <div className="row">
            <button type="button" className="btn btn-secondary" onClick={restartEligibility}>
              I answered something incorrectly — start again
            </button>
          </div>
        </main>
      </>
    );
  }

  const sections = data.sections ?? [];
  const section = sections.find((s) => String(s.id) === activeSection) ?? sections[0];
  const sectionIndex = sections.findIndex((s) => String(s.id) === String(section.id));

  return (
    <>
      <Header>
        <span className="save-state">
          {saveState === 'saving' && (
            <>
              <span className="spinner" style={{ width: 13, height: 13 }} /> Saving
            </>
          )}
          {saveState === 'saved' && (
            <>
              <Save size={13} /> Saved
            </>
          )}
          {saveState === 'error' && (
            <span style={{ color: 'var(--fail)' }}>
              <CircleAlert size={13} /> Not saved
            </span>
          )}
        </span>
      </Header>

      <main className="page">
        <div className="page-head">
          <h1>{data.assessment.clientName}</h1>
          <p>
            {data.assessment.variantLabel} &middot; PCI DSS v4.0.1 &middot; {progress.answered} of {progress.total} requirements
            answered
          </p>
          <div style={{ marginTop: 12, maxWidth: 420 }}>
            <Progress percent={progress.percent} />
          </div>
        </div>

        {saveError && <p className="error-text">{saveError}</p>}

        <div className="saq-layout">
          <nav className="saq-nav" aria-label="Requirements">
            {sections.map((s) => {
              const status = sectionStatus(s);
              return (
                <button
                  key={String(s.id)}
                  type="button"
                  className={String(s.id) === String(section.id) ? 'active' : ''}
                  onClick={() => {
                    setActiveSection(String(s.id));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span className="row" style={{ gap: 7, flexWrap: 'nowrap' }}>
                    <span className={`nav-dot nav-dot-${status.dot}`} />
                    {typeof s.id === 'number' ? `Req ${s.id}` : s.id}
                  </span>
                  <span className="nav-count">
                    {status.done}/{status.total}
                  </span>
                </button>
              );
            })}
          </nav>

          <div>
            <div className="card card-tight" style={{ marginBottom: 14 }}>
              <h2 style={{ marginBottom: 2 }}>
                {sectionLabel(section.id)}: {section.title}
              </h2>
              <p className="small muted" style={{ marginBottom: 0 }}>
                {section.intro}
              </p>
            </div>

            {section.questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                answer={answers[question.id]}
                highlight={showIncomplete && progress.blocking.includes(question.id)}
                onRespond={(response) => setResponse(question, response)}
                onText={(field, value) => setText(question, field, value)}
              />
            ))}

            <div className="row-between" style={{ marginTop: 18 }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={sectionIndex === 0}
                onClick={() => {
                  setActiveSection(String(sections[sectionIndex - 1].id));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn"
                disabled={sectionIndex === sections.length - 1}
                onClick={() => {
                  setActiveSection(String(sections[sectionIndex + 1].id));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Next requirement
              </button>
            </div>

            {sectionIndex === sections.length - 1 && (
              <div className="card" style={{ marginTop: 20 }}>
                <h2>Submit your self-assessment</h2>
                <p className="small muted">
                  Once submitted, your answers are locked and the result is generated. Contact your assessor if you need it
                  reopened.
                </p>

                {progress.blocking.length > 0 ? (
                  <div className="callout callout-fail" style={{ marginBottom: 14 }}>
                    <h3>{progress.blocking.length} item(s) still need attention</h3>
                    <p className="small" style={{ marginBottom: 0 }}>
                      Every requirement needs a response, and answers of Not Applicable, Yes with Compensating Control, or
                      Yes with Customized Approach need written justification.
                    </p>
                  </div>
                ) : (
                  <div className="callout callout-info" style={{ marginBottom: 14 }}>
                    <p className="small" style={{ marginBottom: 0 }}>
                      By submitting, you confirm that these responses accurately reflect your cardholder data environment and
                      that supporting evidence is available for each requirement marked as in place.
                    </p>
                  </div>
                )}

                <div className="grid grid-2">
                  <label className="field">
                    <span>Your name</span>
                    <input type="text" value={attestName} onChange={(e) => setAttestName(e.target.value)} />
                  </label>
                  <label className="field">
                    <span>Your title</span>
                    <input type="text" value={attestTitle} onChange={(e) => setAttestTitle(e.target.value)} />
                  </label>
                </div>

                <button
                  type="button"
                  className="btn"
                  disabled={submitting || (progress.blocking.length === 0 && !attestName.trim())}
                  onClick={submit}
                >
                  {submitting ? 'Submitting…' : 'Submit self-assessment'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function QuestionCard({
  question,
  answer,
  highlight,
  onRespond,
  onText,
}: {
  question: Question;
  answer?: Answer;
  highlight: boolean;
  onRespond: (response: Answer['response']) => void;
  onText: (field: 'justification' | 'evidence', value: string) => void;
}) {
  const meta = answer ? RESPONSES[answer.response] : null;
  const needsText = !!meta?.requiresText && !answer?.justification.trim();

  const stateClass = !answer
    ? 'unanswered'
    : answer.response === 'no'
      ? 'answered-no'
      : answer.response === 'na'
        ? 'answered-na'
        : meta?.needsReview
          ? 'answered-review'
          : 'answered-yes';

  return (
    <article id={`q-${question.id}`} className={`question ${stateClass} ${highlight && needsText ? 'needs-text' : ''}`}>
      <div className="row" style={{ gap: 9 }}>
        <span className="question-id">{question.id}</span>
        <strong className="small">{question.title}</strong>
      </div>

      <p className="question-text">{question.question}</p>

      <div className="response-options" role="group" aria-label={`Response for requirement ${question.id}`}>
        {RESPONSE_ORDER.map((key) => {
          const option = RESPONSES[key];
          const disabled = key === 'na' && !question.allowNA;
          const selected = answer?.response === key;
          const tone = selected ? (key === 'no' ? ' selected-no' : option.needsReview ? ' selected-review' : ' selected') : '';
          return (
            <label key={key} className={`response-option${tone}${disabled ? ' disabled' : ''}`} title={option.hint}>
              <input
                type="radio"
                name={`q-${question.id}`}
                checked={selected}
                disabled={disabled}
                onChange={() => onRespond(key)}
                onClick={() => selected && onRespond(key)}
              />
              {option.label}
              {selected && <Check size={14} />}
            </label>
          );
        })}
      </div>

      {!question.allowNA && (
        <p className="hint">This requirement applies to every entity completing SAQ D and cannot be marked Not Applicable.</p>
      )}
      {question.allowNA && question.condition && <p className="hint">{question.condition}</p>}

      {meta?.requiresText && (
        <label className="field" style={{ marginTop: 12, marginBottom: 6 }}>
          <span>
            {meta.textLabel} <span style={{ color: 'var(--fail)' }}>required</span>
          </span>
          <textarea
            value={answer?.justification ?? ''}
            maxLength={MAX_TEXT_LENGTH}
            onChange={(e) => onText('justification', e.target.value)}
            placeholder={meta.placeholder}
          />
          {highlight && needsText && <p className="error-text" style={{ margin: '6px 0 0' }}>This justification is required before you can submit.</p>}
        </label>
      )}

      {answer && answer.response === 'no' && (
        <label className="field" style={{ marginTop: 12, marginBottom: 6 }}>
          <span>Planned remediation (optional)</span>
          <textarea
            value={answer.justification}
            maxLength={MAX_TEXT_LENGTH}
            onChange={(e) => onText('justification', e.target.value)}
            placeholder="What is missing, and what is your plan and timeline to close the gap?"
          />
        </label>
      )}

      {answer && (
        <label className="field" style={{ marginBottom: 0 }}>
          <span>Evidence reference (optional)</span>
          <input
            type="text"
            value={answer.evidence}
            maxLength={MAX_TEXT_LENGTH}
            onChange={(e) => onText('evidence', e.target.value)}
            placeholder="e.g. Firewall standard v3.2, ticket CHG-1184, screenshot set B"
          />
        </label>
      )}

      <details className="req-detail">
        <summary>Requirement text and testing procedures</summary>
        <div className="detail-body">
          <h4>PCI DSS v4.0.1 requirement</h4>
          <p style={{ marginBottom: 0 }}>{question.requirement}</p>
          {question.testing?.length > 0 && (
            <>
              <h4>What an assessor would examine</h4>
              <ul>
                {question.testing.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {question.guidance && (
            <>
              <h4>Guidance</h4>
              <p style={{ marginBottom: 0 }}>{question.guidance}</p>
            </>
          )}
        </div>
      </details>
    </article>
  );
}
