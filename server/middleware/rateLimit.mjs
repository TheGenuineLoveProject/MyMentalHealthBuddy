// server/middleware/rateLimit.mjs
// Simple in-memory rate limiter for MyMentalHealthBuddy API.
// Keeps it gentle but protective for Replit free tier.

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 120; // per IP per minute

// Map: ip -> { count, windowStart }
const buckets = new Map();

/**
 * Express middleware to rate limit requests by IP.
 * Very lightweight, no external deps.
 */
export function rateLimit(req, res, next) {
  try {
    const now = Date.now();
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
      req.socket?.remoteAddress ||
      "unknown";

    let bucket = buckets.get(ip);

    // If no bucket or window expired, reset
    if (!bucket || now - bucket.windowStart > WINDOW_MS) {
      bucket = { count: 0, windowStart: now };
    }

    bucket.count += 1;
    buckets.set(ip, bucket);

    if (bucket.count > MAX_REQUESTS_PER_WINDOW) {
      // Too many requests – respond with 429
      return res.status(429).json({
        ok: false,
        error: "Too many requests. Please slow down a little.",
        meta: {
          windowMs: WINDOW_MS,
          limit: MAX_REQUESTS_PER_WINDOW,
        },
      });
    }

    // Attach some debug info for logs if needed
    req.rateLimitInfo = {
      ip,
      count: bucket.count,
      windowStart: bucket.windowStart,
    };

    return next();
  } catch (err) {
    // If limiter fails, never fully block – just log and continue
    console.error("Rate limiter error:", err);
    return next();
  }
}