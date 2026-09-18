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

/** Loopback and private ranges: where a TLS-terminating proxy in front of this
 *  process connects from. A request arriving from anywhere else reached the
 *  application directly. */
function isPrivatePeer(address) {
  if (!address) return false;
  const ip = address.startsWith('::ffff:') ? address.slice(7) : address;
  if (ip === '127.0.0.1' || ip === '::1') return true;
  if (/^10\./.test(ip) || /^192\.168\./.test(ip)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true;
  if (/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(ip)) return true; // CGNAT
  if (/^f[cd]/i.test(ip)) return true; // fc00::/7
  return false;
}

/**
 * Whether the request reached this process over TLS.
 *
 * Direct TLS is decided from the socket. X-Forwarded-Proto is only believed
 * when the connection came from a proxy — that is, from a loopback or private
 * address — because the header is set by whoever opened the connection. Trusting
 * it unconditionally (which is what `req.secure` does under `trust proxy`) let
 * any client on the internet send `X-Forwarded-Proto: https` over plain HTTP and
 * satisfy the check below, which exists precisely to stop the admin password
 * crossing the network in clear text.
 *
 * The platform's edge always reaches the application over its private network,
 * so this costs a correctly deployed instance nothing.
 */
function isHttps(req) {
  if (req.socket?.encrypted) return true;
  if (!isPrivatePeer(req.socket?.remoteAddress)) return false;
  return (req.get('x-forwarded-proto') || '').split(',')[0].trim() === 'https';
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
