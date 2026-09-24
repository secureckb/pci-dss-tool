/**
 * Runs the suites, each against a freshly started server and an empty database.
 *
 * Both of those matter. The server keeps sign-in lockouts in memory, so a suite
 * that exercises the lockout would otherwise lock the next one out; and suites
 * pick assessments out of the admin table by client name, so leftovers from an
 * earlier run make those selectors ambiguous.
 *
 *   npm test                    every suite
 *   npm test -- api             only that folder
 *   npm test -- second-window   only suites whose name contains this
 *
 * TEST_DATABASE_URL must be set, and is truncated between suites. It is
 * deliberately not DATABASE_URL: nothing here should be one typo away from
 * emptying a real database.
 */
import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');

const DATABASE_URL = process.env.TEST_DATABASE_URL;
if (!DATABASE_URL) {
  console.error(
    'TEST_DATABASE_URL is not set. Point it at a database you are happy to empty, for example:\n' +
      '  TEST_DATABASE_URL=postgres://postgres@localhost:5432/pci_saq_test npm test'
  );
  process.exit(2);
}

const PORT = Number(process.env.TEST_PORT) || 8099;
const BASE_URL = `http://localhost:${PORT}`;
const ADMIN_PASSWORD = 'test-admin-password-long';
const SESSION_SECRET = '0123456789abcdef0123456789abcdef';

const filter = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const matches = (kind, name) =>
  filter.length === 0 || filter.some((f) => kind === f || name.includes(f) || `${kind}/${name}`.includes(f));

const suites = [];
for (const [kind, ext] of [
  ['unit', '.mjs'],
  ['api', '.py'],
  ['browser', '.mjs'],
]) {
  for (const file of readdirSync(path.join(here, kind)).sort()) {
    if (file.endsWith(ext) && matches(kind, file.replace(ext, ''))) {
      suites.push({ kind, file, runner: ext === '.py' ? 'python3' : process.execPath });
    }
  }
}
if (suites.length === 0) {
  console.error(`No suites matched: ${filter.join(', ')}`);
  process.exit(2);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

/** Empty the data without dropping the schema the server just migrated. */
async function emptyDatabase() {
  const { rows } = await pool.query("SELECT to_regclass('public.assessments') IS NOT NULL AS ready");
  if (rows[0].ready) await pool.query('TRUNCATE assessments CASCADE');
}

function startServer() {
  const server = spawn(process.execPath, ['server/index.js'], {
    cwd: root,
    env: {
      ...process.env,
      DATABASE_URL,
      ADMIN_PASSWORD,
      SESSION_SECRET,
      PORT: String(PORT),
      PUBLIC_BASE_URL: BASE_URL,
      NODE_ENV: 'test',
      // Blanked rather than inherited. Suites assert what the tool does with the
      // remediation advisor switched off, and a developer who happens to have a
      // key exported would otherwise see those fail for a reason that has
      // nothing to do with their change. The one suite that needs the advisor on
      // starts its own server with a placeholder key.
      ANTHROPIC_API_KEY: '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const log = [];
  server.stdout.on('data', (d) => log.push(d.toString()));
  server.stderr.on('data', (d) => log.push(d.toString()));
  return { server, log };
}

async function waitForHealth(timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      if (res.ok) return true;
    } catch {
      // Not listening yet.
    }
    if (Date.now() > deadline) return false;
    await new Promise((r) => setTimeout(r, 200));
  }
}

function stopServer(server) {
  return new Promise((resolve) => {
    if (server.exitCode !== null) return resolve();
    server.once('exit', resolve);
    server.kill('SIGTERM');
    setTimeout(() => server.kill('SIGKILL'), 5000).unref();
  });
}

function runSuite(suite) {
  return new Promise((resolve) => {
    const child = spawn(suite.runner, [path.join(here, suite.kind, suite.file)], {
      cwd: root,
      env: { ...process.env, BASE_URL, ADMIN_PASSWORD, SESSION_SECRET, DATABASE_URL },
      stdio: 'inherit',
    });
    child.on('exit', (code) => resolve(code ?? 1));
  });
}

const results = [];
for (const suite of suites) {
  const name = `${suite.kind}/${suite.file}`;
  console.log(`\n--- ${name} ${'-'.repeat(Math.max(0, 62 - name.length))}`);

  // The unit suites import modules directly and need no server.
  const needsServer = suite.kind !== 'unit';
  let running = null;
  if (needsServer) {
    running = startServer();
    if (!(await waitForHealth())) {
      console.error('The server did not become healthy:\n' + running.log.join(''));
      await stopServer(running.server);
      results.push({ name, code: 1 });
      continue;
    }
    await emptyDatabase();
  }

  const code = await runSuite(suite);
  if (running) await stopServer(running.server);
  results.push({ name, code });
}

await pool.end();

const failed = results.filter((r) => r.code !== 0);
console.log(`\n${'='.repeat(66)}`);
for (const r of results) console.log(`  ${r.code === 0 ? 'pass' : 'FAIL'}  ${r.name}`);
console.log(
  `\n${results.length - failed.length}/${results.length} suites passed` +
    (failed.length ? `. Failed: ${failed.map((f) => f.name).join(', ')}` : '')
);
process.exit(failed.length ? 1 : 0);
