// server/middleware/requestId.mjs
// Request ID and structured logging middleware

import { randomUUID } from "node:crypto";

// Assigns a unique request ID to each request
export function requestId(req, res, next) {
  const existingId = req.headers["x-request-id"];
  const id = typeof existingId === "string" && existingId.trim() !== ""
    ? existingId
    : randomUUID();

  req.requestId = id;
  res.setHeader("X-Request-Id", id);

  next();
}

// Structured logging helper
export function structuredLog(level, message, meta = {}) {
  const timestamp = new Date().toISOString();

  const logEntry = {
    timestamp,
    level,
    message,
    ...meta,
  };

  if (process.env.NODE_ENV === "production") {
    console.log(JSON.stringify(logEntry));
    return;
  }

  const levelColors = {
    error: "\x1b[31m",
    warn: "\x1b[33m",
    info: "\x1b[36m",
    debug: "\x1b[35m",
  };

  const reset = "\x1b[0m";
  const color = levelColors[level] || "";
  
  const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : "";
  console.log(`${color}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}`, metaStr);
}

// Logger helpers with request context
export const logger = {
  error: (message, meta = {}) => structuredLog("error", message, meta),
  warn: (message, meta = {}) => structuredLog("warn", message, meta),
  info: (message, meta = {}) => structuredLog("info", message, meta),
  debug: (message, meta = {}) => structuredLog("debug", message, meta),
};

// Request logging middleware with correlation ID
export function requestLogger(req, res, next) {
  const startTime = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logData = {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers["user-agent"]?.substring(0, 100),
    };

    if (res.statusCode >= 500) {
      logger.error("Request failed", logData);
    } else if (res.statusCode >= 400) {
      logger.warn("Request error", logData);
    } else {
      logger.info("Request completed", logData);
    }
  });

  next();
}
