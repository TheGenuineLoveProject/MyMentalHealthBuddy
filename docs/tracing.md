# Distributed Tracing Guide

## Overview

This document outlines the tracing strategy for The Genuine Love Project platform. The system is OpenTelemetry-ready and can be integrated with various observability backends.

## Current Implementation

### Request ID Tracking

Every request receives a unique ID via the `requestId` middleware:

```javascript
// server/middleware/requestId.mjs
req.requestId = req.headers["x-request-id"] || crypto.randomUUID();
```

This ID is:
- Included in all log entries
- Passed to Sentry for error correlation
- Available for downstream service calls

### Correlation Headers

When making external API calls, include the request ID:

```javascript
fetch(externalUrl, {
  headers: {
    "X-Request-Id": req.requestId,
  },
});
```

## OpenTelemetry Integration (Future)

### Setup (When Ready)

```javascript
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const provider = new NodeTracerProvider();
provider.addSpanProcessor(
  new SimpleSpanProcessor(new OTLPTraceExporter())
);
provider.register();
```

### Instrumentation Targets

1. **HTTP requests** - Incoming and outgoing
2. **Database queries** - Drizzle/PostgreSQL
3. **External APIs** - OpenAI, Stripe, Resend
4. **Cache operations** - If implemented

## Trace Context Propagation

### Between Services

```javascript
// Extract context from incoming request
const context = propagation.extract(ROOT_CONTEXT, req.headers);

// Create child span
const span = tracer.startSpan("operation-name", undefined, context);
```

### To External Services

```javascript
const headers = {};
propagation.inject(context.active(), headers);
```

## Log Correlation

All logs include `requestId` for trace correlation:

```javascript
logger.info("Operation completed", {
  requestId: req.requestId,
  operation: "journal.create",
  duration: 45,
});
```

## Recommended Backends

| Backend | Use Case | Notes |
|---------|----------|-------|
| Jaeger | Development | Local tracing |
| Honeycomb | Production | Full observability |
| Grafana Tempo | Production | OSS option |
| Datadog | Enterprise | Full APM |

## Environment Variables

```bash
# OpenTelemetry configuration
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_SERVICE_NAME=genuine-love-project
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.1
```

## Performance Considerations

- **Sampling**: Use 10% sampling in production
- **Span limits**: Max 128 attributes per span
- **Batch export**: Use batch processor in production

## Metrics to Track

| Metric | Description |
|--------|-------------|
| `http.request.duration` | Request latency |
| `db.query.duration` | Database query time |
| `external.api.duration` | External API latency |
| `error.count` | Error frequency |

## Next Steps

1. Add OpenTelemetry SDK when needed
2. Configure trace exporter for chosen backend
3. Add custom spans for critical operations
4. Set up trace-based alerts

---

## Implementation status — Week 2 Foundation Sprint (2026-04)

The "Next Steps" above are now done in the additive `server/observability/` module. Summary:

- **SDK installed**: `@opentelemetry/sdk-node` + `@opentelemetry/auto-instrumentations-node` are wired in `server/observability/tracing.mjs`.
- **Loaded via `--import`**: the workflow and deployment `run` commands both inject `NODE_OPTIONS='--import ./server/observability/preload.mjs'`, which calls `startTracing()` before Express / pg / http load. This is required for auto-instrumentation patching.
- **Exporter**: OTLP/HTTP exporter is configured if `OTEL_EXPORTER_OTLP_ENDPOINT` is set; otherwise the SDK runs with `OTEL_TRACES_EXPORTER=none` so no network traffic is generated. Spans are still created in-process so `traceparent` headers propagate to downstream services.
- **Custom spans**: not yet added. Auto-instrumentations cover http/express/pg/fetch. To add a manual span use `import { trace } from "@opentelemetry/api"; const span = trace.getTracer("mmhb").startSpan("name"); ...; span.end();`.
- **Trace-based alerts**: deferred to a backend of choice (Honeycomb / Tempo / Grafana Cloud). Wiring is endpoint-only; no SaaS lock-in.

### Operator-visible state

`GET /api/admin/observability/tracing` returns:

```json
{
  "ok": true,
  "tracing": {
    "enabled": true,
    "reason": "started",
    "exporter": "none",
    "endpoint": null,
    "serviceName": "mymentalhealthbuddy",
    "serviceVersion": "1.0.0",
    "environment": "development",
    "startedAt": "...",
    "errors": []
  }
}
```

Set `OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp.example.com` (and optionally `OTEL_EXPORTER_OTLP_HEADERS=authorization=Bearer XYZ`) to start exporting.
