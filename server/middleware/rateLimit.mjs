// server/middleware/rateLimit.mjs
// Unified rate limiting with:
// - apiRateLimit (429 generic)
// - authRateLimit (429 generic for register, etc.)
// - loginRateLimit (401 + "Invalid credentials" ALWAYS when blocked; security-uniform)

import rateLimit from "express-rate-limit";
import { logger } from "../utils/logger.mjs";

const attempts = new Map(); // key -> { count, firstAt, blockedUntil }

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_MAP_SIZE = 10000;

function cleanupExpiredEntries() {
  const now = Date.now();
  let cleaned = 0;
  for (const [key, entry] of attempts) {
    const windowExpired = now - entry.firstAt > 30 * 60 * 1000;
    const blockExpired = entry.blockedUntil && now > entry.blockedUntil;
    if (windowExpired && (!entry.blockedUntil || blockExpired)) {
      attempts.delete(key);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    try { logger.info("Rate limiter cleanup", { cleaned, remaining: attempts.size }); } catch {}
  }
}

setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL_MS).unref();

function nowMs() {
  return Date.now();
}

function getClientKey(req) {
  const xf = req.headers["x-forwarded-for"];
  const ip = Array.isArray(xf) ? xf[0] : xf;
  return (ip || req.ip || "unknown").toString();
}

/**
 * @param {import("express").Response} res
 * @param {number} status
 * @param {string} message
 */
function sendJson(res, status, message) {
  return res.status(status).json({ message });
}

/**
 * In-memory limiter factory.
 * @param {{ windowMs?: number, max?: number, blockMs?: number, prefix?: string, status?: number, message?: string }} opts
 */
function createInMemoryLimiter(opts = {}) {
  const windowMs = opts.windowMs ?? 15 * 60 * 1000;
  const max = opts.max ?? 30;
  const blockMs = opts.blockMs ?? 15 * 60 * 1000;
  const prefix = opts.prefix ?? "rl";
  const status = opts.status ?? 429;
  const message = opts.message ?? "Too many requests";

  return (req, res, next) => {
    if (req.path === "/api/health") return next();

    if (attempts.size > MAX_MAP_SIZE) {
      cleanupExpiredEntries();
    }

    const key = `${prefix}:${getClientKey(req)}`;
    const entry = attempts.get(key) || { count: 0, firstAt: nowMs(), blockedUntil: 0 };
    const t = nowMs();

    if (entry.blockedUntil && t < entry.blockedUntil) {
      const retryAfterSec = Math.ceil((entry.blockedUntil - t) / 1000);
      res.setHeader("Retry-After", String(retryAfterSec));
      return sendJson(res, status, message);
    }

    if (t - entry.firstAt > windowMs) {
      entry.count = 0;
      entry.firstAt = t;
      entry.blockedUntil = 0;
    }

    entry.count += 1;

    if (entry.count > max) {
      entry.blockedUntil = t + blockMs;
      const retryAfterSec = Math.ceil(blockMs / 1000);
      res.setHeader("Retry-After", String(retryAfterSec));
      attempts.set(key, entry);
      return sendJson(res, status, message);
    }

    attempts.set(key, entry);
    return next();
  };
}

/**
 * API rate limit (generic) - 429 + message.
 */
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many requests. Please try again in a minute.",
  },
});

/**
 * Auth rate limit (generic) - for register / refresh if desired.
 * Returns 429 and can be descriptive (not used for login to avoid leaking).
 * Higher limits for test environment.
 */
const isTestEnv = process.env.NODE_ENV === "test" || process.env.VITEST === "true";
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTestEnv ? 500 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many requests. Please try again later.",
  },
});

/**
 * Login rate limit (SECURITY-UNIFORM).
 * IMPORTANT: Never reveals rate limiting in message body.
 * When blocked, always returns 401 + "Invalid credentials"
 * (matches your tests expecting uniform auth errors).
 *
 * Uses in-memory limiter to fully control response shape/status.
 */
export const loginRateLimit = createInMemoryLimiter({
  prefix: "login",
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 100 : 10, // Higher limit for tests
  blockMs: 15 * 60 * 1000,
  status: 401,
  message: "Invalid credentials",
});

/**
 * Optional: expensive operations (AI chat etc.)
 */
export const aiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "You're sending messages too quickly. Please slow down.",
  },
});

/**
 * Optional: sensitive operations (password reset/account changes)
 */
export const sensitiveRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many sensitive operations. Please try again later.",
  },
});

/**
 * Optional: gentle journaling endpoint rate limit
 */
export const mirrorRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "You're reflecting quickly. Take a moment to breathe, then try again.",
  },
});

export default apiRateLimit;