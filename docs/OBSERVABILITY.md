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
