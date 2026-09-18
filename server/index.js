import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { migrate } from './db.js';
import adminRoutes from './routes/admin.js';
import assessmentRoutes from './routes/assessment.js';
import requirementsRoutes from './routes/requirements.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT) || 8080;

if (!process.env.ADMIN_PASSWORD) {
  console.error('ADMIN_PASSWORD is not set. Refusing to start with an unprotected admin console.');
  process.exit(1);
}
if (!process.env.SESSION_SECRET) {
  console.error(
    'SESSION_SECRET is not set. Generate one with:\n' +
      '  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
  );
  process.exit(1);
}

const app = express();
app.set('trust proxy', 1);
app.use(compression());
app.use(express.json({ limit: '256kb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/admin', adminRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/requirements', requirementsRoutes);

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
    });
  })
  .catch((err) => {
    console.error('Failed to run database migrations:', err);
    process.exit(1);
  });
