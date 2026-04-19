import crypto from "node:crypto";
import csrf from "csurf";

// SINGLE shared instance
export const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: "lax",
  },
});

// helper to send token
export function issueCsrfToken(req, res) {
  res.json({
    ok: true,
    csrfToken: req.csrfToken(),
  });
}
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
