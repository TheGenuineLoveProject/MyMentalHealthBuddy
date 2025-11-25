// server/middleware/rateLimiter.mjs
import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || req.headers['x-forwarded-for'] || 'unknown',
  message: {
    ok: false,
    error: "Too many requests. Please try again later.",
    retryAfter: 15 * 60
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => req.ip || req.headers['x-forwarded-for'] || 'unknown',
  message: {
    ok: false,
    error: "Too many login attempts. Please try again in 15 minutes.",
    retryAfter: 15 * 60
  }
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user?.id) return `user:${req.user.id}`;
    return req.ip || req.headers['x-forwarded-for'] || 'unknown';
  },
  message: {
    ok: false,
    error: "You're sending messages too quickly. Please slow down.",
    retryAfter: 60
  }
});

export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    error: "Rate limit exceeded. Please try again in an hour.",
    retryAfter: 60 * 60
  }
});

export const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    error: "Too many write operations. Please slow down.",
    retryAfter: 60
  }
});
