// =====================================================
// FILE: server/middleware/loginRateLimit.mjs
// =====================================================
import { sendUniformAuthFailure } from "../lib/authErrors.mjs";

/**
 * Minimal in-memory rate limiter (per-IP).
 * Keeps enforcement but does not reveal rate-limit state in response body.
 *
 * NOTE: For production, replace with Redis-backed limiter.
 */
const attempts = new Map(); // ip -> { count, firstAt, blockedUntil }

function nowMs() {
  return Date.now();
}

/**
 * @param {{ windowMs?: number, max?: number, blockMs?: number }} opts
 */
export function loginRateLimit(opts = {}) {
  const windowMs = opts.windowMs ?? 15 * 60 * 1000;
  const max = opts.max ?? 5;
  const blockMs = opts.blockMs ?? 15 * 60 * 1000;

  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const entry = attempts.get(ip) || { count: 0, firstAt: nowMs(), blockedUntil: 0 };
    const t = nowMs();

    if (entry.blockedUntil && t < entry.blockedUntil) {
      const retryAfterSec = Math.ceil((entry.blockedUntil - t) / 1000);
      res.setHeader("Retry-After", String(retryAfterSec));
      return sendUniformAuthFailure(res, 401);
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
      attempts.set(ip, entry);
      return sendUniformAuthFailure(res, 401);
    }

    attempts.set(ip, entry);
    return next();
  };
}