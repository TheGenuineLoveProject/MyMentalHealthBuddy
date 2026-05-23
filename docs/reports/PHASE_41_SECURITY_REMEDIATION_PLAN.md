# Phase 41 — Security Remediation Plan

Status: PLAN ONLY

## Rules Honored
- No npm audit fix --force
- No package upgrades
- No source code changes
- No refactor
- No auth/database/routes/UI/deployment/.replit/infrastructure changes

## Current Finding
Remaining vulnerabilities are moderate and tied to development/tooling dependency chains, not verified production runtime request handling.

## Vulnerable Chains From Phase 40
1. drizzle-kit → esbuild-kit → esbuild
2. drizzle-kit → @esbuild-kit/core-utils → esbuild
3. drizzle-kit → @esbuild-kit/esm-loader → esbuild
4. pm2 → ws
5. dev tooling chain exposure only
6. audit fix path proposes breaking downgrade/force changes

## Runtime Risk Classification
- Production runtime risk: LOW / not currently proven reachable
- Dev tooling risk: MODERATE
- Launch blocker: NO
- Requires immediate force fix: NO

## Dangerous Upgrade Paths
Do NOT run:
npm audit fix --force

Reason:
- It can install breaking versions.
- It can downgrade drizzle-kit.
- It can destabilize database tooling.
- It can alter lockfile behavior without runtime verification.

## Safe Patch Order
1. Create isolated security branch.
2. Snapshot current package-lock.
3. Test drizzle-kit upgrade path first.
4. Test pm2/ws path separately.
5. Run build.
6. Run local health routes.
7. Run production-safe smoke checks.
8. Merge only if all gates pass.

## Recommended Future Branches
- security/drizzle-kit-esbuild-chain
- security/pm2-ws-chain

## Required Verification Before Merge
- npm install exits 0
- npm run build exits 0
- /, /healthz, /readyz, /api/health, /metrics, /crisis return HTTP 200 locally
- production remains HTTP 200 after deploy
- no auth/database/routes/UI/.replit/deployment config changed

## Decision
Keep current production state. Plan remediation in isolated branches only.
