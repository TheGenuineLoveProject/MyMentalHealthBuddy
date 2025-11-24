// server/middleware/rateLimiter.mjs

import rateLimit from "express-rate-limit";

/**
 * General API limiter
 * Limits how many requests a single IP can send to /api in 15 minutes.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 100,                   // 100 requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again later.",
  },
});

/**
 * Expensive AI endpoints limiter
 * Use for routes that call OpenAI or other costly services.
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,        // 1 minute
  max: 10,                    // 10 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many AI requests. Please slow down.",
  },
});

/**
 * Auth limiter
 * Prevents brute-force login attempts.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 5,                     // 5 failed attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    error: "Too many login attempts. Please try again in 15 minutes.",
  },
});

/**
 * Webhook limiter (Stripe)
 * Webhooks can come in bursts, so we allow more here.
 */
export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,        // 1 minute
  max: 100,                   // 100 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many webhook requests.",
  },
});