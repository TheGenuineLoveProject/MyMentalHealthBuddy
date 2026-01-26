// server/routes/metrics.mjs
// Prometheus-compatible metrics endpoint

import express from "express";
import os from "os";

const router = express.Router();

const metrics = {
  requests: { total: 0, byStatus: {}, byPath: {} },
  responseTime: { sum: 0, count: 0, max: 0 },
  memory: {},
  uptime: Date.now(),
  errors: { total: 0, byType: {} },
};

export function recordRequest(path, status, duration) {
  metrics.requests.total++;
  metrics.requests.byStatus[status] = (metrics.requests.byStatus[status] || 0) + 1;
  
  const normalizedPath = path.split("?")[0].replace(/\/\d+/g, "/:id");
  metrics.requests.byPath[normalizedPath] = (metrics.requests.byPath[normalizedPath] || 0) + 1;
  
  metrics.responseTime.sum += duration;
  metrics.responseTime.count++;
  metrics.responseTime.max = Math.max(metrics.responseTime.max, duration);
}

export function recordError(type) {
  metrics.errors.total++;
  metrics.errors.byType[type] = (metrics.errors.byType[type] || 0) + 1;
}

function getMemoryMetrics() {
  const used = process.memoryUsage();
  return {
    heapUsed: Math.round(used.heapUsed / 1024 / 1024),
    heapTotal: Math.round(used.heapTotal / 1024 / 1024),
    external: Math.round(used.external / 1024 / 1024),
    rss: Math.round(used.rss / 1024 / 1024),
  };
}

function formatPrometheusMetrics() {
  const lines = [];
  const memory = getMemoryMetrics();
  const uptimeSeconds = Math.floor((Date.now() - metrics.uptime) / 1000);
  const avgResponseTime = metrics.responseTime.count > 0 
    ? Math.round(metrics.responseTime.sum / metrics.responseTime.count) 
    : 0;

  lines.push("# HELP http_requests_total Total HTTP requests");
  lines.push("# TYPE http_requests_total counter");
  lines.push(`http_requests_total ${metrics.requests.total}`);

  lines.push("# HELP http_requests_by_status HTTP requests by status code");
  lines.push("# TYPE http_requests_by_status counter");
  for (const [status, count] of Object.entries(metrics.requests.byStatus)) {
    lines.push(`http_requests_by_status{status="${status}"} ${count}`);
  }

  lines.push("# HELP http_response_time_ms_avg Average response time in milliseconds");
  lines.push("# TYPE http_response_time_ms_avg gauge");
  lines.push(`http_response_time_ms_avg ${avgResponseTime}`);

  lines.push("# HELP http_response_time_ms_max Maximum response time in milliseconds");
  lines.push("# TYPE http_response_time_ms_max gauge");
  lines.push(`http_response_time_ms_max ${metrics.responseTime.max}`);

  lines.push("# HELP process_memory_heap_mb Heap memory used in MB");
  lines.push("# TYPE process_memory_heap_mb gauge");
  lines.push(`process_memory_heap_mb ${memory.heapUsed}`);

  lines.push("# HELP process_memory_rss_mb RSS memory in MB");
  lines.push("# TYPE process_memory_rss_mb gauge");
  lines.push(`process_memory_rss_mb ${memory.rss}`);

  lines.push("# HELP process_uptime_seconds Process uptime in seconds");
  lines.push("# TYPE process_uptime_seconds counter");
  lines.push(`process_uptime_seconds ${uptimeSeconds}`);

  lines.push("# HELP errors_total Total errors");
  lines.push("# TYPE errors_total counter");
  lines.push(`errors_total ${metrics.errors.total}`);

  lines.push("# HELP nodejs_cpu_count Number of CPUs");
  lines.push("# TYPE nodejs_cpu_count gauge");
  lines.push(`nodejs_cpu_count ${os.cpus().length}`);

  return lines.join("\n");
}

router.get("/", (_req, res) => {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(formatPrometheusMetrics());
});

router.get("/json", (_req, res) => {
  const memory = getMemoryMetrics();
  const uptimeSeconds = Math.floor((Date.now() - metrics.uptime) / 1000);
  
  res.json({
    ok: true,
    data: {
      requests: metrics.requests,
      responseTime: {
        avg: metrics.responseTime.count > 0 
          ? Math.round(metrics.responseTime.sum / metrics.responseTime.count) 
          : 0,
        max: metrics.responseTime.max,
        count: metrics.responseTime.count,
      },
      memory,
      uptime: uptimeSeconds,
      errors: metrics.errors,
      system: {
        cpus: os.cpus().length,
        platform: os.platform(),
        nodeVersion: process.version,
      },
    },
  });
});

export default router;
