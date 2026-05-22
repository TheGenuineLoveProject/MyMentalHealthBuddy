# MMHB Phase 29 — Release Readiness Verification Suite

**Generated:** 2026-05-22
**HEAD at start:** `901c3631e`
**Mode:** documentation only. No source modified. No refactor. No runtime systems touched.

---

## 1. Scope

Phase 29 codifies the production probe suite, the launch / no-launch gate system, the operational readiness score, and the release approval checklist that together constitute MMHB's **release-readiness verification suite**. It is the executable companion to:

- **Phase 27** (`LAUNCH_OPERATIONS_RUNBOOK.md`) — the operational playbook
- **Phase 28** (`PHASE_28_POST_LAUNCH_TODO_LEDGER.md`) — the post-launch backlog

Phase 29 closes the gap by giving on-call a single document — `docs/operations/PRODUCTION_PROBE_CHECKLIST.md` — that contains every probe, gate, and approval step in one place, all read-only and Replit-native.

## 2. Deliverables

| File | Purpose | Size |
|---|---|---|
| `docs/operations/PRODUCTION_PROBE_CHECKLIST.md` | 13-section executable probe suite | ~330 lines |
| `docs/reports/PHASE_29_RELEASE_READINESS.md` | This report | — |

## 3. Probe checklist — section index

| § | Topic |
|---|---|
| 1 | Probe targets (4 environments) |
| 2 | curl probe suite (8 named probes, all read-only) |
| 3 | Launch smoke-test matrix (12 rows, 5 P0 hard-gate rows) |
| 4 | Deployment rollback checklist (10 steps) |
| 5 | Production incident severity matrix (P0–P3) |
| 6 | Launch / no-launch gate system (5 binary gates) |
| 7 | Operational readiness score (25 criteria, scored at T-24h) |
| 8 | Dependency risk summary (7 tracked dependencies) |
| 9 | Observability verification map (8 signals) |
| 10 | Crisis-routing surface integrity check (3-step P0 probe) |
| 11 | Replit-native recovery procedures (8 symptom → engine map) |
| 12 | Release approval checklist (sign-off form) |
| 13 | References |

## 4. Verification coverage map (asked for vs. delivered)

| Phase 29 requirement | Delivered in |
|---|---|
| verify production endpoints | Probe Checklist §2.1, §3 |
| verify launch probes | §2.1, §2.2, §3 |
| verify deployment headers | §2.3 |
| verify health contracts | §2.1, §3 rows 3–4, §9 |
| verify rollback readiness | §4 (10-step rollback) |
| verify secrets panel expectations | Gate G4 in §6; Runbook §1.4 referenced |
| verify observability readiness | §9 observability verification map |
| verify launch-window governance | §6 gate system + §12 sign-off |
| verify Replit-native recovery procedures | §11 symptom → engine map |
| verify bundle budgets still pass | §2.4, §3 (via §6 G2), §7 rows 7–10 |
| verify crisis-routing surface remains untouched | §10 dedicated P0 probe + §3 row 2 |

All 11 verification requirements are covered.

## 5. Element coverage map (asked for vs. delivered)

| Asked-for element | Section in checklist |
|---|---|
| curl probe suite | §2 (8 probes) |
| launch smoke-test matrix | §3 (12 rows) |
| deployment rollback checklist | §4 (10 steps) |
| production incident severity matrix | §5 (P0–P3) |
| launch/no-launch gate system | §6 (5 binary gates) |
| operational readiness score | §7 (25 criteria, max 25 points) |
| dependency risk summary | §8 (7 tracked deps) |
| open TODO carry-forward map | §8 (cross-references TODO-22.1, 22.2; checklist §12 references Phase 28 ledger) — also restated in §6 below for completeness |
| observability verification map | §9 (8 signals) |
| release approval checklist | §12 (sign-off form) |

All 10 elements are present.

## 6. Open TODO carry-forward map (Phase 28 ledger → Phase 29 verification gates)

| Phase 28 TODO | Affects which Phase 29 gate / probe | Effect when item completes |
|---|---|---|
| **TODO-26.1** (AVIF avatar regions) | §7 row 12 (dist ≤ 50 MB) | dist drops ~10 MB; score remains 1 |
| **TODO-26.2** (AVIF logos) | §7 row 12 | dist drops ~3 MB |
| **TODO-26.3** (de-dupe 4 pairs) | §7 row 12 | dist drops ~2.7 MB |
| **TODO-26.4** (consolidate avatar dirs) | §2.5 asset 404 probe | repo hygiene only; on-the-wire unchanged |
| **TODO-22.1** (Express 4→5) | §3 row 1 (root 200), full smoke matrix | requires full §3 re-run after migration; do NOT execute under launch window |
| **TODO-22.2** (OTel cluster) | §9 traces row, metrics row | telemetry signals must remain green through bump |
| **TODO-23.1** (Prometheus /metrics) | §9 metrics row | standardizes format; backend integration verification |
| **TODO-24.1 / 24.3** (conditional chunk splits) | §7 row 8 (largest JS ≤ 350 KB) | triggered only if measurement crosses threshold |
| **TODO-24.2** (Sentry sourcemap upload) | §7 row 10 (0 source maps in dist) | must remain 0 in public dist after upload |
| **TODO-18.1** (www → apex 301) | §2.6, §3 row 12 | changes www expected status from 200 to 301 — checklist already pre-documents both states |
| **TODO-18.4** (duplicate HSTS) | §2.3 security header probe, §7 row 15 | makes HSTS count = 1 exactly |

Every open TODO has at least one corresponding Phase 29 gate or probe. No TODO can be silently completed.

## 7. Launch gate / readiness score consistency check

Cross-check: every G1–G5 NO-GO trigger in §6 maps to at least one row in the 25-point readiness score §7.

| Gate | Maps to readiness rows |
|---|---|
| G1 Build & probe | 1, 2, 3, 4, 5, 23 |
| G2 Bundle budget | 7, 8, 9, 10, 11 |
| G3 Static asset | 12, 13, 16, 17 |
| G4 Secrets & env | 14 |
| G5 Governance | 20, 21, 22 |
| (Not gated; readiness-only) | 6 (TTFB), 15 (HSTS), 18 (robots), 19 (sitemap), 24 (clean logs), 25 (on-call ack) |

**Result:** all 5 gates anchored in the readiness score. 6 readiness-only rows act as additional signal without being launch-blocking — appropriate per the "5/5 GO" rule (gates are blocking, score is informational depth).

## 8. Governance alignment

Probe checklist honors every clause of the MMHB v7.4 Archival Kernel:

- **Primary law** — domain isolation enforced: §10 (crisis) is its own dedicated probe; §3 row 7 explicitly checks that admin surfaces never return user-visible admin data unauthenticated.
- **BHCE override** — §5 incident matrix flags any `/crisis` regression as automatic P0; §10 dedicates an entire section to crisis-routing integrity; §3 row 2 makes it a P0 hard-gate row in the smoke matrix.
- **Smallest valid engine** — §11 symptom → engine map orders responses from "workflow restart" up through "rollback" before any dependency bump or code change. Recovery never reaches for a larger engine than the symptom requires.
- **Execution discipline** — every probe in §2 is read-only and produces a binary pass/fail. No probe mutates production. The §4 rollback procedure explicitly preserves the failing artifact for post-mortem rather than deleting.
- **Replit mode** — §11 enumerates 8 recovery procedures, all Replit-native (workflows panel, deployment history, secrets panel, `npm run db:push`, Publishing flow, deployment domains panel). No Docker, no virtualenvs, no manual SQL.
- **Output contract** — checklist sections produce explicit "Pass criteria" lines; no probe leaves the reader guessing what counts as success.
- **Circuit breaker** — §7 readiness score gives objective measurement so the 3×-recurrence rule has data to compare against.

## 9. Phase 29 summary

| Gate | Result |
|---|---|
| Probe checklist authored | ✅ `docs/operations/PRODUCTION_PROBE_CHECKLIST.md` (13 sections) |
| Phase report authored | ✅ this file |
| All 11 required verifications covered | ✅ §4 coverage map |
| All 10 required elements included | ✅ §5 element map |
| Launch gates ↔ readiness score consistent | ✅ §7 consistency check |
| Every Phase 28 TODO mapped to a Phase 29 gate or probe | ✅ §6 carry-forward map |
| Governance kernel alignment | ✅ all 7 kernel clauses honored |
| No source modified / no refactor / no runtime systems touched | ✅ documentation only |

**Release readiness verification suite: ESTABLISHED. Production probe checklist ready for T-24h execution.**

---

## 10. Carried-forward TODO ledger pointer

The full open TODO ledger lives in `docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md`. Summary:

- **S0:** 0 (none)
- **S1:** 4 (TODO-26.1, 26.2, 22.1, 22.2)
- **S2:** 5 (TODO-26.4, 24.1, 24.3, 23.1, 18.1)
- **S3:** 3 (TODO-26.3, 18.4, 24.2)
- **Total open:** 12 | **Retired:** 1 (TODO-23.2, closed by Phase 25)

Phase 29 adds **zero** new TODOs. The checklist is the contract.

---

## 11. References

- Production Probe Checklist: `docs/operations/PRODUCTION_PROBE_CHECKLIST.md` (this phase)
- Launch Operations Runbook: `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md` (Phase 27)
- Post-Launch TODO Ledger: `docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md` (Phase 28)
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`
- Phase 18 baseline: edge / network
- Phase 22 baseline: package stabilization
- Phase 23 baseline: perf + observability
- Phase 24 baseline: bundle governance
- Phase 25 baseline: CSS purge audit
- Phase 26 baseline: static asset governance

---

*Phase 29 release readiness verification suite complete. Documentation only. No source code, no refactor, no auth/db/routes/UI/.replit/deployment-config/infrastructure changes.*
