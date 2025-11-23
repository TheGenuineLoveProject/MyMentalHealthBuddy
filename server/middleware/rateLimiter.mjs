import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests.",
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many AI requests.",
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});
