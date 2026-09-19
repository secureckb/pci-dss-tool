import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { migrate, query } from './db.js';
import { isSecureRequest, isLocalRequest } from './auth.js';
import adminRoutes from './routes/admin.js';
import assessmentRoutes from './routes/assessment.js';
import requirementsRoutes from './routes/requirements.js';
import eligibilityRoutes from './routes/eligibility.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT) || 8080;

// Values that appear in .env.example or in documentation are public, so treat
// them as unset: copying the template must not yield a deployable admin console.
const PLACEHOLDER_PASSWORDS = new Set([
  'change-me-before-deploying',
  'change-me',
  'changeme',
  'password',
  'admin',
  'secret',
  'test',
]);
const MIN_ADMIN_PASSWORD_LENGTH = 12;

if (!process.env.ADMIN_PASSWORD) {
  console.error('ADMIN_PASSWORD is not set. Refusing to start with an unprotected admin console.');
  process.exit(1);
}
if (PLACEHOLDER_PASSWORDS.has(process.env.ADMIN_PASSWORD.trim().toLowerCase())) {
  console.error(
    'ADMIN_PASSWORD is still the placeholder from .env.example. That value is public. Set a real password before starting.'
  );
  process.exit(1);
}
if (process.env.ADMIN_PASSWORD.length < MIN_ADMIN_PASSWORD_LENGTH) {
  console.error(
    `ADMIN_PASSWORD must be at least ${MIN_ADMIN_PASSWORD_LENGTH} characters. It is the only credential protecting client compliance data.`
  );
  process.exit(1);
}
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  console.error(
    'SESSION_SECRET is not set, or is shorter than 32 characters. Generate one with:\n' +
      '  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
  );
  process.exit(1);
}

const app = express();
app.set('trust proxy', 1);
app.use(compression());
app.use(express.json({ limit: '256kb' }));
app.use(cookieParser());

/**
 * Transport.
 *
 * A client link is a bearer credential: the token in the URL is all anyone needs
 * to read and answer that questionnaire. Over plain HTTP both the token and the
 * answers cross the network in the clear, so plaintext is refused rather than
 * served.
 *
 * There is deliberately no escape hatch in the request. An earlier version let a
 * redirect carry a marker so that a request coming back still on plaintext was
 * served instead of bounced again — which meant anyone could put that marker in
 * a link and have the whole thing served over HTTP, defeating the point. A
 * redirect condition that a request can talk its way out of is not a redirect
 * condition.
 *
 * So the loop it was avoiding is handled by saying so at startup instead: an
 * instance whose proxy terminates TLS without setting X-Forwarded-Proto cannot
 * be told apart from a plaintext one, and will loop until the browser gives up.
 * The fix is to set that header, or to set REQUIRE_HTTPS=0 for an instance the
 * operator accepts is plaintext. Local development is exempt, since there is no
 * TLS to have, and so is the health check, which a platform probes directly on
 * the service's own port — behind the TLS edge, with nothing confidential in the
 * response.
 *
 * HSTS is sent whenever the request did arrive over TLS, so a browser that has
 * been here once will not be talked down to HTTP afterwards.
 */
const REQUIRE_HTTPS = !/^(0|false|no|off)$/i.test(process.env.REQUIRE_HTTPS ?? '');
const HEALTH_PATH = '/api/health';

app.use((req, res, next) => {
  if (isSecureRequest(req)) {
    res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    return next();
  }
  if (!REQUIRE_HTTPS || isLocalRequest(req) || req.path === HEALTH_PATH) return next();

  // 308 keeps the method and body, so a save in flight is not turned into a GET.
  return res.redirect(308, `https://${req.get('host')}${req.originalUrl}`);
});

/**
 * Nothing behind a client link or an admin session may be cached.
 *
 * These responses carry the client's identity, their answers and their gaps,
 * and they are reached through a URL that is itself the credential. A shared
 * browser or an intermediary holding a copy would disclose all of it to whoever
 * comes next. The public requirement catalogue is deliberately not covered: it
 * is the same for everyone and is cached for an hour on purpose.
 */
app.use(['/api/assessment', '/api/admin'], (req, res, next) => {
  res.set('Cache-Control', 'no-store, private');
  next();
});

/**
 * Health check.
 *
 * Every useful operation needs Postgres, so an instance that cannot reach it is
 * not healthy however well the process is running. Reporting 200 regardless
 * would leave the platform routing client traffic to an instance where every
 * assessment request fails.
 */
app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ ok: true, database: 'up' });
  } catch (err) {
    console.error('Health check failed: database unreachable', err.message);
    res.status(503).json({ ok: false, database: 'down' });
  }
});

app.use('/api/admin', adminRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/requirements', requirementsRoutes);
app.use('/api/eligibility', eligibilityRoutes);

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

// Any unhandled route error still returns JSON to the SPA rather than an HTML page.
app.use('/api', (err, req, res, _next) => {
  // A malformed request body is the client's fault, not a server failure.
  if (err?.type === 'entity.parse.failed' || err?.status === 400) {
    return res.status(400).json({ error: 'Malformed request.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

if (fs.existsSync(DIST)) {
  app.use(express.static(DIST, { index: false, maxAge: '1h' }));
  // Client-side routing: every non-API path serves the SPA shell.
  app.get('*', (req, res) => res.sendFile(path.join(DIST, 'index.html')));
} else {
  app.get('*', (req, res) =>
    res
      .status(503)
      .type('text/plain')
      .send('The front end has not been built. Run "npm run build", or use "npm run dev" for local development.')
  );
}

migrate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`PCI DSS SAQ D tool listening on port ${PORT}`);
      if (REQUIRE_HTTPS) {
        console.log(
          'Plain HTTP is redirected to HTTPS. If TLS is terminated by a proxy in front of this ' +
            'service, that proxy must set X-Forwarded-Proto, or requests will be redirected back to ' +
            'it until the browser gives up. Set REQUIRE_HTTPS=0 for an instance that is genuinely ' +
            'plaintext.'
        );
      }
    });
  })
  .catch((err) => {
    // Certificate verification is on by default now, so a provider whose
    // certificate does not chain to a public root fails here. Say what to do
    // about it rather than leaving an operator to decode a TLS error.
    if (/self.signed|unable to verify|certificate|does not support SSL|SSL/i.test(err?.message || '')) {
      console.error(
        'The Postgres connection failed over TLS. If your provider uses a private root, supply it in ' +
          'DATABASE_CA; if the database is reached over a private network with no TLS, set ' +
          'DATABASE_SSL=off; to connect encrypted but unverified, set DATABASE_SSL=no-verify and ' +
          'accept that the connection is not authenticated.'
      );
    }
    console.error('Failed to run database migrations:', err);
    process.exit(1);
  });
