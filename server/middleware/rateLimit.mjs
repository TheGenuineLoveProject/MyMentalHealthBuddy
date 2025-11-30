import rateLimitLib from 'express-rate-limit';

// Create a single reusable rate limiter
export const rateLimit = rateLimitLib({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Default export (required by your server/index.mjs)
export default rateLimit;