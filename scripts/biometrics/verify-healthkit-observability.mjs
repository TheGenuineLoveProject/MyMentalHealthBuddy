const BASE_URL = process.env.HEALTHKIT_VERIFY_BASE_URL || "http://localhost:5000";

const requiredJsonKeys = [
  "webhooksTotal",
  "signatureFailuresTotal",
  "replaysTotal",
  "invalidPayloadTotal",
  "invalidSamplesTotal",
  "tooManySamplesTotal",
  "samplesIngestedTotal",
  "samplesRejectedTotal",
  "processingLatencyMs",
  "lastSuccessTimestamp",
];

const requiredPrometheusMetrics = [
  "healthkit_webhooks_total",
  "healthkit_signature_failures_total",
  "healthkit_replays_total",
  "healthkit_invalid_payload_total",
  "healthkit_invalid_samples_total",
  "healthkit_too_many_samples_total",
  "healthkit_samples_ingested_total",
  "healthkit_samples_rejected_total",
  "healthkit_processing_latency_ms_avg",
  "healthkit_processing_latency_ms_max",
];

async function fetchText(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${path} returned HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  return { res, text };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const checks = [];

try {
  const { text } = await fetchText("/api/metrics/json");
  const parsed = JSON.parse(text);
  const healthkit = parsed?.data?.healthkit;

  assert(healthkit && typeof healthkit === "object", "missing data.healthkit object");

  for (const key of requiredJsonKeys) {
    assert(Object.prototype.hasOwnProperty.call(healthkit, key), `missing healthkit JSON key: ${key}`);
  }

  assert(
    healthkit.processingLatencyMs &&
      typeof healthkit.processingLatencyMs === "object" &&
      ["sum", "count", "max"].every((k) => Object.prototype.hasOwnProperty.call(healthkit.processingLatencyMs, k)),
    "missing processingLatencyMs sum/count/max",
  );

  checks.push(["metrics json healthkit shape", true]);
} catch (err) {
  checks.push(["metrics json healthkit shape", false, err]);
}

try {
  const { text } = await fetchText("/api/metrics");

  for (const metric of requiredPrometheusMetrics) {
    assert(text.includes(metric), `missing Prometheus metric: ${metric}`);
  }

  checks.push(["metrics prometheus healthkit shape", true]);
} catch (err) {
  checks.push(["metrics prometheus healthkit shape", false, err]);
}

const failed = checks.filter(([, ok]) => !ok);

for (const [name, ok, err] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${err ? ` — ${err.message}` : ""}`);
}

if (failed.length) {
  console.error("HEALTHKIT_OBSERVABILITY_VERIFY_FAIL");
  process.exit(1);
}

console.log("HEALTHKIT_OBSERVABILITY_VERIFY_PASS");
