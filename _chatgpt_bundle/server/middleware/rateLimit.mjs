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

// Strict rate limit for authentication endpoints (prevent brute force)
export const authRateLimit = rateLimitLib({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: {
    ok: false,
    message: "Too many login attempts. Please wait 15 minutes before trying again.",
  },
});

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

export default apiRateLimit;
