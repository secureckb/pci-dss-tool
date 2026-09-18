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
  /** Ordering epoch issued by the server for this page load; see `nextSeq`. */
  session?: { epoch: number };
}

/** What a write returns, so the client can tell a superseded write from a saved one. */
interface SaveOutcome {
  applied: boolean;
  superseded: boolean;
  storedEpoch: number | null;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error' | 'stale';

/** Debounce delay for free-text fields, so typing does not hit the API on every keystroke. */
const TEXT_SAVE_DELAY = 700;

/** Matches MAX_TEXT_LENGTH on the server, which rejects anything longer. */
const MAX_TEXT_LENGTH = 4000;

/** Raised when the server declined a write because another page holds the answer. */
class StaleWindowError extends Error {}

const STALE_MESSAGE =
  'This questionnaire is open in another window or on another device, and that copy has ' +
  'answers this one does not. Nothing typed here has been saved since. Reload this page to ' +
  'pick up the latest answers, then re-enter anything that is missing.';

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
  // Read synchronously by the edit handlers. Submission freezes the controls,
  // but a click already in the same tick would not see the re-render, and an
  // edit accepted after the flush has taken its snapshot is an edit the
  // submission never sends — the client would then be attesting to the value it
  // had just replaced on screen.
  const submittingRef = useRef(false);
  const [attestName, setAttestName] = useState('');
  const [attestTitle, setAttestTitle] = useState('');
  const [eligibilityBusy, setEligibilityBusy] = useState(false);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // One promise chain per question, so two saves for the same requirement can
  // never land out of order and leave the older value stored.
  const saveChains = useRef<Record<string, Promise<void>>>({});
  // The latest value for a question whose debounce has not fired yet, so it can
  // be flushed rather than cancelled. Each entry carries the revision it was
  // buffered at: a save that completes may only clear the entry it actually
  // wrote, or a slow earlier request would erase text typed while it was in
  // flight and the debounce would then find nothing to send.
  const pendingText = useRef<Record<string, { answer: Answer; rev: number }>>({});
  // Writes are ordered by (epoch, seq). The epoch is issued by the server when
  // this page loads, so every session is ordered by the one clock they share;
  // the sequence just counts this page's writes, which is enough to order them
  // against each other. Deriving the order from `Date.now()` here instead made it
  // depend on the device: a client whose laptop clock ran fast set a watermark
  // their phone could never reach, and every edit made on the phone was silently
  // discarded while the phone reported it saved.
  const epoch = useRef<number | null>(null);
  const seqCounter = useRef(0);
  const nextSeq = () => (seqCounter.current += 1);
  // Set once another page is found to be writing to this assessment: this page's
  // view is behind, so it stops claiming to have saved and asks for a reload.
  // The ref is what the save bookkeeping reads, since it has to be current
  // inside a callback that will not see the re-rendered state.
  const [staleWindow, setStaleWindow] = useState(false);
  const staleWindowRef = useRef(false);
  const markStale = useCallback(() => {
    staleWindowRef.current = true;
    setStaleWindow(true);
  }, []);
  const inFlight = useRef(0);
  // Which questions have an unsaved failure, and at which revision.
  //
  // A single boolean would be cleared by any later success: a failed change to
  // one requirement would be masked by a successful save of another, and the
  // submission would then attest the older value still on the server. Keyed by
  // question, a failure clears only when that same question saves successfully
  // at the revision that failed or a later one.
  const failedSaves = useRef<Map<string, number>>(new Map());
  // Lets the unmount cleanup reach the current persist without re-running the
  // effect (and so re-registering the unload listeners) on every render.
  const persistRef = useRef<
    ((questionId: string, answer: Answer | null, rev?: number) => Promise<void>) | null
  >(null);

  /**
   * Takes a freshly loaded payload, including the ordering epoch that came with
   * it. Every path that reloads the assessment goes through here: the epoch
   * arrives only with the questionnaire stage, so the wizard's own load carries
   * none, and a refresh that forgot to pick it up left the page saving without
   * any ordering at all — unable to be superseded, and unable to notice that a
   * second window had moved ahead.
   */
  const adoptPayload = useCallback((payload: LoadPayload) => {
    epoch.current = payload.session?.epoch ?? null;
    seqCounter.current = 0;
    setData(payload);
    setAnswers(payload.answers);
  }, []);

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
        adoptPayload(payload);
        setActiveSection(String(payload.sections?.[0]?.id ?? ''));
      })
      .catch((err) => !cancelled && setLoadError(err.message));
    return () => {
      cancelled = true;
    };
  }, [token, navigate, adoptPayload]);

  /**
   * Nothing typed should be lost by leaving the page.
   *
   * On unmount (navigating within the app) the debounce is cancelled but the
   * buffered edits are sent: the requests outlive the component. On a tab close
   * or reload there is no time for a normal request, so they go with `keepalive`,
   * which the browser is permitted to finish after the page is gone.
   */
  useEffect(() => {
    const flushWithKeepalive = () => {
      for (const [questionId, entry] of Object.entries(pendingText.current)) {
        try {
          fetch(`/api/assessment/${token}/answers/${questionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            keepalive: true,
            body: JSON.stringify({
              response: entry.answer.response,
              justification: entry.answer.justification,
              evidence: entry.answer.evidence,
              // Carries its place in this page's order, so if the client returns
              // and edits again before this lands, the server discards it as
              // superseded rather than undoing the newer edit.
              epoch: epoch.current,
              seq: entry.rev,
            }),
          });
        } catch {
          // Nothing useful can be done as the page goes away.
        }
      }
    };

    // Safari and mobile browsers often skip beforeunload; visibilitychange fires.
    const onHide = () => {
      if (document.visibilityState === 'hidden') flushWithKeepalive();
    };
    window.addEventListener('beforeunload', flushWithKeepalive);
    document.addEventListener('visibilitychange', onHide);

    return () => {
      window.removeEventListener('beforeunload', flushWithKeepalive);
      document.removeEventListener('visibilitychange', onHide);
      Object.values(timers.current).forEach(clearTimeout);
      timers.current = {};
      // Fire, do not await: these requests complete after this component goes.
      for (const [questionId, entry] of Object.entries(pendingText.current)) {
        persistRef.current?.(questionId, entry.answer, entry.rev).catch(() => {});
      }
      pendingText.current = {};
    };
  }, [token]);

  const persist = useCallback(
    (questionId: string, answer: Answer | null, rev?: number) => {
      setSaveState('saving');
      setSaveError(null);
      inFlight.current += 1;

      // Queue behind any save already running for this question. The server's
      // write is an unconditional upsert, so ordering has to be guaranteed here.
      const chained = (saveChains.current[questionId] ?? Promise.resolve())
        .catch(() => {})
        .then(async () => {
          try {
            const outcome = await api.put<SaveOutcome>(`/api/assessment/${token}/answers/${questionId}`, {
              response: answer?.response ?? null,
              justification: answer?.justification ?? '',
              evidence: answer?.evidence ?? '',
              epoch: epoch.current,
              seq: rev,
            });
            // HTTP 200 does not mean this text was stored. The server declines a
            // write that a newer one has already superseded, and if the newer one
            // came from a different page load then this page is behind: treating
            // that as "Saved" is how a client could sit in front of an answer the
            // server does not have. Being superseded by this page's own later
            // write is the ordinary case and needs no warning.
            if (
              outcome?.applied === false &&
              outcome.storedEpoch !== null &&
              outcome.storedEpoch !== epoch.current
            ) {
              markStale();
              throw new StaleWindowError(questionId);
            }
            // Only clear the buffered edit if it is still the one just written.
            const buffered = pendingText.current[questionId];
            if (buffered && (rev === undefined || buffered.rev === rev)) {
              delete pendingText.current[questionId];
            }
            // Saves are chained per question, so a success here supersedes any
            // earlier failure for the same question.
            const failedRev = failedSaves.current.get(questionId);
            if (failedRev !== undefined && (rev === undefined || failedRev <= rev)) {
              failedSaves.current.delete(questionId);
            }
          } catch (err) {
            failedSaves.current.set(questionId, rev ?? Number.MAX_SAFE_INTEGER);
            setSaveState(err instanceof StaleWindowError ? 'stale' : 'error');
            setSaveError(
              err instanceof StaleWindowError
                ? STALE_MESSAGE
                : err instanceof ApiError
                  ? err.message
                  : 'Could not save your answer.'
            );
            throw err;
          }
        })
        .finally(() => {
          inFlight.current -= 1;
          // Report "Saved" only when nothing is still running and nothing is
          // outstanding, so one quick success cannot paint over another
          // question's failure.
          if (inFlight.current === 0) {
            setSaveState(
              staleWindowRef.current ? 'stale' : failedSaves.current.size > 0 ? 'error' : 'saved'
            );
          }
        });

      saveChains.current[questionId] = chained.catch(() => {});
      return chained;
    },
    [token, markStale]
  );

  persistRef.current = persist;

  const setResponse = (question: Question, response: Answer['response']) => {
    if (submittingRef.current) return;
    const current = answers[question.id];
    // Clicking the selected option again clears it.
    const next: Answer | null =
      current?.response === response
        ? null
        : {
            response,
            // A justification means something different under each response: an
            // N/A exclusion, a compensating control, a remediation note. Carrying
            // it across would let text written for one satisfy the mandatory
            // description of another. Evidence is response-independent, so it stays.
            justification: '',
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

    const rev = nextSeq();
    if (next) pendingText.current[question.id] = { answer: next, rev };
    else delete pendingText.current[question.id];

    persist(question.id, next, rev).catch(() => {});
  };

  const setText = (question: Question, field: 'justification' | 'evidence', value: string) => {
    if (submittingRef.current) return;
    setAnswers((prev) => {
      const existing = prev[question.id];
      if (!existing) return prev;
      return { ...prev, [question.id]: { ...existing, [field]: value } };
    });

    clearTimeout(timers.current[question.id]);
    const rev = nextSeq();
    setAnswers((latest) => {
      const answer = latest[question.id];
      // Buffer the value before the debounce fires, so an early submit or a
      // navigation flushes it instead of losing it.
      if (answer) pendingText.current[question.id] = { answer: { ...answer, [field]: value }, rev };
      return latest;
    });

    timers.current[question.id] = setTimeout(() => {
      const entry = pendingText.current[question.id];
      if (entry && entry.rev === rev) persist(question.id, entry.answer, rev).catch(() => {});
    }, TEXT_SAVE_DELAY);
  };

  /** Write out every debounced edit that has not been sent yet, and wait for it. */
  const flushPendingSaves = useCallback(async () => {
    // One pass is not enough. Awaiting the requests yields to the event loop, and
    // a debounce that fires in that window buffers an edit the pass has already
    // looked past — so the submission would lock answers that did not include it.
    // Drain until a pass finds nothing new outstanding. Edits are frozen before
    // this runs, so this settles immediately in practice; the cap is only there
    // so a pathological case ends rather than spins.
    for (let pass = 0; pass < 5; pass += 1) {
      Object.values(timers.current).forEach(clearTimeout);
      timers.current = {};

      // The map is deliberately not cleared here. A successful save removes its own
      // entry (matched on revision), so anything left afterwards is an edit that
      // failed — and is still there to be resent when the client retries. Clearing
      // upfront lost the failed edit and left submission permanently blocked on a
      // failure it could no longer do anything about.
      const pending = Object.entries(pendingText.current);
      // Swallow individual rejections here: each one is already recorded against
      // its question, and letting the first to fail reject this Promise.all would
      // surface that request's message instead of naming the requirements.
      await Promise.all(
        pending.map(([questionId, entry]) => persist(questionId, entry.answer, entry.rev).catch(() => {}))
      );

      // Saves started earlier may still be running. Those chains swallow their own
      // rejections so they never surface as unhandled, so the failure map is what
      // reports whether any of them actually landed.
      await Promise.all(Object.values(saveChains.current));

      // What is left that has not already been reported as failed? A failed entry
      // stays buffered on purpose and retrying it here would loop.
      const outstanding = Object.keys(pendingText.current).filter(
        (questionId) => !failedSaves.current.has(questionId)
      );
      if (outstanding.length === 0 && Object.keys(timers.current).length === 0) break;
    }

    if (failedSaves.current.size > 0) {
      throw new Error(
        [...failedSaves.current.keys()]
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
          .join(', ')
      );
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
    // Submitting locks the answers the server holds, which are not the answers
    // on screen once another window has moved ahead. Attesting to a set the
    // client has not seen is the one outcome this tool must never produce.
    if (staleWindow) {
      setSaveError(STALE_MESSAGE);
      return;
    }

    // Freeze the answers first, then flush. Leaving the controls live during
    // submission let an edit land after the flush had passed it by: the server
    // locked the older value and the late save came back rejected, leaving the
    // client looking at a results page that disagreed with what they had just
    // selected.
    submittingRef.current = true;
    setSubmitting(true);
    try {
      // Everything typed must reach the server before the answers are locked,
      // otherwise the attested set would not be what the client last saw.
      await flushPendingSaves();
    } catch (err) {
      const which = err instanceof Error && err.message ? `: ${err.message}` : '';
      setSaveError(
        `These answers could not be saved${which}. The questionnaire was not submitted — ` +
          'check your connection, re-enter those answers, and try again.'
      );
      submittingRef.current = false;
      setSubmitting(false);
      return;
    }

    try {
      await api.post(`/api/assessment/${token}/submit`, { name: attestName, title: attestTitle });
      navigate(`/q/${token}/results`);
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : 'Could not submit the questionnaire.');
      submittingRef.current = false;
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
      // Including the epoch: the questionnaire starts here, and until this
      // payload there was none to adopt.
      adoptPayload(refreshed);
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
      adoptPayload(refreshed);
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
          {saveState === 'stale' && (
            <span style={{ color: 'var(--fail)' }}>
              <CircleAlert size={13} /> Changed elsewhere &mdash; reload
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
                frozen={submitting}
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
                      Every requirement needs a response, and answers of Not Applicable or Yes with Compensating
                      Control need written justification.
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
  frozen,
  onRespond,
  onText,
}: {
  question: Question;
  answer?: Answer;
  highlight: boolean;
  /** Set while the questionnaire is being submitted, when nothing may change. */
  frozen: boolean;
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
          const disabled = frozen || (key === 'na' && !question.allowNA);
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
            disabled={frozen}
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
            disabled={frozen}
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
            disabled={frozen}
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
