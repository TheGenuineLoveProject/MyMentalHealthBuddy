---
name: Governed verification foundation
description: How MMHB's verification foundation is wired, its non-destructive contract, and a false-green trap to distrust
---

# Canonical verifier
- `npm run verify` → `scripts/verify.sh` → `scripts/verify-foundation.mjs` (single source of truth). `npm run verify:foundation` runs it directly.
- It is **non-destructive**: it NEVER runs `vite build`. Hard gates = `client/dist/index.html` present + `/api/health` 200; soft = `/healthz`, `/readyz`. Appends one JSON record per run to `logs/verification.jsonl` (same convention as other `logs/*.jsonl`) and overwrites `docs/architecture/platform-status.md`.
- **Why non-destructive:** building against the live server empties `client/dist` for ~50s and breaks live health (see port-5000-orphan-restarts.md). So freshness is out of scope — presence only.

# Docs architecture memory system
- Markdown surfaces under `docs/`: `architecture/platform-status.md` (auto-generated), `governance/runtime-governance.md` (the contract), `errors/runtime-errors.md`, `patterns/canonical-patterns.md`. Seed verified facts only.

# False-green trap — distrust these gates
- `package.json` has `lint`, `typecheck`, `test` scripts that are **placeholders returning exit 0** (`echo … && exit 0`). They were added by an earlier session, not real gates. `scripts/verify-platform.sh` calls `npm run typecheck`/`test` (with `|| true`). Treat green from these as meaningless until replaced with real commands.
- `scripts/check-contract-routes.sh` (the `pretest` hook) probes non-canonical `/ready` and `/health`; unknown non-API paths can SPA-fallback to `index.html` 200, so it can pass even when readiness isn't implemented at that path. Canonical probes are `/healthz`, `/readyz`, `/api/health`.

**Why:** A "governed verification foundation" with always-green stub gates gives false confidence and can mask regressions. Replacing them with real lint/typecheck/test is the next safe hardening step (needs user sign-off — they touch another session's in-flight work).
