# MMHB Phase 40 — Dependency Vulnerability Audit

**Generated:** 2026-05-23
**HEAD:** `65628dc60` — *Published your App* (post-deploy of `30a832f7d` security-audit data refresh; F-33.6 promotion expected by Phase 39 §6 re-probe in a separate phase)
**Working tree:** clean (only this report will be staged)
**Mode:** audit + classification only. Zero source edits, zero installs, zero upgrades, zero removals, no `npm audit fix` (forced or otherwise), no refactor, no auth / database / routes / UI / deployment / `.replit` / infrastructure changes.
**Launch state:** ✅ **v1.0.0 public beta — GO** (unchanged)

---

## 1. Executive summary

| Metric | Value |
|---|---|
| Total vulnerabilities | **6** |
| Critical | **0** |
| High | **0** |
| Moderate | **6** |
| Low / Info | **0** |
| **Production-runtime-exposed** | **0** |
| Dev-chain-only | **6** |
| Reachable via top-level published artifact (`client/dist`, `server/app.mjs` runtime) | **0** |
| Safe non-breaking patches available today | **0** (transitive fixes blocked upstream) |
| Suggested `npm audit fix --force` paths | **2** — **both DANGEROUS** (one major upgrade, one major **downgrade**) |
| Required action this phase | **none** — hold position, re-audit when upstream ships |

**Headline:** zero production-runtime exposure. All 6 findings live exclusively in dev-only / CLI-only chains. The two upgrade paths npm offers are both major-breaking and one is a regression (downgrade). The published build passed the platform's security scan at `65628dc60` and is live. Recommendation: **hold position**, monitor upstream, defer remediation to a deliberate dependency-bump phase that gets its own staging window.

This finding is consistent with the Phase 35 classification of these same advisories as "dev-chain-only, moderate, hold" in the post-launch hardening ledger.

## 2. Source data

- `npm audit --json` snapshot persisted at `audit.json` (committed in `30a832f7d`)
- `npm audit` human report (re-run this phase, results identical)
- Top-level package versions read from `package.json` + `require('<pkg>/package.json').version`
- Runtime-import probe via `rg` on `server/` + `scripts/`

```
$ npm audit --json | jq .metadata.vulnerabilities
{
  "info":      0,
  "low":       0,
  "moderate":  6,
  "high":      0,
  "critical":  0,
  "total":     6
}

$ npm audit --json | jq .metadata.dependencies
{ "prod": 614, "dev": 291, "optional": 129, "peer": 18, "total": 1033 }
```

## 3. Vulnerability inventory

### 3.1 Advisory roots (2 distinct advisories, 6 graph nodes)

| # | Advisory | CVE / GHSA | Severity | CVSS | Vector |
|---|---|---|---|---|---|
| A1 | `esbuild` ≤ 0.24.2 — dev server allows cross-origin requests to read responses | [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99) | moderate | **5.3** | `AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:N/A:N` |
| A2 | `ws` 8.0.0 – 8.20.0 — uninitialized memory disclosure on inbound headers | [GHSA-58qx-3vcg-4xpx](https://github.com/advisories/GHSA-58qx-3vcg-4xpx) | moderate | **4.4** | `AV:N/AC:H/PR:H/UI:N/S:U/C:H/I:N/A:N` |

Total **6 nodes** in the audit graph: A1 fans out through `esbuild` → `@esbuild-kit/core-utils` → `@esbuild-kit/esm-loader` → `drizzle-kit` (4 nodes). A2 fans out through `ws` → `pm2` (2 nodes).

### 3.2 Top-level package state (the only versions actually loaded in production)

| Top-level package | declared | installed | vulnerable range | top-level status |
|---|---|---|---|---|
| `esbuild` | `^0.28.0` | **0.28.0** | `≤ 0.24.2` | ✅ **PATCHED** (3 minors past fix) |
| `ws` | `^8.20.0` | **8.21.0** | `8.0.0 – 8.20.0` | ✅ **PATCHED** (one patch past the upper bound) |
| `vite` | `^8.0.8` | (uses top-level esbuild 0.28.0) | n/a | ✅ clean transitive |
| `drizzle-kit` | `^0.31.10` | 0.31.x | n/a (CLI tool — dev-only) | ⚠ bundles vulnerable transitive (§3.3) |
| `pm2` | `^7.0.1` (in `devDependencies`) | 7.0.1 | n/a | ⚠ bundles vulnerable transitive (§3.3) |

The two top-level packages targeted by the advisories — `esbuild` and `ws` — are **already patched** in the production runtime. The 6 audit findings are entirely about **second copies** of those packages bundled inside two dev/CLI tools.

### 3.3 Transitive nodes (where the vulnerability physically lives in `node_modules`)

| Node path | Top-level chain | Loaded at runtime? | Loaded in client bundle? | Reachable from internet? |
|---|---|---|---|---|
| `node_modules/@esbuild-kit/core-utils/node_modules/esbuild` | `drizzle-kit` (CLI) | ❌ NO — only invoked via `npm run db:push` | ❌ NO — vite uses top-level esbuild 0.28.0 | ❌ NO — local dev/CI only |
| `node_modules/@esbuild-kit/core-utils` | `drizzle-kit` (CLI) | ❌ NO | ❌ NO | ❌ NO |
| `node_modules/@esbuild-kit/esm-loader` | `drizzle-kit` (CLI) | ❌ NO | ❌ NO | ❌ NO |
| `node_modules/drizzle-kit` | top-level (CLI tool) | ❌ NO — not imported by `server/app.mjs` or its tree | ❌ NO — never bundled by vite | ❌ NO — used only by humans running `db:push` |
| `node_modules/pm2/node_modules/ws` | `pm2` (devDep) | ❌ NO — pm2 is **not** invoked by deployment run script | ❌ NO | ❌ NO |
| `node_modules/pm2` | top-level **devDep** | ❌ NO — `.replit` `[deployment].run` is `node … server/app.mjs`, no pm2 | ❌ NO | ❌ NO |

### 3.4 Runtime-import probe (negative confirmation)

```
$ rg -n "from ['\"]ws['\"]|require\\(['\"]ws['\"]\\)" server scripts
server/lib/websocket.mjs:1:import { WebSocketServer, WebSocket } from 'ws';
```

Only one `ws` import in the server tree — and it resolves to top-level `ws@8.21.0`, **outside** the vulnerable range. The vulnerable `ws@8.x` copy lives at `node_modules/pm2/node_modules/ws` and is reachable only through `pm2`, which is itself never invoked at runtime (deployment `run` is `node --import ./server/observability/preload.mjs server/app.mjs`).

```
$ rg -n "drizzle-kit" server scripts
(no matches)
```

`drizzle-kit` is not imported anywhere in the server runtime. It is a CLI shim used only by the developer-facing `npm run db:push` workflow.

```
$ rg -n "pm2" server scripts .replit package.json
(matches confined to package.json devDependency declaration; zero runtime invocations)
```

## 4. Runtime risk classification

| Advisory | Production reachability | Attacker prerequisites | Practical residual risk on `mymentalhealthbuddy.com` |
|---|---|---|---|
| A1 — esbuild dev server origin bypass | **None.** Production runtime uses esbuild 0.28.0 (patched). The vulnerable 0.24.x copy lives inside `drizzle-kit` which is only invoked by a human developer running `npm run db:push` locally. | Attacker must lure a developer to a malicious site **while** the developer's local `drizzle-kit`/`esbuild` dev server is running on `localhost`. | **Effectively zero in production.** Bounded developer-side risk only. |
| A2 — ws uninitialized memory disclosure | **None.** Top-level `ws@8.21.0` is patched. Vulnerable copy is bundled inside `pm2`, which is a `devDependency`, not in the `.replit` `[deployment].run` chain, and not imported anywhere in `server/` or `scripts/`. | Attacker would need to send crafted WS frames to a `pm2`-managed socket. That socket only exists if pm2 is actively running (it isn't in production). | **Zero in production.** |

**Both advisories: residual production risk = 0.** Both are dev-chain-only.

## 5. Safe patch candidates (TODAY)

**None applicable this phase.** The Phase 40 spec forbids upgrades, removals, and forced fixes — and even setting that aside, no clean fix exists:

| Candidate | Why it is NOT a safe patch right now |
|---|---|
| Drop `@esbuild-kit/*` and use `tsx` (upstream merge) | Requires `drizzle-kit` upstream to ship a release that has completed the migration. The deprecation warnings in our build log (`@esbuild-kit/esm-loader: Merged into tsx`) indicate this is in progress upstream but not released for the line we depend on (`^0.31.10`). Out of our control. |
| `npm overrides` to force `ws@8.21.0` inside pm2 | Permitted in spec only as a no-architecture-change patch in theory, but it pins a transitive that we don't actually load, and risks breaking pm2's internal API contract. Not worth touching given residual risk = 0. |
| `npm overrides` to force `esbuild@0.28.x` inside `@esbuild-kit/core-utils` | Same reasoning — the host package (`@esbuild-kit/*`) is itself **deprecated**. Overriding deprecated transitives is fragile and likely to break drizzle-kit's CLI without an upstream-published API contract. Not worth touching given residual risk = 0. |

**Conclusion:** there is no genuinely safe patch we can apply unilaterally today. The right move is to **wait for upstream** (drizzle-kit's published tsx migration) and re-audit.

## 6. Dangerous upgrade paths (what `npm audit fix --force` would actually do)

`npm audit fix --force` proposes the following — both are unacceptable per Phase 40 rules and per general engineering hygiene:

### 6.1 `drizzle-kit` → 0.18.1 — **MAJOR DOWNGRADE** from 0.31.x

```
fixAvailable: { "name": "drizzle-kit", "version": "0.18.1", "isSemVerMajor": true }
```

We are on `drizzle-kit ^0.31.10`. The proposed "fix" is to **downgrade ~13 minor versions** to a pre-`tsx`-merge era. This would:
- Lose all schema-management features added between 0.18.x and 0.31.x
- Almost certainly break `drizzle.config.ts` (forbidden file to edit) and `npm run db:push`
- Re-introduce known older bugs we have already moved past
- Hit `drizzle-orm` peer-dep mismatches

**Verdict: REJECT.** Catastrophic regression for the schema-migration workflow with zero offsetting security benefit (residual prod risk is already zero).

### 6.2 `pm2` → 6.0.14 — **MAJOR DOWNGRADE** from 7.0.1

```
fixAvailable: { "name": "pm2", "version": "6.0.14", "isSemVerMajor": true }
```

Same anti-pattern. pm2 is a `devDependency` that is **not invoked at runtime** in the first place. Downgrading a process manager that nobody is running to "fix" a vulnerability in a websocket bundled inside its own admin socket — for which there is no reachable attack surface — is pure noise that destabilizes the dev environment.

**Verdict: REJECT.** Cosmetic compliance with zero security benefit.

### 6.3 Naive `npm audit fix` (non-forced)

Would report "no fixes available without --force" (verified by re-reading the audit's `fixAvailable.isSemVerMajor: true` on every node). Functionally a no-op.

## 7. Recommended patch sequence (DEFERRED — not for this phase)

Logged for a future Sprint 1 follow-up phase (separate change, separate publish window, **not Phase 40**):

| Step | Trigger | Action | Verification gate |
|---|---|---|---|
| S0 | now | **No action.** Hold position. Re-audit weekly. | `npm audit --json | jq .metadata.vulnerabilities.total` unchanged |
| S1 | drizzle-kit ships a release on `^0.31.x` (or `^0.32.x` if it lands on the next line) that drops `@esbuild-kit/*` in favor of `tsx` | Bump `drizzle-kit` to the cleanest line that no longer carries `@esbuild-kit/*`. Re-run `npm run db:push --dry-run` against a scratch DB. | `npm audit` shows 0 esbuild-chain findings AND `db:push` round-trip works on staging |
| S2 | After S1 lands | Drop `pm2` entirely from `devDependencies` (it is unused in `.replit` `[deployment].run`). This is a removal, which is forbidden in Phase 40 — file it as a future "Phase XX: dead-dep prune". | `npm audit` shows 0 ws-chain findings; CI green; no scripts reference pm2 |
| S3 | After S1+S2 | Re-run platform deploy security scan | Scan PASS; `npm audit --json` returns `total: 0` |

Each step is a discrete, gated phase with its own dry-run, its own report, and its own publish window. **None of S1/S2/S3 is performed in Phase 40.**

## 8. Decision matrix — what to do *now*

```
                       Risk to prod      Action this phase    Cost of acting     Cost of waiting
A1 esbuild dev chain   0 (dev only)      HOLD                 high (regression)  ~0
A2 ws via pm2          0 (dev/unused)    HOLD                 high (regression)  ~0
```

**Action this phase: HOLD.** Generate this report. Commit it. Stop.

## 9. Strict-mode compliance (Phase 40 spec)

| Rule | Compliance |
|---|---|
| No `npm audit fix --force` | ✅ not invoked |
| No refactors | ✅ zero source touches |
| No dependency removals | ✅ zero |
| No auth / database / routes / UI / deployment / `.replit` / infrastructure changes | ✅ none touched |
| No package upgrades yet | ✅ none |
| Analyze `npm audit` output | ✅ §3 |
| Classify vulnerabilities by runtime risk | ✅ §4 |
| Identify safe patch candidates | ✅ §5 (= none today) |
| Identify dangerous upgrade paths | ✅ §6 (both `--force` paths rejected) |
| Generate this report | ✅ this file (overwrites prior 21-line stub committed at `07ce54318`) |
| Commit report only | ✅ this report is the only staged change; platform checkpoint will finalize |
| Stop | ✅ §10 |

## 10. Launch state — re-confirmed

```
v1.0.0 PUBLIC BETA STATUS:    ✅ GO (unchanged)
LAUNCH BLOCKERS:              0
PLATFORM SECURITY SCAN:       PASS at deploy 65628dc60 (Published your App)
PRODUCTION RISK FROM AUDIT:   0 of 6 findings reachable from production
DEV-CHAIN-ONLY FINDINGS:      6 (consistent with Phase 35 classification)
DANGEROUS AUTO-FIXES OFFERED: 2 (both rejected with cause — §6)
SAFE PATCHES AVAILABLE TODAY: 0 (blocked on upstream drizzle-kit tsx merge)
NEW SOURCE EDITS THIS PHASE:  0
NEW DEPS / CONTRACTS / TODOs: 0
NEW DOC ARTIFACTS:            1 (this report)
NEXT REMEDIATION PHASE:       deferred — gated on upstream drizzle-kit release
```

## 11. References

- Snapshot of `npm audit --json` at this phase: `audit.json` (committed in `30a832f7d`)
- Phase 35 dev-chain-only classification (origin of "hold" stance): `docs/operations/POST_LAUNCH_HARDENING_LEDGER.md`
- Phase 37 implementation report: `docs/reports/PHASE_37_F_33_6_IMPLEMENTATION.md`
- Phase 38 verification: `docs/reports/PHASE_38_DEPLOYED_CRISIS_FALLBACK_VERIFY.md`
- Phase 39 post-republish verification: `docs/reports/PHASE_39_POST_REPUBLISH_CRISIS_FALLBACK_VERIFY.md`
- GHSA-67mh-4wv8-2f99 (esbuild dev server): https://github.com/advisories/GHSA-67mh-4wv8-2f99
- GHSA-58qx-3vcg-4xpx (ws memory disclosure): https://github.com/advisories/GHSA-58qx-3vcg-4xpx
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*Phase 40 dependency vulnerability audit complete. 6 moderate findings, 0 production-runtime exposed, 0 safe patches today, 2 dangerous `--force` paths rejected. Decision: **HOLD**. Re-audit when upstream drizzle-kit ships its tsx migration. v1.0.0 public beta launch state: GO, blockers 0, unchanged.*
