// /server/middleware/rateLimiter.mjs
// Replit-safe, duplicate-free rate limiter

import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests. Please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
});

export default apiLimiter;