import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, FileCheck2, ShieldCheck } from 'lucide-react';
import { Header } from '../components/ui';

export default function Landing() {
  return (
    <>
      <Header>
        <Link className="btn btn-secondary btn-sm" to="/admin">
          Assessor sign-in
        </Link>
      </Header>

      <main className="page page-narrow">
        <div className="card" style={{ marginTop: 28 }}>
          <h1>PCI DSS v4.0.1 Self-Assessment Questionnaire D</h1>
          <p className="muted">
            A guided self-assessment covering all twelve PCI DSS v4.0.1 requirements, in the merchant and service provider
            editions of SAQ D.
          </p>

          <div className="stack" style={{ marginTop: 22 }}>
            <Feature
              icon={<ClipboardList size={18} />}
              title="Complete the questionnaire"
              body="Your assessor sends you a private link. Answer each requirement Yes, No, Not Applicable, or Yes with a compensating control. Answers save as you go, so you can stop and come back."
            />
            <Feature
              icon={<ShieldCheck size={18} />}
              title="Get a strict pass or fail"
              body="PCI DSS validation has no partial credit: a single requirement answered No means the assessment does not pass. Not Applicable and compensating controls are handled the way an assessor would treat them."
            />
            <Feature
              icon={<FileCheck2 size={18} />}
              title="Download your report"
              body="A gap remediation report listing every failed requirement, and an attestation summary you can use to complete the official AOC."
            />
          </div>

          <div className="callout callout-info" style={{ marginTop: 22 }}>
            <p className="small" style={{ marginBottom: 0 }}>
              <strong>Have a questionnaire link?</strong> Open the link your assessor sent you. There is no sign-in for
              clients — the link is your access.
            </p>
          </div>

          <p className="small muted" style={{ marginTop: 20, marginBottom: 0 }}>
            This tool is not affiliated with or endorsed by the PCI Security Standards Council. It produces a self-assessment
            record, not an official SAQ or a signed Attestation of Compliance.
          </p>
        </div>
      </main>
    </>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="row" style={{ alignItems: 'flex-start', gap: 14, flexWrap: 'nowrap' }}>
      <span className="brand-mark" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}>
        {icon}
      </span>
      <div>
        <h3 style={{ marginBottom: 2 }}>{title}</h3>
        <p className="small muted" style={{ marginBottom: 0 }}>
          {body}
        </p>
      </div>
    </div>
  );
}
