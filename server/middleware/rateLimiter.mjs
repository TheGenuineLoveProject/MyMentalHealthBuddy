import rateLimit from "express-rate-limit";

// General API limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests.",
});

// AI-related limiter
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many AI requests.",
});

// Auth limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many auth attempts.",
});

// ⚠️ THIS WAS MISSING — REQUIRED BY YOUR SERVER
export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many webhook requests.",
});