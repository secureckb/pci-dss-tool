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

export function setSessionCookie(res) {
  res.cookie(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
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
