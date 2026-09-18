import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EligibilityWizard } from '../components/EligibilityWizard';
import { SaqResult } from '../components/SaqResult';
import { Header } from '../components/ui';
import type { EligibilityAnswers, EligibilityOutcome } from '../types';

/**
 * The public "which SAQ do I need?" wizard. Nothing is recorded and no link is
 * required; the tree is bundled with the app, so the result is immediate.
 */
export default function WhichSaq() {
  const [outcome, setOutcome] = useState<EligibilityOutcome | null>(null);
  const [, setAnswers] = useState<EligibilityAnswers>({});

  return (
    <>
      <Header>
        <Link className="btn btn-secondary btn-sm" to="/requirements">
          Requirements
        </Link>
        <Link className="btn btn-secondary btn-sm" to="/">
          Home
        </Link>
      </Header>

      <main className="page page-narrow">
        <div className="page-head">
          <h1>Which SAQ do I need?</h1>
          <p>
            A few questions about how you take payments will identify which PCI DSS v4.0.1 self-assessment questionnaire
            applies to you. Nothing you enter here is saved or sent anywhere.
          </p>
        </div>

        {outcome?.complete && outcome.saq ? (
          <>
            <SaqResult saq={outcome.saq} path={outcome.path} notes={outcome.notes}>
              {outcome.administered ? (
                <div className="callout callout-pass" style={{ marginTop: 16 }}>
                  <p className="small" style={{ marginBottom: 0 }}>
                    This is one of the questionnaires this tool administers. Ask your assessor for a link and you can
                    complete it here.
                  </p>
                </div>
              ) : (
                <div className="callout callout-info" style={{ marginTop: 16 }}>
                  <p className="small" style={{ marginBottom: 0 }}>
                    This tool currently administers SAQ D only. Your assessor can supply {outcome.saq.name} and guide you
                    through it — the official form is available from the PCI SSC Document Library.
                  </p>
                </div>
              )}
            </SaqResult>

            <div className="row" style={{ marginTop: 4 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setOutcome(null);
                  setAnswers({});
                }}
              >
                Start again
              </button>
              <Link className="btn btn-secondary" to="/requirements">
                Browse the requirement catalogue
              </Link>
            </div>
          </>
        ) : (
          <EligibilityWizard
            onComplete={(answers, result) => {
              setAnswers(answers);
              setOutcome(result);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            completeLabel="See which SAQ applies"
          />
        )}
      </main>
    </>
  );
}
