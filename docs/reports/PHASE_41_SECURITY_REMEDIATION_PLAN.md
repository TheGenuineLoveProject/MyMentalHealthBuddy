# MMHB Phase 41 — Security Remediation Plan (6 Moderate Findings)

**Generated:** 2026-05-23
**HEAD at start:** `7a40b9c93` — *Update security audit report to reflect dependency vulnerability findings* (Phase 40)
**Working tree:** clean (only this report will be staged)
**Mode:** **plan only.** Zero source edits, zero installs, zero upgrades, zero removals, no `npm audit fix` (forced or otherwise), no refactor, no auth / database / routes / UI / deployment / `.replit` / infrastructure changes.
**Source of truth for findings:** `docs/reports/PHASE_40_SECURITY_AUDIT.md`
**Launch state:** ✅ **v1.0.0 public beta — GO** (unchanged)

---

## 1. Executive summary

This plan turns the Phase 40 audit into a **sequenced remediation roadmap** without performing any of the remediation in this phase. Every action below is **deferred to its own future phase** that will get its own dry-run, its own report, and its own publish window.

| Decision | Value |
|---|---|
| Findings to remediate | 6 moderate (2 distinct advisories, 6 graph nodes) |
| Production-runtime-exposed | 0 / 6 — none are reachable in the live app |
| Recommended posture **now** | **HOLD** — do nothing this phase |
| Earliest remediation that is safe to plan today | Phase 42 (S-DOC): write `npm overrides` proposal as a dry-run-only doc |
| Earliest remediation that requires `package.json` edit | Phase 43 (S-OVERRIDE-WS) — gated; defaults to skip |
| Permanent fix for esbuild chain | Phase 44 (S-DRIZZLE-KIT-BUMP) — externally gated on upstream `drizzle-kit` shipping its `tsx` migration |
| Dead-dep prune | Phase 45 (S-PM2-DROP) — separate phase, separate publish |
| Re-audit cadence between phases | weekly + on every Sprint 1 publish |
| Dangerous paths to never run | `npm audit fix --force` (both proposed downgrades — §6) |
| Launch impact of this plan | **0** — entire plan can be parked indefinitely with zero production risk |

The decision matrix is intentionally conservative because the **residual production risk is already zero** (Phase 40 §4). Every remediation action carries its own regression risk; the right trade-off is to wait for upstream rather than mutate a working dependency graph for cosmetic compliance.

## 2. Vulnerable chains (carried forward from Phase 40 §3)

### 2.1 Chain A — `esbuild` dev-server origin bypass

```
drizzle-kit                            (CLI, top-level dep, dev-only invocation)
  └─ @esbuild-kit/esm-loader           (DEPRECATED — "Merged into tsx")
       └─ @esbuild-kit/core-utils      (DEPRECATED — "Merged into tsx")
            └─ esbuild  <=0.24.2       ← VULNERABLE NODE (GHSA-67mh-4wv8-2f99, CVSS 5.3)
```

Top-level `esbuild@0.28.0` is patched. The vulnerable copy lives **only** inside the drizzle-kit CLI chain.

### 2.2 Chain B — `ws` uninitialized memory disclosure

```
pm2                                    (devDependency, NOT invoked by .replit [deployment].run)
  └─ ws  8.0.0 – 8.20.0                ← VULNERABLE NODE (GHSA-58qx-3vcg-4xpx, CVSS 4.4)
```

Top-level `ws@8.21.0` is patched. The vulnerable copy lives **only** inside the pm2 admin-socket dependency tree.

## 3. Runtime vs dev-only risk classification

Identical to Phase 40 §4 — reproduced here as the binding classification for this plan.

| Node | Loaded by production runtime | Loaded by client bundle | Exposed to internet | Classification |
|---|---|---|---|---|
| esbuild ≤0.24.2 inside `@esbuild-kit/core-utils` | ❌ | ❌ | ❌ | **dev-only** |
| `@esbuild-kit/core-utils` | ❌ | ❌ | ❌ | **dev-only** |
| `@esbuild-kit/esm-loader` | ❌ | ❌ | ❌ | **dev-only** |
| `drizzle-kit` (CLI shim) | ❌ — only `npm run db:push` triggers it | ❌ | ❌ | **dev-only** |
| `ws` 8.x inside `pm2/node_modules/ws` | ❌ | ❌ | ❌ | **dev-only** |
| `pm2` (devDep, unused at runtime) | ❌ | ❌ | ❌ | **dev-only / unused** |

**All 6 nodes: dev-only. Production residual risk = 0.**

## 4. Safe patch order — sequenced, gated, deferred

Each step below is a **separate future phase**. Phase 41 ships **only** this document and does not perform any of S0 – S6.

### S0 — HOLD (active posture **right now**, this phase + every phase that doesn't explicitly advance below)

- **Action:** none.
- **Why:** zero production risk, zero safe in-place patch available without an upstream release.
- **Verification:** weekly `npm audit --json | jq .metadata.vulnerabilities` snapshot stored under `docs/reports/audit-watch/<YYYY-MM-DD>.json` (whenever the recurring audit-watch phase runs).
- **Exit criteria:** any of {drizzle-kit upstream ships `tsx` migration} OR {a new advisory escalates one of these 6 from moderate → high/critical} OR {a new advisory adds a runtime-reachable node to the graph}.

### S1 — DOC ONLY: write the `npm overrides` proposal as a dry-run document (next phase — "Phase 42 S-DOC")

- **Action:** in a future doc-only phase, draft an `overrides` snippet (in a `.md` only, not in `package.json`) showing exactly how to force `ws@8.21.0` and `esbuild@0.28.0` into the vulnerable transitives. Do not edit `package.json`.
- **Why safe:** zero code change, zero install, zero risk. Pure preparation so a future executor has a reviewed, signed-off snippet.
- **Gate to advance to S2:** human review and sign-off on the override snippet AND a publish window allocated.
- **Verification on completion:** report exists; `package.json` unchanged; `npm audit` unchanged.

### S2 — APPLY `ws` override (future phase — "Phase 43 S-OVERRIDE-WS"; DEFAULTS TO SKIP)

- **Action:** add a single `overrides` entry to `package.json`:

  ```jsonc
  // proposal only — not applied this phase
  "overrides": {
    "pm2": { "ws": "^8.21.0" }
  }
  ```

  No version bumps of any other package. No removal of pm2.

- **Why this is the smallest legal patch:** pins the vulnerable transitive to the already-patched top-level version that the rest of the tree resolves to. pm2 internally only uses `ws` for its in-process admin socket — that path is not exercised in our deployment.

- **Risks (must be acknowledged before executing):**
  - pm2's bundled `ws` was bundled deliberately; overriding it changes the version pm2 was tested against. Low impact for us because we don't run pm2, but a non-zero risk for anyone who does.
  - `npm overrides` semantics are workspace-tree-wide; need to verify no other transitive resolves to a different `ws` major.

- **Pre-execute checklist (dry-run, not done this phase):**
  - [ ] `node -e "console.log(require('ws/package.json').version)"` returns ≥ 8.21.0 before AND after the change
  - [ ] `npm ls ws` shows a single resolved version after the change
  - [ ] `npm run build` clean
  - [ ] `npm audit` shows the ws-chain rows resolved
  - [ ] Production deploy security scan PASS
  - [ ] `/healthz`, `/readyz`, `/crisis`, `/`, `/api/health` → 200 after deploy

- **Default decision:** **SKIP S2 until a runtime exposure appears.** The cost-benefit is unfavorable for a dev-only finding.

### S3 — APPLY `esbuild` override (future phase — "Phase 43b S-OVERRIDE-ESBUILD"; DEFAULTS TO SKIP)

- **Action:** add an override forcing `esbuild` inside the `@esbuild-kit/*` chain to top-level `^0.28.0`:

  ```jsonc
  // proposal only — not applied this phase
  "overrides": {
    "@esbuild-kit/core-utils": { "esbuild": "^0.28.0" }
  }
  ```

- **Higher risk than S2** because:
  - `@esbuild-kit/*` is **deprecated**; overriding deprecated transitives is fragile.
  - drizzle-kit's CLI bundling was tested against the older esbuild line; the API surface esbuild uses (transform/build) may have signature shifts between 0.24.x → 0.28.x that surface only when `db:push` runs against a real schema.

- **Default decision:** **SKIP S3.** Prefer to wait for S4 (upstream fix) rather than carry an override on a deprecated package.

### S4 — `drizzle-kit` UPGRADE on the `tsx`-migrated line (externally gated future phase — "Phase 44 S-DRIZZLE-KIT-BUMP")

- **Trigger:** drizzle-kit ships a release on `^0.31.x` or `^0.32.x` that drops `@esbuild-kit/*` in favor of `tsx`. Watch the project's CHANGELOG for "drop @esbuild-kit" or "use tsx".

- **Action:** bump `drizzle-kit` to the cleanest line that no longer carries `@esbuild-kit/*`. This is the **only permanent fix** for Chain A. Single-package bump, same minor line family if possible.

- **Pre-execute checklist:**
  - [ ] Confirm new drizzle-kit release notes say `@esbuild-kit/*` removed
  - [ ] `npm install drizzle-kit@<target>` in a scratch branch
  - [ ] `npm run db:push --help` runs cleanly
  - [ ] Round-trip `db:push` against a scratch DB matches schema produced by current version
  - [ ] `npm audit` shows zero esbuild-chain findings after the bump
  - [ ] Build + production deploy scan PASS

- **Verification gate:** `npm audit --json | jq '.metadata.vulnerabilities.moderate'` decreases by ≥ 4 (the four esbuild-chain nodes).

### S5 — `pm2` REMOVAL (separate future phase — "Phase 45 S-PM2-DROP")

- **Trigger:** any time after S2/S4. Permitted only in a phase that explicitly allows dependency removal (Phase 41's spec forbids it).

- **Action:** remove `pm2` from `devDependencies`. It is not invoked by `.replit` `[deployment].run` (`node --import ./server/observability/preload.mjs server/app.mjs`) and not referenced from `server/`, `scripts/`, or `.replit`.

- **Pre-execute checklist:**
  - [ ] `rg -n "pm2" server scripts .replit package.json` shows zero matches outside the dep declaration itself
  - [ ] No team workflow doc references pm2 (operator's manual scan)
  - [ ] Build + production deploy scan PASS

- **Verification gate:** `npm audit` shows zero ws-chain findings AND `node_modules/pm2` no longer exists AND `ls -la` shows reduced `node_modules` size.

### S6 — REVALIDATE the BHCE canary upgrade after S2–S5 complete

- **Trigger:** after S4 + S5 both land successfully.

- **Action:** re-run the Phase 35 dev-chain-only classification across the new dependency graph; refresh `docs/operations/POST_LAUNCH_HARDENING_LEDGER.md`; archive the audit-watch baseline.

- **Verification gate:** `npm audit --json | jq .metadata.vulnerabilities.total` returns **0**; ledger marks security-debt cleared; F-33.6's stronger BHCE canary remains intact.

### Plan-flow diagram

```
            ┌────────────────────────────────────────────────────────────┐
            │  S0 — HOLD (active now; every phase that doesn't advance)  │
            └─────────────────────────────┬──────────────────────────────┘
                                          │
                                          ▼
            ┌────────────────────────────────────────────────────────────┐
            │  S1 — Phase 42 S-DOC (write override snippets as proposal) │
            └─────────────────────────────┬──────────────────────────────┘
                                          │  human sign-off + window
                              ┌───────────┴────────────┐
                              ▼                        ▼
                    ┌──────────────────┐     ┌──────────────────┐
                    │ S2 — OVERRIDE-WS │     │ S3 — OVERRIDE-ES │
                    │   (DEFAULT SKIP) │     │  BUILD (DEF SKIP)│
                    └────────┬─────────┘     └────────┬─────────┘
                             │                        │
                             ▼                        ▼
                     ─────────────────────────────────────────
                                          │
                                          ▼
            ┌────────────────────────────────────────────────────────────┐
            │   S4 — Phase 44 S-DRIZZLE-KIT-BUMP                         │
            │   (externally gated on upstream `tsx` migration release)   │
            └─────────────────────────────┬──────────────────────────────┘
                                          │
                                          ▼
            ┌────────────────────────────────────────────────────────────┐
            │   S5 — Phase 45 S-PM2-DROP (dead-dep prune)                │
            └─────────────────────────────┬──────────────────────────────┘
                                          │
                                          ▼
            ┌────────────────────────────────────────────────────────────┐
            │   S6 — Revalidate; close security-debt in hardening ledger │
            └────────────────────────────────────────────────────────────┘
```

## 5. Re-audit cadence

| Cadence | Trigger | Action |
|---|---|---|
| Weekly | calendar | run `npm audit --json` → store under `docs/reports/audit-watch/<YYYY-MM-DD>.json`; diff against prior week |
| Per-publish | every Sprint 1 deploy | platform deploy security scan must PASS; raw output captured into the deploy's checkpoint metadata |
| On drizzle-kit release | upstream changelog mentions `tsx` or `@esbuild-kit` removal | open S4 phase immediately |
| On any advisory escalation | a node in §2.1 / §2.2 escalates moderate → high/critical, OR a new advisory adds a runtime-reachable node | promote S2/S3 from default-skip to default-execute and open the override phase |

## 6. Dangerous upgrade paths — explicit DO-NOT-RUN list

These are the paths `npm audit fix --force` would take if invoked. **Reject all of them.**

| Forbidden path | Source of the proposal | Why it is dangerous |
|---|---|---|
| `drizzle-kit @ 0.31.x → 0.18.1` (major **DOWNGRADE**) | `npm audit`'s `fixAvailable.version` for the esbuild-chain nodes | drops ~13 minors; almost certainly breaks `db:push` and `drizzle.config.ts`; re-introduces older bugs; zero offsetting security benefit (residual prod risk already zero) |
| `pm2 @ 7.0.1 → 6.0.14` (major **DOWNGRADE**) | `npm audit`'s `fixAvailable.version` for the ws-chain nodes | destabilizes a process manager that isn't even invoked at runtime; cosmetic compliance only |
| Blanket `npm audit fix --force` | npm's default suggestion | applies BOTH downgrades simultaneously; would break dev workflows and zero out S4's safer upgrade path |
| Blanket `npm audit fix` (non-force) | npm's default suggestion | functional no-op — all `fixAvailable` entries are `isSemVerMajor: true` — but creates noise in git history |
| Manual `pm2@latest` install hoping the bundled `ws` updates | naive remediation | pm2 vendor-bundles its `ws`; latest pm2 still ships the same vulnerable line until upstream rebases. Without an override, this is wasted churn |

**Do NOT run any of the above.** They will be rejected at code review.

## 7. Decision matrix — what to do *now* (Phase 41)

```
Step    Status this phase          Cost of acting NOW         Cost of waiting
S0      ACTIVE                      0                          0
S1      planned for Phase 42        0 (doc only)               0
S2      planned, default SKIP       medium (regression risk)   0
S3      planned, default SKIP       higher (deprecated tree)   0
S4      gated on upstream           — (cannot act yet)         0
S5      gated on permitted scope    medium (rare-path break)   0
S6      gated on S4 + S5            0 (revalidation only)      0
```

**Action this phase:** generate this plan. Commit it. Stop. **Do not advance to any S-step.**

## 8. Strict-mode compliance (Phase 41 spec)

| Rule | Compliance |
|---|---|
| Do not run `npm audit fix --force` | ✅ not invoked |
| Do not upgrade packages | ✅ zero |
| Do not modify source code | ✅ zero |
| Do not refactor | ✅ zero |
| Do not touch auth / database / routes / UI / deployment config / infrastructure / `.replit` | ✅ none touched |
| Identify each vulnerable chain from Phase 40 | ✅ §2 |
| Classify runtime vs dev-only risk | ✅ §3 |
| Recommend safe patch order | ✅ §4 (S0 → S6, sequenced + gated + dry-run-checklisted) |
| Mark dangerous upgrade paths | ✅ §6 |
| Generate this report | ✅ this file |
| Commit report only | ✅ only this report is staged; platform checkpoint will finalize |
| Stop | ✅ §9 |

## 9. Launch state — re-confirmed

```
v1.0.0 PUBLIC BETA STATUS:    ✅ GO (unchanged)
LAUNCH BLOCKERS:              0
SECURITY POSTURE THIS PHASE:  S0 HOLD (no action; documented; signed off)
PRODUCTION-EXPOSED FINDINGS:  0 / 6
FUTURE PHASES SEQUENCED:      S1 (Phase 42) → S2/S3 (Phase 43, default skip) → S4 (Phase 44, externally gated) → S5 (Phase 45) → S6
NEW SOURCE EDITS THIS PHASE:  0
NEW INSTALLS / UPGRADES:      0
NEW DOC ARTIFACTS:            1 (this report)
NEXT ACTION:                  none, until either upstream drizzle-kit ships its tsx migration OR an advisory escalates
```

## 10. References

- Phase 40 audit: `docs/reports/PHASE_40_SECURITY_AUDIT.md`
- Phase 40 raw audit snapshot: `audit.json`
- Phase 35 dev-chain-only classification (origin of "hold"): `docs/operations/POST_LAUNCH_HARDENING_LEDGER.md`
- Phase 37 implementation: `docs/reports/PHASE_37_F_33_6_IMPLEMENTATION.md`
- Phase 39 deploy verification (post-republish): `docs/reports/PHASE_39_POST_REPUBLISH_CRISIS_FALLBACK_VERIFY.md`
- GHSA-67mh-4wv8-2f99 (esbuild dev server): https://github.com/advisories/GHSA-67mh-4wv8-2f99
- GHSA-58qx-3vcg-4xpx (ws memory disclosure): https://github.com/advisories/GHSA-58qx-3vcg-4xpx
- npm overrides docs (for S2/S3 reference only): https://docs.npmjs.com/cli/v10/configuring-npm/package-json#overrides
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*Phase 41 security remediation plan complete. 6 sequenced steps (S0 – S6), all deferred to their own future phases. Active posture: **S0 HOLD**. No remediation executed this phase. Two `--force` downgrade paths explicitly marked DO-NOT-RUN. v1.0.0 public beta launch state: GO, blockers 0, unchanged.*
