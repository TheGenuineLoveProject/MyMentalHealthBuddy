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
