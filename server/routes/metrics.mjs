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
  healthkit: {
    webhooksTotal: 0,
    signatureFailuresTotal: 0,
    replaysTotal: 0,
    invalidPayloadTotal: 0,
    invalidSamplesTotal: 0,
    tooManySamplesTotal: 0,
    samplesIngestedTotal: 0,
    samplesRejectedTotal: 0,
    processingLatencyMs: { sum: 0, count: 0, max: 0 },
    lastSuccessTimestamp: null,
  },
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

export function recordHealthKitWebhook(event = {}) {
  metrics.healthkit.webhooksTotal++;

  if (event.signatureFailure) metrics.healthkit.signatureFailuresTotal++;
  if (event.replay) metrics.healthkit.replaysTotal++;
  if (event.invalidPayload) metrics.healthkit.invalidPayloadTotal++;
  if (event.invalidSamples) metrics.healthkit.invalidSamplesTotal++;
  if (event.tooManySamples) metrics.healthkit.tooManySamplesTotal++;

  const ingested = Number(event.samplesIngested || 0);
  const rejected = Number(event.samplesRejected || 0);
  if (Number.isFinite(ingested) && ingested > 0) metrics.healthkit.samplesIngestedTotal += ingested;
  if (Number.isFinite(rejected) && rejected > 0) metrics.healthkit.samplesRejectedTotal += rejected;

  const latency = Number(event.processingLatencyMs);
  if (Number.isFinite(latency) && latency >= 0) {
    metrics.healthkit.processingLatencyMs.sum += latency;
    metrics.healthkit.processingLatencyMs.count++;
    metrics.healthkit.processingLatencyMs.max = Math.max(metrics.healthkit.processingLatencyMs.max, latency);
  }

  if (event.success) {
    metrics.healthkit.lastSuccessTimestamp = new Date().toISOString();
  }
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

  const hk = metrics.healthkit;
  const hkAvgLatency = hk.processingLatencyMs.count > 0
    ? Math.round(hk.processingLatencyMs.sum / hk.processingLatencyMs.count)
    : 0;

  lines.push("# HELP healthkit_webhooks_total Total HealthKit webhook attempts");
  lines.push("# TYPE healthkit_webhooks_total counter");
  lines.push(`healthkit_webhooks_total ${hk.webhooksTotal}`);

  lines.push("# HELP healthkit_signature_failures_total Total HealthKit signature failures");
  lines.push("# TYPE healthkit_signature_failures_total counter");
  lines.push(`healthkit_signature_failures_total ${hk.signatureFailuresTotal}`);

  lines.push("# HELP healthkit_replays_total Total HealthKit replay attempts");
  lines.push("# TYPE healthkit_replays_total counter");
  lines.push(`healthkit_replays_total ${hk.replaysTotal}`);

  lines.push("# HELP healthkit_invalid_payload_total Total invalid HealthKit payloads");
  lines.push("# TYPE healthkit_invalid_payload_total counter");
  lines.push(`healthkit_invalid_payload_total ${hk.invalidPayloadTotal}`);

  lines.push("# HELP healthkit_invalid_samples_total Total invalid HealthKit samples arrays");
  lines.push("# TYPE healthkit_invalid_samples_total counter");
  lines.push(`healthkit_invalid_samples_total ${hk.invalidSamplesTotal}`);

  lines.push("# HELP healthkit_too_many_samples_total Total HealthKit oversized sample batches");
  lines.push("# TYPE healthkit_too_many_samples_total counter");
  lines.push(`healthkit_too_many_samples_total ${hk.tooManySamplesTotal}`);

  lines.push("# HELP healthkit_samples_ingested_total Total HealthKit samples ingested");
  lines.push("# TYPE healthkit_samples_ingested_total counter");
  lines.push(`healthkit_samples_ingested_total ${hk.samplesIngestedTotal}`);

  lines.push("# HELP healthkit_samples_rejected_total Total HealthKit samples rejected");
  lines.push("# TYPE healthkit_samples_rejected_total counter");
  lines.push(`healthkit_samples_rejected_total ${hk.samplesRejectedTotal}`);

  lines.push("# HELP healthkit_processing_latency_ms_avg Average HealthKit webhook processing latency");
  lines.push("# TYPE healthkit_processing_latency_ms_avg gauge");
  lines.push(`healthkit_processing_latency_ms_avg ${hkAvgLatency}`);

  lines.push("# HELP healthkit_processing_latency_ms_max Maximum HealthKit webhook processing latency");
  lines.push("# TYPE healthkit_processing_latency_ms_max gauge");
  lines.push(`healthkit_processing_latency_ms_max ${hk.processingLatencyMs.max}`);

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
      healthkit: metrics.healthkit,
      system: {
        cpus: os.cpus().length,
        platform: os.platform(),
        nodeVersion: process.version,
      },
    },
  });
});

export default router;
