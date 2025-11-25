import { randomUUID } from "crypto";

export function requestIdMiddleware(req, res, next) {
  const requestId = req.headers["x-request-id"] || randomUUID();
  
  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);
  
  next();
}

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
  } else {
    const levelColors = {
      error: "\x1b[31m",
      warn: "\x1b[33m",
      info: "\x1b[36m",
      debug: "\x1b[90m",
    };
    const reset = "\x1b[0m";
    const color = levelColors[level] || "";
    console.log(`${color}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}`, meta);
  }
}

export const logger = {
  error: (message, meta) => structuredLog("error", message, meta),
  warn: (message, meta) => structuredLog("warn", message, meta),
  info: (message, meta) => structuredLog("info", message, meta),
  debug: (message, meta) => structuredLog("debug", message, meta),
};
