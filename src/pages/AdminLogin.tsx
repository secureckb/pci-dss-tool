import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Header } from '../components/ui';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.post('/api/admin/login', { password });
      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <>
      <Header />
      <main className="page page-narrow" style={{ maxWidth: 420 }}>
        <div className="card" style={{ marginTop: 40 }}>
          <h1>Assessor sign-in</h1>
          <p className="small muted">Sign in to create client questionnaires and review submissions.</p>
          <form onSubmit={submit}>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                autoFocus
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && <p className="error-text">{error}</p>}
            <button className="btn" type="submit" disabled={busy || !password}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
