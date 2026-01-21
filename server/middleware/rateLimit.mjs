// server/middleware/rateLimit.mjs
// Enhanced rate limiting with per-route configurations

import rateLimitLib from "express-rate-limit";

// [MMB] In-memory limiter with health bypass + headers
export function createRateLimiter({ windowMs, max, keyGenerator }) {
  const hits = new Map();
  return function rateLimiter(req, res, next) {
    if (req.path === "/api/health") return next();
    const key = (keyGenerator && keyGenerator(req)) || req.ip || "anon";
    const now = Date.now();
    const start = now - windowMs;
    let bucket = hits.get(key);
    if (!bucket) { bucket = []; hits.set(key, bucket); }
    while (bucket.length && bucket[0] <= start) bucket.shift();
    if (bucket.length >= max) {
      const resetIn = bucket[0] + windowMs - now;
      res.setHeader("X-RateLimit-Limit", String(max));
      res.setHeader("X-RateLimit-Remaining", "0");
      res.setHeader("X-RateLimit-Reset", String(Date.now() + resetIn));
      return res.status(429).json({ ok: false, message: "Too many requests", errorCode: "RATE_LIMITED" });
    }
    bucket.push(now);
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(max - bucket.length));
    next();
  };
}
// =====================================================
// FILE: server/middleware/rateLimit.mjs
// Replaces/updates your current rateLimit middleware.
// Provides both authRateLimit (generic) and loginRateLimit (security-uniform).
// =====================================================

const attempts = new Map(); // key -> { count, firstAt, blockedUntil }

function nowMs() {
  return Date.now();
}

function getKey(req) {
  const xf = req.headers["x-forwarded-for"];
  const ip = Array.isArray(xf) ? xf[0] : xf;
  return (ip || req.ip || "unknown").toString();
}

/**
 * @param {import("express").Response} res
 * @param {number} status
 * @param {string} message
 */
function sendJson(res, status, message) {
  return res.status(status).json({ message });
}

/**
 * Generic limiter. Use for non-auth endpoints if you want.
 * Returns 429 on block.
 *
 * @param {{ windowMs?: number, max?: number, blockMs?: number }} opts
 */
function createRateLimit(opts = {}) {
  const windowMs = opts.windowMs ?? 15 * 60 * 1000;
  const max = opts.max ?? 30;
  const blockMs = opts.blockMs ?? 15 * 60 * 1000;

  return (req, res, next) => {
    const key = getKey(req);
    const entry = attempts.get(key) || { count: 0, firstAt: nowMs(), blockedUntil: 0 };
    const t = nowMs();

    if (entry.blockedUntil && t < entry.blockedUntil) {
      const retryAfterSec = Math.ceil((entry.blockedUntil - t) / 1000);
      res.setHeader("Retry-After", String(retryAfterSec));
      return sendJson(res, 429, "Too many requests");
    }

    if (t - entry.firstAt > windowMs) {
      entry.count = 0;
      entry.firstAt = t;
      entry.blockedUntil = 0;
    }

    entry.count += 1;
    if (entry.count > max) {
      entry.blockedUntil = t + blockMs;
      const retryAfterSec = Math.ceil(blockMs / 1000);
      res.setHeader("Retry-After", String(retryAfterSec));
      attempts.set(key, entry);
      return sendJson(res, 429, "Too many requests");
    }

    attempts.set(key, entry);
    return next();
  };
}

/**
 * Login limiter (SECURITY-UNIFORM).
 * IMPORTANT: Never reveals rate limiting in message body.
 * Always returns 401 + "Invalid credentials" when blocked.
 *
 * @param {{ windowMs?: number, max?: number, blockMs?: number }} opts
 */
function createLoginRateLimit(opts = {}) {
  const windowMs = opts.windowMs ?? 15 * 60 * 1000;
  const max = opts.max ?? 5;
  const blockMs = opts.blockMs ?? 15 * 60 * 1000;

  return (req, res, next) => {
    const key = `login:${getKey(req)}`;
    const entry = attempts.get(key) || { count: 0, firstAt: nowMs(), blockedUntil: 0 };
    const t = nowMs();

    if (entry.blockedUntil && t < entry.blockedUntil) {
      const retryAfterSec = Math.ceil((entry.blockedUntil - t) / 1000);
      res.setHeader("Retry-After", String(retryAfterSec));
      return sendJson(res, 401, "Invalid credentials");
    }

    if (t - entry.firstAt > windowMs) {
      entry.count = 0;
      entry.firstAt = t;
      entry.blockedUntil = 0;
    }

    entry.count += 1;
    if (entry.count > max) {
      entry.blockedUntil = t + blockMs;
      const retryAfterSec = Math.ceil(blockMs / 1000);
      res.setHeader("Retry-After", String(retryAfterSec));
      attempts.set(key, entry);
      return sendJson(res, 401, "Invalid credentials");
    }

    attempts.set(key, entry);
    return next();
  };
}

// Keep your existing export name for compatibility:
export const authRateLimit = createRateLimit({ max: 60 });

// NEW: use this for /login
export const loginRateLimit = createLoginRateLimit({ max: 5 });
// Standard API rate limit (general endpoints)
export const apiRateLimit = rateLimitLib({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many requests. Please try again in a minute.",
  },
});

// NOTE: authRateLimit is exported above (line 143) using createRateLimit
// The loginRateLimit (line 146) handles strict brute-force protection for /login

// AI chat rate limit (expensive operations)
export const aiRateLimit = rateLimitLib({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "You're sending messages too quickly. Please slow down.",
  },
});

// Sensitive operations rate limit (password reset, account changes)
export const sensitiveRateLimit = rateLimitLib({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many sensitive operations. Please try again later.",
  },
});

// Mirror endpoint rate limit (gentle, reflective journaling)
export const mirrorRateLimit = rateLimitLib({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "You're reflecting quickly. Take a moment to breathe, then try again.",
  },
});

export default apiRateLimit;
