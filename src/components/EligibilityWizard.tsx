import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check, RotateCcw } from 'lucide-react';
import { determineSaq } from '../../shared/eligibility.js';
import { Progress } from './ui';
import type { EligibilityAnswers, EligibilityOutcome, EligibilityStep } from '../types';

/**
 * The shared eligibility wizard: one question at a time, with the trail of
 * answers so far shown above it so a client can see and revise what led here.
 *
 * The outcome is computed locally for immediate feedback. Inside a client
 * assessment the server recomputes it from the same tree before storing, so
 * this is presentation, never the authority.
 */
export function EligibilityWizard({
  intro,
  onComplete,
  busy,
  error,
  completeLabel = 'See my result',
}: {
  intro?: React.ReactNode;
  onComplete: (answers: EligibilityAnswers, outcome: EligibilityOutcome) => void;
  busy?: boolean;
  error?: string | null;
  completeLabel?: string;
}) {
  const [answers, setAnswers] = useState<EligibilityAnswers>({});

  const state = useMemo(() => determineSaq(answers) as EligibilityOutcome, [answers]);

  const answer = (stepId: string, value: string) => {
    // Answers below this point belong to a branch that may no longer apply, so
    // drop them: determineSaq ignores them anyway, and keeping them would make
    // "go back and change your mind" show stale steps.
    const keep: EligibilityAnswers = {};
    for (const entry of state.path) {
      if (entry.stepId === stepId) break;
      keep[entry.stepId] = entry.value;
    }
    setAnswers({ ...keep, [stepId]: value });
  };

  const goBackTo = (stepId: string) => {
    const keep: EligibilityAnswers = {};
    for (const entry of state.path) {
      if (entry.stepId === stepId) break;
      keep[entry.stepId] = entry.value;
    }
    setAnswers(keep);
  };

  const answeredSteps = state.path;
  // The tree is at most six questions deep on any path; used only for the bar.
  const estimatedTotal = Math.max(answeredSteps.length + (state.complete ? 0 : 1), 4);
  const percent = Math.round((answeredSteps.length / estimatedTotal) * 100);

  return (
    <div>
      {intro}

      {answeredSteps.length > 0 && (
        <div className="card card-tight" style={{ marginBottom: 14 }}>
          <div className="row-between" style={{ marginBottom: 8 }}>
            <span className="small muted">
              {answeredSteps.length} question{answeredSteps.length === 1 ? '' : 's'} answered
            </span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAnswers({})}>
              <RotateCcw size={13} /> Start again
            </button>
          </div>
          <Progress percent={state.complete ? 100 : percent} />

          <ul className="answer-trail">
            {answeredSteps.map((entry) => (
              <li key={entry.stepId}>
                <div>
                  <span className="trail-question">{entry.question}</span>
                  <span className="trail-answer">
                    <Check size={13} /> {entry.label}
                  </span>
                </div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => goBackTo(entry.stepId)}>
                  <ArrowLeft size={13} /> Change
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!state.complete && state.nextStep && (
        <StepCard step={state.nextStep} onAnswer={(value) => answer(state.nextStep!.id, value)} />
      )}

      {state.complete && (
        <div className="card">
          <h2>That is everything we need</h2>
          <p className="small muted">
            Based on your answers, we can determine which self-assessment questionnaire applies to you.
          </p>
          {error && <p className="error-text">{error}</p>}
          <button
            type="button"
            className="btn"
            disabled={busy}
            onClick={() => onComplete(answers, state)}
          >
            {busy ? 'Working…' : completeLabel}
          </button>
        </div>
      )}
    </div>
  );
}

function StepCard({ step, onAnswer }: { step: EligibilityStep; onAnswer: (value: string) => void }) {
  return (
    <div className="card">
      <h2>{step.question}</h2>
      {step.help && <p className="small muted">{step.help}</p>}

      <div className="stack" style={{ marginTop: 16 }}>
        {step.options.map((option) => (
          <button key={option.value} type="button" className="choice" onClick={() => onAnswer(option.value)}>
            <strong>{option.label}</strong>
            <span className="small muted">{option.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
