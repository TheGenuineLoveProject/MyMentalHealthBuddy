# Observability & Reliability

**Generated:** 2026-02-06
**Phase:** 12 — Observability & Reliability

---

## Existing Observability Stack

### Health Monitoring

| Endpoint | Path | Auth | Response |
|----------|------|------|----------|
| Health Check | GET /api/health | Public | `{"status":"healthy","database":{"connected":true},"ai":{"available":true}}` |
| Integration Health | GET /api/integration-health | Admin | Service-level health for integrations |
| Metrics | GET /api/metrics | Admin | Prometheus-compatible metrics |

### Structured Logging

| Component | Implementation | Output |
|-----------|---------------|--------|
| Request Logger | Morgan middleware | HTTP request/response logging |
| Application Logger | server/utils/logger.mjs | Structured JSON logs with levels |
| Audit Logger | server/utils/auditLogger.mjs | Security-relevant event logging |
| Request ID | server/middleware/requestId.mjs | UUID per request for tracing |

**Log Levels:** ERROR, WARN, INFO, DEBUG
**Log Format:** JSON with timestamp, level, message, requestId, metadata

### Error Tracking

| System | Implementation | Status | Evidence |
|--------|---------------|--------|----------|
| Sentry | server/utils/sentry.mjs | CONDITIONAL — requires SENTRY_DSN env var | Sentry SDK initializes only when `process.env.SENTRY_DSN` is set; gracefully skips otherwise |
| Error Handler | server/middleware/errorHandler.mjs | ACTIVE | Middleware registered in server/index.mjs |
| Unhandled Rejection | Process-level handler | ACTIVE | Registered in server startup |

### Performance Monitoring

| Metric | Collection Point | Storage |
|--------|-----------------|---------|
| Request count | metrics.mjs middleware | In-memory |
| Response time (avg/max) | metrics.mjs middleware | In-memory |
| Status code distribution | metrics.mjs middleware | In-memory |
| Error count by type | metrics.mjs middleware | In-memory |
| Memory usage | Process.memoryUsage() | On-demand |
| Uptime | Process start time | On-demand |

---

## Observability Architecture

```
┌──────────────────────────────────────────────────┐
│                   CLIENT                          │
│  ┌──────────┐  ┌───────────┐  ┌───────────────┐ │
│  │Analytics │  │Console    │  │Service Worker │ │
│  │Hook      │  │Errors     │  │(offline)      │ │
│  └────┬─────┘  └─────┬─────┘  └───────┬───────┘ │
│       │              │                │          │
└───────┼──────────────┼────────────────┼──────────┘
        │              │                │
  ┌─────▼──────────────▼────────────────▼──────────┐
  │                 EXPRESS SERVER                   │
  │  ┌────────┐ ┌────────┐ ┌─────────┐ ┌────────┐ │
  │  │Request │ │Morgan  │ │Rate     │ │Error   │ │
  │  │ID      │ │Logger  │ │Limiter  │ │Handler │ │
  │  └───┬────┘ └───┬────┘ └────┬────┘ └───┬────┘ │
  │      │          │           │           │      │
  │  ┌───▼──────────▼───────────▼───────────▼────┐ │
  │  │         Structured Logger (JSON)          │ │
  │  └───────────────────┬───────────────────────┘ │
  │                      │                         │
  │  ┌──────────┐  ┌─────▼─────┐  ┌─────────────┐ │
  │  │Metrics   │  │Sentry     │  │Audit Logger │ │
  │  │Endpoint  │  │(errors)   │  │(security)   │ │
  │  └──────────┘  └───────────┘  └─────────────┘ │
  └────────────────────────────────────────────────┘
```

---

## Replit Compatibility

| Constraint | How Observability Complies |
|-----------|---------------------------|
| Single port (5000) | All observability endpoints share Express app |
| No background daemons | Metrics collected inline per-request |
| Deterministic startup | Logger initializes synchronously |
| No external services required | In-memory metrics, console logging |
| Sentry optional | Graceful degradation if Sentry key missing |

---

## Key Observability Queries

### Health Status
```bash
curl http://localhost:5000/api/health
```

### Prometheus Metrics
```bash
curl http://localhost:5000/api/metrics
```

### Recent Error Rate
Available via Sentry dashboard or by querying the metrics endpoint's error counters.

---

## Alerting Recommendations (Not Yet Implemented)

| Alert | Condition | Channel |
|-------|-----------|---------|
| Health degraded | /api/health returns non-200 | GitHub Actions hourly check |
| Error spike | Error rate > 5% of requests | Sentry alert rule |
| DB disconnected | health.database.connected = false | Health check monitor |
| Memory pressure | RSS > 512MB | Metrics threshold |
| Response time degraded | P95 > 5000ms | Metrics threshold |

These can be implemented via:
- GitHub Actions scheduled health checks (already in CI)
- Sentry alert rules (requires Sentry dashboard config)
- External uptime monitor (e.g., UptimeRobot, free tier)

---

## Phase 12 Status: COMPLETE
No code modified. Existing observability documented. Recommendations for alerting provided.

---

## Feature Usage Observability Layer (Added Feb 2026)

### Purpose

Passive, server-side-only feature usage counters that answer four questions:

1. Which core features are used (counts only, no content)
2. How often free users hit natural daily limits
3. How often Pro users use unlimited access
4. Whether any errors or slowdowns occur over time

### What Is Tracked

| Metric Name              | Description                                           | Tags   |
|--------------------------|-------------------------------------------------------|--------|
| `ai_chat_message_count`  | Number of AI chat messages sent (successful only)     | plan   |
| `ai_chat_limit_hit`      | Free user reached the 5/day session cap               | plan   |
| `journal_entry_created`  | A journal entry was successfully saved                | plan   |
| `mood_log_created`       | A mood log was successfully saved                     | plan   |
| `pro_user_action`        | A Pro subscriber used a gated feature                 | plan   |

All counters are in-memory, aggregated, and reset on server restart.

### What Is Explicitly NOT Tracked

- No message content, journal text, or mood descriptions
- No usernames, emails, or personally identifiable information
- No IP addresses, device fingerprints, or session tokens
- No browsing history, page views, or click patterns
- No third-party analytics, pixels, or tracking scripts
- No per-user breakdowns in the summary endpoint
- No frontend JavaScript instrumentation of any kind

### Endpoint

`GET /api/metrics/summary` returns aggregate counts grouped by metric name and plan tier.

### Architecture

- `server/utils/metrics.mjs` — In-memory counter store with `increment()` and `getSummary()`
- `server/routes/metricsSummary.mjs` — Read-only endpoint
- Instrumentation added to: `ai.mjs`, `journal.mjs`, `mood.mjs`

### Guardrails

- All `increment()` calls are wrapped in try/catch and will never throw
- If the metrics module fails to load, routes continue to function normally
- No database writes, no external service calls, no network dependencies
- Metrics are fire-and-forget: they never block or slow down user requests

### Ethical Rationale

1. **Minimal collection**: Only aggregate feature usage counts
2. **No surveillance**: No user-level tracking, profiling, or behavioral analysis
3. **No manipulation**: Data informs product health, never used for dark patterns
4. **Transparent**: This document fully describes everything that is collected
5. **Reversible**: Remove the `increment()` calls and the layer disappears completely
6. **No frontend impact**: Zero additional API calls, scripts, or UI elements added

---

## Week 2 Foundation Sprint — OpenTelemetry + PagerDuty (additive, 2026-04)

This section documents the Week 2 wiring layered on top of the existing in-process metrics and structured logging. Nothing prior was changed.

### What landed

| File | Purpose |
|---|---|
| `server/observability/preload.mjs` | `--import` entrypoint that calls `startTracing()` before any other module loads |
| `server/observability/tracing.mjs` | OpenTelemetry NodeSDK with auto-instrumentations for http, express, pg, fetch |
| `server/observability/alerter.mjs` | PagerDuty Events API v2 client with dedup, dry-run, and console-fallback |
| `server/observability/safetyAlerts.mjs` | Typed wrappers (`alertCrisisPipelineFailure`, `alertWebhookSignatureFailure`, etc.) — call sites import these, never the raw alerter |
| `server/routes/observability.mjs` | Admin-gated diagnostic surface mounted at `/api/admin/observability` |
| `docs/runbooks/pagerduty.md` | On-call runbook for configuring + responding to alerts |

### How tracing is loaded

The workflow command and the deployment `run` command both inject:

```
NODE_OPTIONS='--import ./server/observability/preload.mjs'
```

This guarantees the OpenTelemetry SDK starts **before** Express, pg, or any HTTP client loads, which is required for auto-instrumentation patching to work correctly.

### Behaviour matrix

| Condition | Result |
|---|---|
| `OTEL_DISABLED=true` | SDK never starts (escape hatch) |
| `OTEL_EXPORTER_OTLP_ENDPOINT` set | Spans exported via OTLP/HTTP to that endpoint |
| Neither set (default) | SDK starts with `OTEL_TRACES_EXPORTER=none` — spans are created in-process (so `req.spanContext` is populated and W3C `traceparent` headers propagate) but nothing is exported. **Critical:** this avoids the SDK's default `127.0.0.1:4318` target, which would spam `ECONNREFUSED` in environments without a local collector. |
| `OTEL_LOG_LEVEL` (default `ERROR`) | Quiets the OTel internal diagnostic logger |

Health probe URLs (`/health`, `/ready`, `/api/health`, `/__replco/*`) are filtered out of incoming HTTP spans to keep cardinality manageable. `instrumentation-fs` and `instrumentation-net` are disabled (extreme noise / low value).

### PagerDuty alerter — gates

The alerter is **always safe to call**. Behaviour is gated by env vars:

| Condition | Result |
|---|---|
| `PAGERDUTY_ROUTING_KEY` unset | No-op + `logger.warn` (always-on console fallback) |
| `ALERTS_ENABLED=false` | Dry-run + `logger.warn`, never pages |
| `NODE_ENV !== "production"` | Dry-run + `logger.warn` (override with `ALERTS_FORCE=true`) |
| All gates pass | Posts to `https://events.pagerduty.com/v2/enqueue` |

Local dedup window is 5 minutes per `(severity, dedupKey)` pair to prevent alert storms during tight failure loops.

### Admin diagnostic endpoints

All gated by `requireAuth` + `requireAdmin` + `adminLimiter` via the parent `app.mjs` mount. Read-only except where noted.

| Method + Path | Purpose |
|---|---|
| `GET  /api/admin/observability/` | Endpoint catalog |
| `GET  /api/admin/observability/tracing` | Tracing SDK state, exporter, recent errors |
| `GET  /api/admin/observability/alerter` | Alerter config, totals (sent/suppressed/failed), last error |
| `GET  /api/admin/observability/health` | Combined health rollup of the observability stack itself |
| `POST /api/admin/observability/alerter/test` | Fire one synthetic `info`-severity alert with a unique dedup key (validates wiring without faking a real failure) |

See `docs/runbooks/pagerduty.md` for response procedures and configuration steps.
