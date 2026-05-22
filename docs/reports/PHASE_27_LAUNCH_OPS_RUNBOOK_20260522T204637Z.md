# MMHB Phase 27 — Launch Operations Runbook

**Generated:** 20260522T204637Z
**HEAD:** `9e124ea3a`
**Mode:** documentation only. No source modified. No refactor. No runtime systems touched.

---

## 1. Scope

Phase 27 is a **documentation-only** phase. Its single deliverable is a launch operations runbook (`docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md`) that consolidates the operational contract built across Phases 21–26 into an actionable launch + first-72-hour playbook.

No build is required, no source code is touched, and no runtime system is reconfigured.

## 2. Deliverable

| File | Purpose |
|---|---|
| `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md` | Pre-launch checklist, T-0 launch sequence, monitoring rotations, incident playbooks, rollback procedure, communication templates, post-launch cadence |
| `docs/reports/PHASE_27_LAUNCH_OPS_RUNBOOK_20260522T204637Z.md` | This report — the Phase 27 marker |

## 3. Runbook contents — section index

1. **Read this first** — governance, BHCE override, smallest-valid-engine rule, dry-run discipline, Replit-safe execution.
2. **Pre-launch checklist (T-24h)** — 5 sub-gates:
   - Build & probe gate (7 checks)
   - Bundle budget gate (5 checks, sourced from Phase 24 contract)
   - Static asset gate (3 checks, sourced from Phase 26 contract)
   - Secrets & env gate (8 secrets verified by presence, never by value)
   - Governance gate (3 checks: kernel docs, clean working tree)
3. **Launch sequence (T-0)** — 6 strictly ordered steps from main-freeze through smoke-test to launch-channel announce.
4. **First 72 hours — monitoring rotations** — on-call rotation, hourly health pulse curl loop, 4-hourly deployment log scan, daily crisis routing audit.
5. **Incident playbooks** — 6 named scenarios:
   - Site down (5xx)
   - Site slow (TTFB > 2s)
   - Auth flow broken
   - Database degradation
   - Crisis routing failure (BHCE override — highest priority)
   - Asset / image 404 storm
6. **Rollback procedure** — 5 steps using the Replit deployment history panel.
7. **Communication templates** — status update, incident open, incident resolved.
8. **Post-launch cadence (T+72h → T+30d)** — daily crisis audit, weekly perf/bundle regression check, T+14d patch window, T+30d launch-log archive.
9. **References** — links to all upstream governance and Phase 21–26 reports.

## 4. Contract derivation map

Each runbook gate is sourced from a verified Phase 21–26 contract — no new thresholds invented:

| Runbook gate | Source phase | Specific contract |
|---|---|---|
| Initial critical path ≤ 150 KB gz | Phase 23 | Measured 99 KB gz baseline |
| Largest JS chunk ≤ 350 KB raw | Phase 24 | Measured 275 KB baseline (WellnessDashboard) |
| Main CSS ≤ 100 KB gz | Phase 25 | Measured 60 KB gz baseline |
| Zero source maps in public dist | Phase 24 | Verified `sourcemap: false` |
| 8 named vendor chunks | Phase 24 | Verified `manualChunks` config |
| Total `client/dist` ≤ 50 MB | Phase 26 | Measured 35 MB baseline |
| Font external CDN deps = 0 | Phase 26 | Verified 100% self-hosted woff2 |
| `/crisis` reachable | All phases | BHCE override (governance kernel §1) |
| Apex + www both 200 | Phase 18 baseline | Established edge IP 34.111.179.208 |
| Healthz / Readyz probes | Phase 23 | All probes returning 200, TTFB ~185ms |

## 5. Governance alignment

The runbook honors every clause of the MMHB v7.4 Archival Kernel:

- **Primary law** — incident playbooks 4.1–4.6 are scoped per domain (healing / business / platform); 4.5 enforces BHCE supremacy.
- **Smallest valid engine** — every playbook step starts with the smallest available action (log scan → workflow restart → rollback → architecture review), only escalating after exhaustion.
- **BHCE override** — section 0 and section 4.5 both restate the override; 4.5 is marked highest priority and blocks all other work.
- **Execution discipline** — DRY-RUN FIRST is restated in §0; rollback in §5 preserves the failing artifact for post-mortem rather than deleting.
- **Replit mode** — only Replit-native tooling referenced (workflows panel, secrets panel, deployment history, `fetch_deployment_logs`, `npm run db:push`). No Docker, no virtualenvs, no manual SQL migrations.
- **Circuit breaker** — §7 post-launch cadence builds in weekly regression checks against Phases 23–24 baselines so the 3×-recurrence rule has objective measurement.

## 6. What was NOT done (per Phase 27 contract)

- ✅ No source code modified
- ✅ No refactor
- ✅ No auth touched
- ✅ No database touched
- ✅ No routes touched
- ✅ No UI touched
- ✅ No deployment config touched
- ✅ No infrastructure touched
- ✅ No `.replit` touched

The only filesystem mutations performed under Phase 27 are the two documentation files listed in §2.

## 7. Phase 27 Summary

| Gate | Result |
|---|---|
| Runbook authored | ✅ `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md` (8 sections, ~280 lines) |
| Phase report authored | ✅ this file |
| All thresholds sourced from prior verified phases | ✅ traceable contract derivation map in §4 |
| Governance kernel alignment | ✅ all 6 kernel clauses honored |
| No runtime systems touched | ✅ documentation-only |

**Launch operations baseline: GREEN. Ready for T-24h checklist execution when launch window opens.**

---

## Deferred TODOs

### Phase 27 — none recommended

The runbook is the contract. Future revisions should be incremental edits to the runbook itself, not new phases.

### Carried forward
- TODO-23.1 — `/metrics` → Prometheus format
- TODO-18.1 — www → apex 301 redirect (panel toggle)
- TODO-18.4 — duplicate HSTS header (cosmetic)
- TODO-22.1 — `express` 4→5 major upgrade
- TODO-22.2 — OTel cluster coordinated bump
- TODO-24.1 / 24.2 / 24.3 — JS chunk splits + Sentry sourcemap upload (all optional)
- TODO-26.1 — AVIF/WebP siblings for 11 avatar region PNGs (highest-impact asset win)
- TODO-26.2 — AVIF/WebP/SVG for two large brand logos
- TODO-26.3 — De-dupe 4 byte-identical pairs `lumi/official/` ↔ `brand/v17/`
- TODO-26.4 — Consolidate 6 parallel avatar-region source directories

### Retired
- TODO-23.2 — CSS purge audit (closed by Phase 25)

---

*Phase 27 launch operations runbook complete. Documentation files only. No source code, no refactor, no auth/db/routes/UI/.replit/deployment-config/infrastructure changes.*
