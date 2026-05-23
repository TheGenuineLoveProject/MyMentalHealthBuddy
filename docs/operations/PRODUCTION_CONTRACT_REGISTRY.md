# Production Contract Registry

## Purpose
Canonical list of production endpoint contracts for v1.0.0 public beta.

## Endpoint Contracts

| Endpoint | Expected Status | Expected Type | Cache Rule | Notes |
|---|---:|---|---|---|
| / | 200 | text/html | public/max-age=0 | SPA shell |
| /crisis | 200 | text/html | revalidate/no-cache acceptable | Must include crisis fallback literals |
| /healthz | 200 | text/plain | no-store | Lightweight health |
| /ready | 200 | application/json | no-store | Readiness JSON |
| /readyz | 200 | application/json | no-store | Readiness alias |
| /api/health | 200 | application/json | no-store preferred | API health |
| /metrics | 200 | text/plain or json | no-store preferred | Monitoring endpoint |

## Crisis Fallback Required Literals
- crisis-fallback
- 988
- 741741
- 911
- noscript

## Governance
- No clinical autonomy
- No AI diagnosis
- No suicidality assessment by AI
- No monetization use of crisis/healing data
- Crisis resources must remain static, visible, and resilient
