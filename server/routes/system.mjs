import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

let _5xxCount = 0;
let _4xxCount = 0;
let _totalRequests = 0;
const _history = [];
const MAX_HISTORY = 120;
const SNAPSHOT_INTERVAL_MS = 60_000;

function recordSnapshot() {
  const mem = process.memoryUsage();
  _history.push({
    timestamp: new Date().toISOString(),
    requests: _totalRequests,
    errors5xx: _5xxCount,
    errors4xx: _4xxCount,
    heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
    rssMB: Math.round(mem.rss / 1024 / 1024),
  });
  if (_history.length > MAX_HISTORY) _history.shift();
}

setInterval(recordSnapshot, SNAPSHOT_INTERVAL_MS);
recordSnapshot();

export function trackResponse(statusCode) {
  _totalRequests++;
  if (statusCode >= 500) _5xxCount++;
  else if (statusCode >= 400) _4xxCount++;
}

router.get("/", (_req, res) => {
  const mem = process.memoryUsage();
  const uptimeSec = Math.floor(process.uptime());
  res.json({
    totalRequests: _totalRequests,
    errors5xx: _5xxCount,
    errors4xx: _4xxCount,
    errorRate5xx: _totalRequests > 0 ? ((_5xxCount / _totalRequests) * 100).toFixed(2) + "%" : "0%",
    errorRate4xx: _totalRequests > 0 ? ((_4xxCount / _totalRequests) * 100).toFixed(2) + "%" : "0%",
    uptime: uptimeSec,
    memory: {
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
      rssMB: Math.round(mem.rss / 1024 / 1024),
    },
    node: process.version,
    timestamp: new Date().toISOString(),
  });
});

router.get("/history", requireAuth, requireAdmin, (_req, res) => {
  res.json({
    snapshots: _history,
    interval: SNAPSHOT_INTERVAL_MS,
    maxRetained: MAX_HISTORY,
  });
});

export default router;
