import crypto from "node:crypto";

const COOKIE_NAME = "csrf_secret";
const HEADER_NAME = "x-csrf-token";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function newSecret() {
  return crypto.randomBytes(32).toString("hex");
}

function setSecretCookie(res, secret) {
  res.cookie(COOKIE_NAME, secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  });
}

export function issueCsrfToken(req, res) {
  let secret = req.cookies?.[COOKIE_NAME];
  if (!secret || typeof secret !== "string" || secret.length < 32) {
    secret = newSecret();
    setSecretCookie(res, secret);
  }
  return secret;
}

function timingSafeEq(a, b) {
  try {
    const ab = Buffer.from(String(a));
    const bb = Buffer.from(String(b));
    if (ab.length !== bb.length) return false;
    return crypto.timingSafeEqual(ab, bb);
  } catch {
    return false;
  }
}

// Local auth endpoints use browser cookies, including refresh and logout.
// Fetch Metadata and exact origin checks protect their same-origin web contract.
export function isSameOriginAuthRequest(req) {
  const headers = req.headers || {};
  const site = headers["sec-fetch-site"];
  if (site !== undefined && site !== "same-origin") return false;

  const origin = headers.origin;
  if (origin === undefined && site === "same-origin") return true;

  const host = headers.host;
  if (typeof host !== "string" || !host || /[\s\\/?#@]/.test(host)) return false;
  if (req.protocol !== "https" && req.protocol !== "http") return false;
  let target;
  try {
    target = new URL(req.protocol + "://" + host).origin;
  } catch {
    return false;
  }

  // A present but invalid Origin must never fall back to another header.
  if (origin !== undefined) {
    if (typeof origin !== "string") return false;
    try {
      const parsed = new URL(origin);
      return (parsed.protocol === "https:" || parsed.protocol === "http:")
        && parsed.origin === origin && parsed.origin === target;
    } catch {
      return false;
    }
  }

  const referer = headers.referer;
  if (typeof referer !== "string" || /[\u0000-\u0020\u007f\\]/.test(referer)) return false;
  try {
    const parsed = new URL(referer);
    return (parsed.protocol === "https:" || parsed.protocol === "http:")
      && !parsed.username && !parsed.password && parsed.origin === target;
  } catch {
    return false;
  }
}

export function csrfProtection(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();
  // Match Express's case-insensitive auth mount before generic path/header exemptions.
  if (/^\/api\/auth(?:\/|$)/i.test(req.path)) {
    if (!isSameOriginAuthRequest(req)) {
      res.set("Cache-Control", "no-store");
      return res.status(403).json({
        error: "Same-origin authentication request required",
        code: "AUTH_ORIGIN_REQUIRED",
      });
    }
    return next();
  }
  if (!req.path.startsWith("/api/")) return next();
  // MMHB Buddy Engine: stateless healing surface (no DB writes, no auth state).
  if (req.path === "/api/buddy") return next();
  // Public/bootstrap entry points that must work without an established session:
  // admin login token verification + public lead / newsletter forms.
  if (req.path === "/api/admin/verify-token") return next();
  if (req.path === "/api/account/password-reset/request") return next();
  if (req.path === "/api/account/password-reset/confirm") return next();
  if (req.path === "/api/newsletter/subscribe") return next();
  if (req.path === "/api/newsletter/unsubscribe") return next();
  if (req.path === "/api/leads") return next();
  if (req.path === "/api/contact") return next();
  if (req.path === "/api/feedback") return next();
  // Anonymous, no-credential analytics beacon (fire-and-forget, no PII, no
  // auth state). Browser sends it without a CSRF token; it only writes a
  // single low-risk telemetry row, so it is exempt by design.
  if (req.path === "/api/analytics/event") return next();
  // v2.0 Prompt 3.2 — public awareness scanning (optionalAuth, stateless,
  // no DB writes unless severity threshold crossed). Authenticated /report
  // and /progress routes pass through the Bearer-token check below.
  if (req.path === "/api/awareness/detect") return next();
  // v2.0 Prompt 3.4 — biometric provider OAuth callback (3rd-party redirect,
  // GET-only via the SAFE_METHODS check above) and HealthKit webhook
  // (HMAC-signed, not browser-driven so no CSRF surface).
  if (req.path === "/api/biometrics/healthkit/webhook") return next();

  const auth = req.headers?.authorization || "";
  if (auth.startsWith("Bearer ")) return next();
  if (req.headers?.["x-guest-id"]) return next();

  const cookieSecret = req.cookies?.[COOKIE_NAME];
  const headerToken = req.headers?.[HEADER_NAME];
  if (!cookieSecret || !headerToken || !timingSafeEq(cookieSecret, headerToken)) {
    return res.status(403).json({ error: "CSRF token missing or invalid" });
  }
  return next();
}
