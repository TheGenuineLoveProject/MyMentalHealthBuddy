# Production Observability Readiness

## Purpose

Ensure the platform can detect, explain, and respond to production problems before users are harmed or trust is lost.

## Required Production Signals

The platform must track:

- API health
- readiness status
- build status
- backup readiness
- backup upload success/failure
- restore verification status
- Stripe webhook success/failure
- HealthKit webhook success/failure
- rate-limit activity
- safety guardrail verification
- server errors
- failed authentication events
- deployment version

## Minimum Launch Requirements

Before production launch:

1. `/api/health` returns 200.
2. `/ready` returns 200.
3. Build completes successfully.
4. Backup readiness verifier passes.
5. Real backup environment verifier passes.
6. Production backup launch proof passes.
7. Stripe contract verifier passes.
8. HealthKit verifier passes.
9. Safety guardrail verifier passes.
10. Errors must be logged with timestamp, environment, route, and failure category.

## Incident Response Rule

Production failures must never be silent.

Any failure in backup, billing, biometrics, authentication, or safety systems must create an operational review item.

## Current Status

Foundation health checks, backup readiness checks, Stripe checks, HealthKit checks, and safety guardrail checks exist. Centralized production observability dashboard and alert routing remain pending.
