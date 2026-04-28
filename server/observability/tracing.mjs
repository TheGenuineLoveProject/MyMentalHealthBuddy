// server/observability/tracing.mjs
// ---------------------------------------------------------------------------
// OpenTelemetry tracing — Week 2 Foundation Sprint.
// Loaded BEFORE any other module via `--import ./server/observability/preload.mjs`
// in the workflow / deployment run command, so auto-instrumentations attach
// to express, http, pg, and fetch as those modules load.
//
// Behaviour matrix:
//   • OTEL_DISABLED=true            → SDK is not started at all (escape hatch)
//   • OTEL_EXPORTER_OTLP_ENDPOINT   → OTLP/HTTP exporter is configured to that
//                                     endpoint (e.g. https://otlp.example/v1/traces)
//   • neither set                   → SDK still starts but uses a no-op exporter,
//                                     so spans are created (req.spanContext is
//                                     populated, headers propagate) without
//                                     incurring any network or disk cost.
//
// We intentionally do NOT log spans to stdout in dev — the existing structured
// logger already records every request and would double the noise. Operators
// inspect spans via the OTLP backend (Honeycomb / Tempo / Jaeger / etc.).
// ---------------------------------------------------------------------------

import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
} from "@opentelemetry/semantic-conventions";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";

const SERVICE_NAME = process.env.OTEL_SERVICE_NAME || "mymentalhealthbuddy";
const SERVICE_VERSION = process.env.npm_package_version || "1.0.0";
const ENVIRONMENT =
  process.env.OTEL_DEPLOYMENT_ENVIRONMENT ||
  process.env.NODE_ENV ||
  "development";

// Operator-visible state — read by /api/admin/observability/tracing.
const state = {
  enabled: false,
  reason: "not-initialized",
  exporter: "none",
  endpoint: null,
  serviceName: SERVICE_NAME,
  serviceVersion: SERVICE_VERSION,
  environment: ENVIRONMENT,
  startedAt: null,
  errors: [],
};

let sdkInstance = null;

function recordError(err) {
  const msg = err?.message || String(err);
  state.errors.push({ at: new Date().toISOString(), error: msg });
  if (state.errors.length > 20) state.errors.shift();
}

export function startTracing() {
  // Wrap the ENTIRE body so any sync throw (exporter ctor, env parsing, SDK
  // ctor, etc.) is captured and downgraded to a logged warning — observability
  // must never abort process boot. Async failures from sdkInstance.start()
  // are also captured below.
  try {
    if (sdkInstance) return state;

    if (process.env.OTEL_DISABLED === "true") {
      state.reason = "OTEL_DISABLED=true";
      return state;
    }

    // Quiet OTel internal diagnostics unless OTEL_LOG_LEVEL is explicitly set.
    // Default to ERROR so a missing exporter doesn't flood the console.
    const otelLogLevel = (process.env.OTEL_LOG_LEVEL || "ERROR").toUpperCase();
    if (DiagLogLevel[otelLogLevel] != null) {
      diag.setLogger(new DiagConsoleLogger(), DiagLogLevel[otelLogLevel]);
    }

    const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || null;
    let traceExporter;
    if (otlpEndpoint) {
      traceExporter = new OTLPTraceExporter({
        url: otlpEndpoint.endsWith("/v1/traces")
          ? otlpEndpoint
          : `${otlpEndpoint.replace(/\/$/, "")}/v1/traces`,
        headers: parseHeaders(process.env.OTEL_EXPORTER_OTLP_HEADERS),
      });
    } else {
      // No endpoint configured — disable exporters entirely so the SDK doesn't
      // try its default OTLP/HTTP target (127.0.0.1:4318) and spam ECONNREFUSED.
      // Spans are still created (req.spanContext is populated, headers propagate)
      // — they just aren't exported anywhere.
      process.env.OTEL_TRACES_EXPORTER = process.env.OTEL_TRACES_EXPORTER || "none";
      traceExporter = undefined;
    }

    state.exporter = traceExporter ? "otlp-http" : "none";
    state.endpoint = otlpEndpoint;

    sdkInstance = new NodeSDK({
      resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: SERVICE_NAME,
        [ATTR_SERVICE_VERSION]: SERVICE_VERSION,
        [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: ENVIRONMENT,
      }),
      ...(traceExporter ? { traceExporter } : {}),
      // Auto-instrumentations: http, express, pg, fetch, dns, net, and more.
      // We disable fs (extremely noisy) and net (low value, high cardinality).
      instrumentations: [
        getNodeAutoInstrumentations({
          "@opentelemetry/instrumentation-fs": { enabled: false },
          "@opentelemetry/instrumentation-net": { enabled: false },
          // Express auto-instrumentation honours these path filters.
          "@opentelemetry/instrumentation-http": {
            ignoreIncomingRequestHook: (req) => {
              const url = req.url || "";
              // Drop health probe noise — these run every few seconds.
              return (
                url === "/health" ||
                url === "/ready" ||
                url === "/api/health" ||
                url.startsWith("/__replco")
              );
            },
          },
        }),
      ],
    });

    // sdkInstance.start() in @opentelemetry/sdk-node is currently synchronous
    // (returns void), but we defensively guard against future versions that
    // could return a Promise. We DO NOT mark enabled=true until we're sure no
    // async error occurred — better to underclaim than to lie about health.
    let asyncFailed = false;
    const startResult = sdkInstance.start();
    if (startResult && typeof startResult.then === "function") {
      startResult.catch((err) => {
        asyncFailed = true;
        state.enabled = false;
        state.reason = `async-start-failed: ${err?.message || err}`;
        recordError(err);
        console.warn("[otel] async SDK start failed:", err?.message || err);
      });
    }

    if (!asyncFailed) {
      state.enabled = true;
      state.reason = "started";
      state.startedAt = new Date().toISOString();
      console.log(
        `[otel] tracing started — service=${SERVICE_NAME} env=${ENVIRONMENT} exporter=${state.exporter}` +
          (otlpEndpoint ? ` endpoint=${otlpEndpoint}` : " (no OTLP endpoint configured — spans created but not exported)"),
      );
    }

    // Graceful shutdown — flush spans on SIGTERM (Replit autoscale shutdown signal).
    const shutdown = async (signal) => {
      if (!sdkInstance) return;
      try {
        await sdkInstance.shutdown();
        console.log(`[otel] tracing shutdown complete (${signal})`);
      } catch (err) {
        console.warn("[otel] shutdown error:", err?.message || err);
      }
    };
    process.once("SIGTERM", () => shutdown("SIGTERM"));
    process.once("SIGINT", () => shutdown("SIGINT"));

    return state;
  } catch (err) {
    state.enabled = false;
    state.reason = `failed: ${err?.message || err}`;
    recordError(err);
    console.warn("[otel] failed to start tracing SDK:", err?.message || err);
    return state;
  }
}

export function getTracingState() {
  return { ...state, errors: [...state.errors] };
}

function parseHeaders(headerString) {
  if (!headerString) return undefined;
  const out = {};
  for (const pair of headerString.split(",")) {
    const idx = pair.indexOf("=");
    if (idx === -1) continue;
    const k = pair.slice(0, idx).trim();
    const v = pair.slice(idx + 1).trim();
    if (k) out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}
