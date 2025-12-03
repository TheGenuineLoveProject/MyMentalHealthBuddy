// [MMB] Structured logger
const levelWeights = { debug: 10, info: 20, warn: 30, error: 40 };
const currentLevel = levelWeights[process.env.LOG_LEVEL] ?? levelWeights.info;

function log(level, message, meta = {}) {
  if ((levelWeights[level] ?? 100) < currentLevel) return;
  const payload = { level, message, ...meta, timestamp: new Date().toISOString() };
  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}
export const logger = {
  debug: (m, meta) => log("debug", m, meta),
  info: (m, meta) => log("info", m, meta),
  warn: (m, meta) => log("warn", m, meta),
  error: (m, meta) => log("error", m, meta)
};