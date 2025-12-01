// server/middleware/rateLimit.mjs
// Unified rate limiter for the whole API
// Uses express-rate-limit v7 (ESM compatible)

// 1) Import the library
import rateLimitLib from "express-rate-limit";

// 2) Create a single limiter instance
const apiRateLimit = rateLimitLib({
  windowMs: 60 * 1000, // 1 minute
  max: 120,            // 120 requests / minute / IP
  standardHeaders: true,
  legacyHeaders: false,
});

// 3) Export as BOTH default + named so ALL imports work
export default apiRateLimit;
export { apiRateLimit };