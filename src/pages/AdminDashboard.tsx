import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { api } from '../api';
import { CopyLink, Header, Loading, formatDate } from '../components/ui';
import type { AdminAssessmentSummary, Variant } from '../types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<AdminAssessmentSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);

  const load = () =>
    api
      .get<{ assessments: AdminAssessmentSummary[] }>('/api/admin/assessments')
      .then((d) => setAssessments(d.assessments))
      .catch((err: any) => {
        if (err.status === 401) navigate('/admin/login', { replace: true });
        else setError(err.message);
      });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await api.post('/api/admin/logout');
    navigate('/admin/login', { replace: true });
  };

  return (
    <>
      <Header>
        <Link className="btn btn-secondary btn-sm" to="/requirements">
          Requirements
        </Link>
        <button className="btn btn-secondary btn-sm" onClick={signOut}>
          Sign out
        </button>
      </Header>

      <main className="page">
        <div className="row-between page-head">
          <div>
            <h1>Client assessments</h1>
            <p>Create a questionnaire, send the client its link, and review the result when they submit.</p>
          </div>
          <button className="btn" onClick={() => setShowForm((v) => !v)}>
            <Plus size={15} /> New assessment
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {createdLink && (
          <div className="card">
            <div className="callout callout-pass">
              <h3>Assessment created</h3>
              <p className="small">
                Send this link to your client. Anyone with the link can complete the questionnaire, so share it directly with
                the intended contact.
              </p>
              <CopyLink link={createdLink} />
            </div>
          </div>
        )}

        {showForm && (
          <NewAssessmentForm
            onCreated={(link) => {
              setCreatedLink(link);
              setShowForm(false);
              load();
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        <div className="card">
          {!assessments ? (
            <Loading />
          ) : assessments.length === 0 ? (
            <p className="muted small" style={{ margin: 0 }}>
              No assessments yet. Create one to get a client link.
            </p>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Edition</th>
                    <th>Status</th>
                    <th className="num">Answered</th>
                    <th>Created</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <strong>{a.clientName}</strong>
                        {a.contactEmail && <div className="small muted">{a.contactEmail}</div>}
                      </td>
                      <td className="small">{a.variantLabel}</td>
                      <td>
                        {a.status === 'submitted' ? (
                          <span className="badge badge-pass">Submitted {formatDate(a.submittedAt)}</span>
                        ) : (
                          <span className="badge badge-muted">In progress</span>
                        )}
                      </td>
                      <td className="num">{a.answered}</td>
                      <td className="small muted">{formatDate(a.createdAt)}</td>
                      <td className="num">
                        <Link className="btn btn-secondary btn-sm" to={`/admin/assessments/${a.id}`}>
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function NewAssessmentForm({ onCreated, onCancel }: { onCreated: (link: string) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    clientName: '',
    dba: '',
    contactName: '',
    contactEmail: '',
    scopeSummary: '',
    internalNotes: '',
    variant: 'merchant' as Variant,
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await api.post<{ link: string }>('/api/admin/assessments', form);
      onCreated(res.link);
    } catch (err: any) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h2>New client assessment</h2>
      <form onSubmit={submit}>
        <div className="grid grid-2">
          <label className="field">
            <span>Client legal name</span>
            <input type="text" value={form.clientName} onChange={update('clientName')} required />
          </label>
          <label className="field">
            <span>Doing business as (optional)</span>
            <input type="text" value={form.dba} onChange={update('dba')} />
          </label>
          <label className="field">
            <span>Contact name</span>
            <input type="text" value={form.contactName} onChange={update('contactName')} />
          </label>
          <label className="field">
            <span>Contact email</span>
            <input type="email" value={form.contactEmail} onChange={update('contactEmail')} />
          </label>
        </div>

        <label className="field">
          <span>SAQ D edition</span>
          <select value={form.variant} onChange={update('variant')}>
            <option value="merchant">SAQ D for Merchants</option>
            <option value="service-provider">SAQ D for Service Providers</option>
          </select>
        </label>
        <p className="hint" style={{ marginTop: -8, marginBottom: 14 }}>
          The service provider edition adds the requirements that apply only to service providers, including Appendix A1 for
          multi-tenant providers.
        </p>

        <label className="field">
          <span>Scope summary (shown to the client)</span>
          <textarea value={form.scopeSummary} onChange={update('scopeSummary')} placeholder="Which systems, locations, and payment channels this assessment covers." />
        </label>

        <label className="field">
          <span>Internal notes (never shown to the client)</span>
          <textarea value={form.internalNotes} onChange={update('internalNotes')} />
        </label>

        {error && <p className="error-text">{error}</p>}

        <div className="row">
          <button className="btn" type="submit" disabled={busy || !form.clientName.trim()}>
            {busy ? 'Creating…' : 'Create and generate link'}
          </button>
          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
