// server/utils/logger.mjs
// Unified structured logger for the entire application

const levelWeights = { debug: 10, info: 20, warn: 30, error: 40 };
const currentLevel = levelWeights[process.env.LOG_LEVEL] ?? levelWeights.info;

const levelColors = {
  error: "\x1b[31m",
  warn: "\x1b[33m",
  info: "\x1b[36m",
  debug: "\x1b[35m",
};
const reset = "\x1b[0m";

function log(level, message, meta = {}) {
  if ((levelWeights[level] ?? 100) < currentLevel) return;
  
  const timestamp = new Date().toISOString();
  const payload = { level, message, ...meta, timestamp };

  const logFn = level === "error" ? console.error : level === "warn" ? console.warn : console.log;

  if (process.env.NODE_ENV === "production") {
    logFn(JSON.stringify(payload));
  } else {
    const color = levelColors[level] || "";
    const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : "";
    logFn(`${color}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}`, metaStr);
  }
}

export const logger = {
  debug: (message, meta) => log("debug", message, meta),
  info: (message, meta) => log("info", message, meta),
  warn: (message, meta) => log("warn", message, meta),
  error: (message, meta) => log("error", message, meta),
};

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    log("info", `${req.method} ${req.path}`, {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: duration,
      requestId: req.id,
    });
  });
  next();
};
