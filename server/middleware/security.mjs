import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

export const appHelmet = helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
});

export const appCors = cors({
  origin: true,
  credentials: true
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

// Strip <script>...</script> blocks and inline event-handler attributes from
// every string field of req.body. Conservative: leaves all non-string values
// alone, never throws, never blocks the request.
function scrubString(s) {
  if (typeof s !== "string") return s;
  return s
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "");
}

function scrubDeep(value) {
  if (value == null) return value;
  if (typeof value === "string") return scrubString(value);
  if (Array.isArray(value)) return value.map(scrubDeep);
  if (typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value)) out[k] = scrubDeep(value[k]);
    return out;
  }
  return value;
}

export function sanitizeBody(req, _res, next) {
  try {
    if (req.body && typeof req.body === "object") {
      req.body = scrubDeep(req.body);
    }
  } catch {
    // never block on sanitize failure
  }
  next();
}

// Default security headers for API responses: no caching of sensitive JSON,
// disable MIME sniffing, deny framing of API responses.
export function securityHeaders(_req, res, next) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
}
