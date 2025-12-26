# Issue Register — The Genuine Love Project

## Blockers (Must Fix)
1. AI Safety not enforced before model call (FIXED: server/ai/safety + route guard)
2. Webhook signature verification requires raw body buffering (PENDING)
3. Refresh token rotation not implemented (PENDING)
4. Rate limiting & abuse controls incomplete (PENDING)

## High Priority
5. Request logging not standardized (add requestId + winston JSON logs)
6. Auth: logout does not revoke refresh tokens (needs DB revoke)
7. Missing token reuse detection (refresh token replay protection)
8. Stripe webhook idempotency table not enforced consistently

## Medium Priority
9. Add audit logging for auth + billing changes
10. Add admin role enforcement coverage for admin routes
11. Add DB constraints and indexes review (naming + uniqueness)
12. Add endpoint tests for /api/auth, /api/ai, /api/billing

## Low Priority
13. Add client-side error boundary + offline UI mode
14. Add GDPR export + delete workflows
15. Add analytics gating + consent handling

## Notes
- Policy: wellness companion only; no diagnosis; no treatment plan; crisis-safe response only.
- Build discipline: schema = server/db/schema only; no mixed formats.