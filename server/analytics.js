import { asyncRouter } from './async-router.js';
import { query } from './db.js';
import { requireAdmin } from './auth.js';
import { GUIDES } from './guides.js';

/**
 * Visit counting for the public pages.
 *
 * What is stored: a day, a page path from a fixed list, and a short campaign
 * label, with a count. That is all.
 *
 * What is deliberately not stored or sent anywhere: IP addresses, user agents,
 * cookies, referrer URLs, or anything about the visitor. There is no script on
 * the page and no third party. A visit is counted by the server when it serves
 * the page, so the count can be wrong (caches, prefetching) but it cannot leak
 * anything a browser would not already have sent.
 *
 * What is never counted: anything under /q/ (a client link is a bearer
 * credential and must never reach a log or a table), /admin and /api. The path
 * is matched against an allowlist, not filtered by a denylist, so a new route is
 * uncounted until someone adds it here on purpose.
 */

export const TRACKED_PATHS = new Set([
  '/',
  '/requirements',
  '/which-saq',
  '/guides',
  ...GUIDES.map((g) => `/guides/${g.slug}`),
]);

const MAX_SOURCE_LENGTH = 40;
const MAX_SOURCES_PER_DAY = 100;
const DEFAULT_SOURCE = 'direct';
const OVERFLOW_SOURCE = 'other';

/** Collapse a request path to one of the tracked paths, or null. */
export function trackedPath(rawPath) {
  if (typeof rawPath !== 'string') return null;
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : rawPath;
  return TRACKED_PATHS.has(path) ? path : null;
}

/**
 * A campaign label from ?src= or ?utm_source=, restricted to a boring alphabet
 * so it cannot carry anything personal (an email address contains '@') or break
 * the admin page. Anything else counts as direct.
 */
export function cleanSource(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== 'string') return DEFAULT_SOURCE;
  const s = raw.trim().toLowerCase();
  if (!s || s.length > MAX_SOURCE_LENGTH) return DEFAULT_SOURCE;
  return /^[a-z0-9][a-z0-9_-]*$/.test(s) ? s : DEFAULT_SOURCE;
}

const BOT_PATTERN =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|curl|wget|python|node-fetch|axios|headless|lighthouse|monitor|uptime|pingdom|statuscake|go-http-client|java\//i;

/** Crawlers and monitors would drown the signal. The user agent is read for this
 *  decision and then discarded. */
export function looksAutomated(userAgent) {
  if (typeof userAgent !== 'string' || userAgent.length === 0) return true;
  return BOT_PATTERN.test(userAgent);
}

// A per-address ceiling so someone refreshing in a loop cannot turn page loads
// into database writes. Held in memory only, bounded, and never stored.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 120;
const MAX_TRACKED_CLIENTS = 5000;
const recent = new Map();

function underRateLimit(key, now = Date.now()) {
  if (recent.size > MAX_TRACKED_CLIENTS) {
    for (const [k, v] of recent) if (now - v.start > WINDOW_MS) recent.delete(k);
    if (recent.size > MAX_TRACKED_CLIENTS) recent.clear();
  }
  const entry = recent.get(key);
  if (!entry || now - entry.start > WINDOW_MS) {
    recent.set(key, { start: now, n: 1 });
    return true;
  }
  entry.n += 1;
  return entry.n <= MAX_PER_WINDOW;
}

/** Count one visit. Never throws: a failed count must not fail the page. */
export async function recordVisit(req, path) {
  try {
    if (req.method !== 'GET') return;
    if (looksAutomated(req.get('user-agent'))) return;
    if (!underRateLimit(req.ip || 'unknown')) return;
    const tracked = trackedPath(path);
    if (!tracked) return;

    let source = cleanSource(req.query?.src ?? req.query?.utm_source);

    // Bound the number of distinct labels per day, so a caller inventing new
    // ones cannot grow the table without limit.
    if (source !== DEFAULT_SOURCE) {
      const known = await query(
        `SELECT 1 FROM page_events WHERE day = (now() AT TIME ZONE 'utc')::date AND source = $1 LIMIT 1`,
        [source]
      );
      if (known.rowCount === 0) {
        const distinct = await query(
          `SELECT count(DISTINCT source)::int AS n FROM page_events WHERE day = (now() AT TIME ZONE 'utc')::date`
        );
        if (distinct.rows[0].n >= MAX_SOURCES_PER_DAY) source = OVERFLOW_SOURCE;
      }
    }

    await query(
      `INSERT INTO page_events (day, path, event, source, hits)
       VALUES ((now() AT TIME ZONE 'utc')::date, $1, 'view', $2, 1)
       ON CONFLICT (day, path, event, source) DO UPDATE SET hits = page_events.hits + 1`,
      [tracked, source]
    );
  } catch (err) {
    console.error('Could not record a page visit:', err.message);
  }
}

const router = asyncRouter();

/** Admin-only summary for the dashboard. */
router.get('/', requireAdmin, async (req, res) => {
  const days = Math.min(Math.max(parseInt(String(req.query.days), 10) || 30, 1), 365);

  const byPath = await query(
    `SELECT path, sum(hits)::int AS views
       FROM page_events
      WHERE event = 'view' AND day > (now() AT TIME ZONE 'utc')::date - $1::int
      GROUP BY path ORDER BY views DESC`,
    [days]
  );
  const bySource = await query(
    `SELECT source, sum(hits)::int AS views
       FROM page_events
      WHERE event = 'view' AND day > (now() AT TIME ZONE 'utc')::date - $1::int
      GROUP BY source ORDER BY views DESC LIMIT 20`,
    [days]
  );
  const total = byPath.rows.reduce((n, r) => n + r.views, 0);

  res.json({ days, total, byPath: byPath.rows, bySource: bySource.rows });
});

export default router;
