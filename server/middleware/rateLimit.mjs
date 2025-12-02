// server/middleware/rateLimit.mjs
// Enhanced rate limiting with per-route configurations

import rateLimitLib from "express-rate-limit";

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
