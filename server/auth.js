import crypto from 'node:crypto';

const COOKIE_NAME = 'pci_admin';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) {
    throw new Error('SESSION_SECRET is not set.');
  }
  return value;
}

function sign(payload) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

/** Issues a signed, expiring session token. No session table needed for a single admin. */
export function createSessionToken() {
  const payload = `${Date.now() + SESSION_TTL_MS}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  if (typeof token !== 'string') return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

/** Constant-time password comparison, so a wrong guess leaks no timing information. */
export function checkAdminPassword(candidate) {
  const actual = process.env.ADMIN_PASSWORD;
  if (!actual || typeof candidate !== 'string') return false;
  const a = crypto.createHash('sha256').update(candidate).digest();
  const b = crypto.createHash('sha256').update(actual).digest();
  return crypto.timingSafeEqual(a, b);
}

/**
 * Whether to mark the session cookie Secure.
 *
 * Keying this off NODE_ENV alone is unreliable: a platform may not set it at
 * runtime, and the cookie would then be sent over plaintext. Decide from the
 * request instead — Express resolves `req.secure` from X-Forwarded-Proto when
 * `trust proxy` is set, which is how it runs behind Railway's edge. Any request
 * that did not arrive over HTTPS is treated as local development.
 */
function isHttps(req) {
  return req.secure || (req.get('x-forwarded-proto') || '').split(',')[0].trim() === 'https';
}

/** Local development, where there is no TLS to have and nothing to intercept. */
function isLocalRequest(req) {
  const host = (req.get('host') || '').split(':')[0].toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]';
}

/**
 * Whether a sign-in may proceed at all.
 *
 * Marking the cookie Secure only when the request arrived over HTTPS leaves a
 * deployment that also answers plain HTTP handing out admin sessions in clear
 * text. Rather than issue a weaker cookie in that case, refuse the sign-in:
 * there is no legitimate reason to authenticate to a deployed instance over
 * plaintext, and local development is exempt because it has no TLS to use.
 */
export function canAuthenticate(req) {
  return isHttps(req) || isLocalRequest(req);
}

export function setSessionCookie(req, res) {
  res.cookie(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: isHttps(req),
    maxAge: SESSION_TTL_MS,
    path: '/',
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
}

export function requireAdmin(req, res, next) {
  if (verifySessionToken(req.cookies?.[COOKIE_NAME])) return next();
  return res.status(401).json({ error: 'Not signed in.' });
}

export function isAdmin(req) {
  return verifySessionToken(req.cookies?.[COOKIE_NAME]);
}

export { COOKIE_NAME };
