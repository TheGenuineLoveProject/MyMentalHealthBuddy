# Service Level Objectives (SLOs)

## Overview

This document defines the service level objectives for The Genuine Love Project platform.

## Definitions

| Term | Definition |
|------|------------|
| **SLI** | Service Level Indicator - a measurable metric |
| **SLO** | Service Level Objective - a target for an SLI |
| **Error Budget** | Allowed downtime/errors within SLO |

## Platform SLOs

### Availability

| Service | SLO | Error Budget (monthly) |
|---------|-----|----------------------|
| Web Application | 99.5% | 3.6 hours |
| API Endpoints | 99.5% | 3.6 hours |
| Database | 99.9% | 43 minutes |

### Latency

| Endpoint Type | p50 | p95 | p99 |
|--------------|-----|-----|-----|
| Static pages | < 200ms | < 500ms | < 1s |
| API reads | < 100ms | < 300ms | < 500ms |
| API writes | < 200ms | < 500ms | < 1s |
| AI responses | < 3s | < 5s | < 10s |

### Error Rates

| Service | Max Error Rate |
|---------|---------------|
| API endpoints | < 0.5% |
| Authentication | < 0.1% |
| Payments | < 0.1% |

## Measurement

### Key Metrics

1. **Uptime**: Health endpoint checks (every 60s)
2. **Latency**: Response time tracking via middleware
3. **Errors**: Error rate from logs/metrics

### Data Sources

- `/api/metrics` - Prometheus metrics
- Server logs - Error tracking
- Health checks - Availability

## Error Budget Policy

### Green (> 50% remaining)
- Normal development velocity
- Standard deployment process

### Yellow (25-50% remaining)
- Increased testing before deploys
- Review recent changes for issues

### Red (< 25% remaining)
- Pause non-critical changes
- Focus on reliability improvements
- Post-mortem on recent incidents

### Exhausted (0% remaining)
- Feature freeze
- All hands on reliability
- Executive notification

## Review Schedule

| Review | Frequency |
|--------|-----------|
| SLO metrics check | Daily |
| Error budget review | Weekly |
| SLO target review | Quarterly |

## Incident Classification

| Severity | Impact | Response |
|----------|--------|----------|
| P1 | SLO breached, users affected | Immediate |
| P2 | Risk of SLO breach | < 1 hour |
| P3 | Degraded performance | < 4 hours |
| P4 | Minor issues | Next business day |
