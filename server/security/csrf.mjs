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

export function csrfProtection(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();
  if (!req.path.startsWith("/api/")) return next();
  if (req.path.startsWith("/api/auth/")) return next();
  // MMHB Buddy Engine: stateless healing surface (no DB writes, no auth state).
  if (req.path === "/api/buddy") return next();
  // Public/bootstrap entry points that must work without an established session:
  // admin login token verification + public lead / newsletter forms.
  if (req.path === "/api/admin/verify-token") return next();
  if (req.path === "/api/newsletter/subscribe") return next();
  if (req.path === "/api/newsletter/unsubscribe") return next();
  if (req.path === "/api/leads") return next();
  if (req.path === "/api/contact") return next();
  if (req.path === "/api/feedback") return next();
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
