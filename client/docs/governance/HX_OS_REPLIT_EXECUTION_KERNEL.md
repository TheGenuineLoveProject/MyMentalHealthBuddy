# HX-OS Replit Execution Kernel
## Primary Law
Do not expand before runtime stability is verified.
## Execution Loop
diagnose → isolate → patch one blocker → verify → stop
## Replit Rules
- Inspect .replit, replit.nix, package.json, active entrypoint first
- Server must use process.env.PORT || 5000
- Server must listen on 0.0.0.0
- Do not create duplicate entrypoints, routes, schemas, prompts, server files
- Do not modify backups, quarantine, rescue, dist, build, generated logs, deprecated copies
- Health endpoint must return quickly
- Every patch must be verified before next patch
## Quality Gates
BUILD_GATE, ROUTE_GATE, HEALTH_GATE, DEPLOYMENT_GATE, DOMAIN_SEPARATION_GATE, DUPLICATION_GATE, OBSERVABILITY_GATE, ROLLBACK_GATE
