# Production Incident Severity Matrix

## Status
ACTIVE — v1.0.0 Public Beta

## S0 — Critical Emergency
Trigger:
- /crisis unavailable
- /api/health down
- production root down
- database disconnected
- exposed secret detected

Response:
1. Stop all feature work.
2. Restore last green deployment.
3. Verify /crisis, /api/health, /healthz, /readyz.
4. Do not refactor during incident.
5. Document root cause after recovery.

## S1 — High
Trigger:
- /readyz failing
- /metrics failing
- repeated 5xx responses
- SSL/certificate problem
- login/auth unavailable

Response:
1. Verify logs.
2. Confirm recent deployment.
3. Roll back if regression confirmed.
4. Patch only smallest verified cause.

## S2 — Medium
Trigger:
- SEO files unavailable
- sitemap/robots issue
- performance degradation
- non-critical admin issue

Response:
1. Document.
2. Schedule fix.
3. Verify no crisis/runtime impact.

## S3 — Low
Trigger:
- cosmetic UI issue
- docs issue
- non-blocking TODO

Response:
1. Add to backlog.
2. Fix during normal hardening sprint.

## Incident Rules
- Crisis route protection comes first.
- Restore before refactor.
- No npm audit fix --force during incident.
- No database schema changes during incident unless root cause is confirmed.
- No AI clinical autonomy.
