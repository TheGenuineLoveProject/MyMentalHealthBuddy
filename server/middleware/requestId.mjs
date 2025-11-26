// Assigns a unique request ID to each request.
import { randomUUID } from "crypto";

export function requestIdMiddleware(req, res, next) {
  // Always check header in lowercase form
  const requestId = req.headers["x-request-id"] || randomUUID();

  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);

  next();
}

// Pretty structured logging helper.
export function structuredLog(level, message, meta = {}) {
  const timestamp = new Date().toISOString();

  const logEntry = {
    timestamp,
    level,
    message,
    meta
  };

  // In production: clean JSON logs (no-colors)
  if (process.env.NODE_ENV === "production") {
    console.log(JSON.stringify(logEntry));
    return; }

  // Dev-color scheme
  const levelColors = {
    error: "\x1b[31m",   // red
    warn: "\x1b[33m",    // yellow
    info: "\x1b[36m",    // cyan
    debug: "\x1b[35m"    // magenta
  };

  const reset = "\x1b[0m";

  const color = levelColors[level] || "";
  console.log(`${color}${level.toUpperCase()}${reset} - ${timestamp} - ${message}`, meta);
}

// Exported logger helpers
export const logger = {
  error: (message, meta = {}) => structuredLog("error", message, meta),
  warn: (message, meta = {}) => structuredLog("warn", message, meta),
  info: (message, meta = {}) => structuredLog("info", message, meta),
  debug: (message, meta = {}) => structuredLog("debug", message, meta)
};