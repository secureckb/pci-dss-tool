import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { api } from './api';
import Landing from './pages/Landing';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminAssessment from './pages/AdminAssessment';
import Questionnaire from './pages/Questionnaire';
import Requirements from './pages/Requirements';
import Results from './pages/Results';
import { Header, Loading } from './components/ui';

/** Gate for the admin area: checks the session cookie before rendering. */
function RequireAdmin({ children }: { children: React.ReactElement }) {
  const [state, setState] = useState<'checking' | 'in' | 'out'>('checking');

  useEffect(() => {
    api
      .get<{ signedIn: boolean }>('/api/admin/session')
      .then((d) => setState(d.signedIn ? 'in' : 'out'))
      .catch(() => setState('out'));
  }, []);

  if (state === 'checking') {
    return (
      <>
        <Header />
        <main className="page">
          <Loading label="Checking your session…" />
        </main>
      </>
    );
  }
  if (state === 'out') return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/requirements" element={<Requirements />} />
      <Route path="/q/:token" element={<Questionnaire />} />
      <Route path="/q/:token/results" element={<Results />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/assessments/:id"
        element={
          <RequireAdmin>
            <AdminAssessment />
          </RequireAdmin>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
