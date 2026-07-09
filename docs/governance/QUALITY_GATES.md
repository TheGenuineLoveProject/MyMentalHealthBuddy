# Quality Gates

## Baseline Gates
- Build passes.
- Typecheck passes.
- Test suite passes.
- Route verification passes.
- Health endpoints return 200.
- Ready endpoint returns 200.
- Safety guardrails pass.
- Stripe contract passes.
- HealthKit verification passes.
- Rate-limit verification passes.
- Backup readiness passes.
- Real backup environment passes.
- Deployment target health passes.

## Launch Blockers
Do not launch if any exist:
- failed build
- failed typecheck
- failed route verification
- failed auth verification
- failed billing verification
- failed safety verification
- failed backup verification
- failed deployment health check
- missing production secrets
- unresolved SEV-1 issue
