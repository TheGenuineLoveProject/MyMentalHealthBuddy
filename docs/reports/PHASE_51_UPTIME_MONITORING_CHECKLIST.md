# MMHB Phase 51 — Uptime Monitoring Checklist Baseline

**Generated:** 2026-05-23 02:13 UTC
**Mode:** **documentation only.** No source edits, no refactor, no auth / database / routes / UI / deployment config / `.replit` / infrastructure / dependency changes.
**HEAD on main:** `04bbdf7e5` *Create a disaster recovery runbook for operational incidents* (Phase 50 platform checkpoint)
**Launch state:** ✅ **v1.0.0 public beta — GO** (unchanged)

---

## 1. Executive summary

Created `docs/operations/UPTIME_MONITORING_CHECKLIST.md` — the tool-agnostic specification for wiring up an uptime monitoring stack against MMHB production. Defines **what** to monitor (the 7 contract registry endpoints + TLS + DNS), **at what frequency**, **with what alert severity** (S0/S1/S2), and **how to verify by hand** when no monitor is wired yet.

This phase completes the v1.0.0 operations triad:

| Phase | Doc | Question it answers |
|---|---|---|
| 48 | `PRODUCTION_CONTRACT_REGISTRY.md` | "What is the contract that production must serve?" |
| 50 | `DISASTER_RECOVERY_RUNBOOK.md` | "What do I do when production breaks?" |
| 51 | `UPTIME_MONITORING_CHECKLIST.md` | "How do I find out that production broke?" |

Together these three docs are the operational backbone — registry defines the contract, monitoring detects deviation, runbook drives recovery.

| Deliverable | Path | Purpose |
|---|---|---|
| Checklist | `docs/operations/UPTIME_MONITORING_CHECKLIST.md` | the monitoring stack specification |
| Phase report | `docs/reports/PHASE_51_UPTIME_MONITORING_CHECKLIST.md` | this file |

## 2. Checklist structure (9 sections)

| § | Title | Purpose |
|---|---|---|
| §0 | Read this first | the two non-negotiables (S0 crisis check + humans-not-queues) |
| §1 | Required production endpoint monitors | 7 endpoints + TLS + DNS + geo-distribution requirements |
| §2 | Alert priorities — S0 / S1 / S2 | severity tier definitions + 12-row decision table |
| §3 | Manual health-check command | copy-pasteable shell pipelines + quick-reference card |
| §4 | Crisis route protection — monitor-specific addendum | mandatory checks + 7 forbidden monitor configurations + optional synthetic transactions |
| §5 | Incident rule — restore first, refactor never | hard rule restated, with situation/allowed/forbidden table + 2-question gate |
| §6 | Coverage matrix | one-page surface × monitor cross-reference |
| §7 | Onboarding checklist for a new monitoring provider | 13-item migration gate |
| §8 | Change-control | how this checklist itself is amended |
| §9 | References | every supporting artifact |

## 3. Coverage requested vs delivered

| User-specified section | Checklist location | Delivered |
|---|---|---|
| Required production endpoint monitors | §1 (table of 7 endpoints + §1.1 TLS + §1.2 DNS + §1.3 geo) | ✅ frequency, severity, pass criteria, regional distribution for each |
| S0/S1/S2 alert priorities | §2 (subsections 2.1, 2.2, 2.3, 2.4) | ✅ definitions, triggers, response SLAs, routing, auto-action, silencing rules, 12-row decision table |
| Manual health-check command | §3 (subsections 3.1, 3.2, 3.3, 3.4) | ✅ 30-sec triage, 60-sec deep-state, TLS verification, quick-reference card |
| Crisis route protection | §4 (subsections 4.1, 4.2, 4.3) | ✅ 4 mandatory checks, 7 forbidden configurations, optional synthetic transactions |
| Incident rule: restore first, refactor never during outage | §5 (subsections 5.1, 5.2, 5.3) | ✅ situation table, 2-question decision gate, rationale |

## 4. Operational backbone — the three-doc triad

```
┌──────────────────────────────────────────────────────────────────────────┐
│   docs/operations/PRODUCTION_CONTRACT_REGISTRY.md   (Phase 48)           │
│   - 7 endpoint contracts                                                  │
│   - F-33.6 literal set                                                    │
│   - 18-assertion canary suite                                             │
│   - change-control rules                                                  │
│   ────────────── the source of truth for expected values ────────────────│
└──────────────────────────────────────────────────────────────────────────┘
                │                                              │
                │ defines the                                  │ informs the
                │ expected state                               │ expected state
                ▼                                              ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│ docs/operations/UPTIME_MONITORING_   │  │ docs/operations/DISASTER_RECOVERY_   │
│ CHECKLIST.md   (Phase 51 — this)     │  │ RUNBOOK.md     (Phase 50)            │
│ - 7 endpoint monitors                │  │ - 30-sec triage                      │
│ - S0/S1/S2 alert priorities          │  │ - rollback procedures                │
│ - manual health-check command        │  │ - crisis route protection            │
│ - crisis route protection            │  │ - do-not-do rules                    │
│ - restore-first-refactor-never rule  │  │ - recovery success criteria          │
│ - migration onboarding gate          │  │                                      │
│ ─── detects when contract breaks ───│  │ ───── drives recovery when it does ──│
└──────────────────────────────────────┘  └──────────────────────────────────────┘
                │                                              ▲
                │                                              │
                └─────────────── fires alert ─────────────────┘
                                drives ack + execution
```

The contract registry is **referenced** by both downstream docs (not duplicated) — single source of truth for sizes, content-types, body shapes, literal sets, and route counts. When the registry changes, both monitoring and recovery docs update in lock-step.

## 5. Source material consolidated into the checklist

| Source | Checklist contribution |
|---|---|
| Phase 37 (F-33.6 origin) | §1 #1, §4.1, §4.2 — the 5-literal set definition and protection |
| Phase 44 (canary baseline) | §1 body-size expectations, §3 quick-reference values |
| Phase 47 (republish gap) | §2.4 "deploy gap" severity entry; §5.1 readiness route example |
| Phase 48 (contract registry) | §1 entire endpoint table; §6 coverage matrix mappings |
| Phase 49 (immutable snapshot) | §3.2 deep-state invariant list (database/env/services/platform counts) |
| Phase 50 (disaster recovery runbook) | §4.2 forbidden configurations (mirrors runbook §4.2 hard rules); §5 restore-first cross-reference; §3.4 severity card |
| MMHB v7.4 Kernel | §0 BHCE asymmetric-risk frame; §5 smallest-valid-engine and circuit-breaker principles; §8 governance-review requirements |
| Project hard rules (replit.md) | §5 example rows (npm audit fix --force forbidden; mid-incident refactor forbidden) |

No new operational policy is invented; every assertion ties to an existing artifact or kernel contract.

## 6. Authoring principles applied

- **Tool-agnostic.** The doc never says "configure UptimeRobot to…" — it says "your monitor must satisfy this contract." Migrating from one provider to another is a §7 checklist exercise, not a rewrite.
- **Frequency anchored to user-impact window.** S0 checks at 60 s, S1 liveness at 30 s, S2 ops at 300 s. Frequency is set by impact, not by tool defaults.
- **Decision tables over prose.** §2.4 (12 rows) and §6 (11 rows) let an operator find their case by scanning, not by reading paragraphs.
- **Forbidden configurations explicitly enumerated.** §4.2 is the load-bearing addition — it names the 7 anti-patterns that look harmless but defeat the purpose. Without this, "we monitor `/crisis`" becomes a meaningless claim.
- **Silencing rules made explicit per severity.** S0 cannot be silenced without a written reason; S1 can be silenced 4 h; S2 supports digest suppression. Otherwise silencing is the failure mode.
- **Onboarding gate is checkable.** §7 is a 13-box checklist that a migration phase report must mark complete. Without this, a provider migration creates a silent monitoring downgrade.
- **No emojis in body content** (per user preference); table cells use ASCII checks/X only.
- **All shell commands runnable from bare environment.** Only `curl`, `python3`, `grep`, `awk`, `openssl`, `sort`, `wc` — no jq, no provider CLIs.

## 7. What the checklist explicitly does NOT do

- **Does not pick a monitoring provider.** Replit-managed deployments, Pingdom, UptimeRobot, Better Stack, Checkly, Datadog Synthetics, custom cron — all are valid as long as the contracts in §1–§4 are satisfied.
- **Does not specify the on-call paging tool.** PagerDuty, Opsgenie, Slack workflow, phone tree — the SLAs in §2 are the requirement; how you deliver the page is operational choice.
- **Does not contain alert template content.** Templates belong with the monitoring tool; this doc specifies which fields the templates must include (link to disaster recovery runbook, severity, endpoint, region, response body excerpt).
- **Does not duplicate the contract registry.** Expected sizes/content-types/body shapes are **referenced** (§1 notes "see registry"). When the registry changes, this doc updates by reference, not by edit.
- **Does not auto-rollback on S0.** §2.1 explicitly states humans rollback per the disaster recovery runbook §3.1. Auto-rollback against S0 is judged too risky to ship.

## 8. Worked example — the checklist applied to the Phase 49 republish event

To validate the checklist covers a real recent event:

**Scenario (Phase 49 deployment):** `Published your App` checkpoint at 2026-05-23 02:05:59 UTC shipped the `/readyz` fix.

**Checklist path that would have driven detection + verification:**

1. §1 #4 monitors `/readyz` at 60 s cadence → before deploy, returns 10,652 B HTML; alert fires as S1 per §2.4 row "`/readyz` returns 10,652 B HTML instead of 57 B JSON."
2. §2.2 routes S1 to "ack within 15 min, mitigate within 1 h" — appropriate window for a deploy gap (not P0 because crisis surface intact, `/ready` still works).
3. §3.1 manual triage confirms gap; §3.2 deep-state check confirms DB + services healthy.
4. §5.2 two-question gate → (a) crisis surface intact? yes → (b) will rolling forward fix it faster than rolling back? yes → roll forward with the existing fix commit.
5. Deploy succeeds. §1 #4 monitor flips to PASS at the next 60 s tick.
6. §3.4 freshness check confirms `startedAt` increment → S1 alert auto-resolves.
7. Post-event: §7.4 forensics captured in `PHASE_49_IMMUTABLE_RUNTIME_SNAPSHOT.md`.

The checklist correctly classifies this as S1 (not S0) and routes to roll-forward (not rollback) — matches what actually happened. Validates §1 frequency, §2 severity tiers, §5 incident rule.

## 9. Strict-mode compliance (Phase 51 spec)

| Rule | Compliance |
|---|---|
| Documentation only | ✅ two files written: checklist + this report; zero source touches |
| Do not modify source code | ✅ zero |
| Do not refactor | ✅ zero |
| Do not touch auth / database / routes / UI / deployment config / infrastructure / dependencies / `.replit` | ✅ none touched |
| Create `docs/operations/UPTIME_MONITORING_CHECKLIST.md` | ✅ 9-section checklist |
| Create `docs/reports/PHASE_51_UPTIME_MONITORING_CHECKLIST.md` | ✅ this file |
| Include required production endpoint monitors | ✅ checklist §1 (7 endpoints + TLS + DNS + 3-region requirement) |
| Include S0/S1/S2 alert priorities | ✅ checklist §2 (definitions, SLAs, routing, silencing rules, 12-row decision table) |
| Include manual health-check command | ✅ checklist §3 (30-sec triage + 60-sec deep-state + TLS check + quick-ref card) |
| Include crisis route protection | ✅ checklist §4 (4 mandatory checks + 7 forbidden configurations + optional synthetic transactions) |
| Include incident rule: restore first, refactor never during outage | ✅ checklist §5 (situation table, 2-question gate, rationale) |
| Commit docs only | ✅ via platform checkpoint on `main` |
| Stop | ✅ §11 |

## 10. File integrity

| File | Pre-Phase-51 | Post-Phase-51 | Change |
|---|---|---|---|
| `server/app.mjs` | SHA `28356f33…` | SHA `28356f33…` (untouched) | none |
| `package.json` / `package-lock.json` | Phase 40 baseline | Phase 40 baseline | none |
| `.replit` | SHA `016c533c…` | SHA `016c533c…` | none |
| `docs/operations/UPTIME_MONITORING_CHECKLIST.md` | did not exist | new | created |
| `docs/reports/PHASE_51_UPTIME_MONITORING_CHECKLIST.md` | did not exist | new | created |

No other files touched.

## 11. Launch state — re-confirmed

```
v1.0.0 PUBLIC BETA STATUS:       ✅ GO (unchanged)
LAUNCH BLOCKERS:                 0
OPERATIONS TRIAD STATUS:         ✅ COMPLETE
                                   - Contract registry  (Phase 48)
                                   - Disaster runbook   (Phase 50)
                                   - Uptime checklist   (Phase 51, this)
PROD /readyz CONTRACT:           ✅ LIVE (from Phase 49)
PROD CONTRACT CANARY:            18 / 18 PASS (from Phase 49)
F-33.6 LIVE STATE:               ✅ 5/5 literals on /crisis
SECURITY POSTURE:                S0 HOLD (unchanged)
MAIN HEAD:                       04bbdf7e5 (Phase 50 platform checkpoint)
NEW SOURCE EDITS THIS PHASE:     0
NEW DOC ARTIFACTS:               2 (checklist + this report)
NEXT ACTION (suggested):         doc-only Phase 52 — execute the registry §7
                                 promotion deferred since Phase 49 (flip /readyz
                                 row from ⏳ pending → ✅ deployed) and the
                                 Phase 44 canary tolerance recalibration
                                 (10,652 B ± 5% → ~57 B ± 30%)
```

## 12. References

- The checklist itself: `docs/operations/UPTIME_MONITORING_CHECKLIST.md`
- Contract registry (referenced throughout checklist): `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md`
- Disaster recovery runbook (downstream consumer of monitoring alerts): `docs/operations/DISASTER_RECOVERY_RUNBOOK.md`
- Phase 37 (F-33.6 origin — anchors checklist §1 #1, §4): `docs/reports/PHASE_37_F_33_6_IMPLEMENTATION.md`
- Phase 44 (canary baseline — anchors §1 body-size values): `docs/reports/PHASE_44_PRODUCTION_MONITORING_CANARY.md`
- Phase 47 (republish gap — anchors §2.4, §5.1, §8 worked example): `docs/reports/PHASE_47_POST_DEPLOY_READYZ_VERIFY.md`
- Phase 48 (registry baseline): `docs/reports/PHASE_48_PRODUCTION_CONTRACT_REGISTRY.md`
- Phase 49 (immutable snapshot — anchors §3.2 invariant list): `docs/reports/PHASE_49_IMMUTABLE_RUNTIME_SNAPSHOT.md`
- Phase 50 (disaster recovery runbook — anchors §4.2, §5): `docs/reports/PHASE_50_DISASTER_RECOVERY_RUNBOOK.md`
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*Phase 51 uptime monitoring checklist baseline complete. Created `docs/operations/UPTIME_MONITORING_CHECKLIST.md` — a 9-section tool-agnostic monitoring specification covering 7 required endpoint monitors (with TLS, DNS, and 3-region distribution requirements), 3-tier S0/S1/S2 alert priorities with SLAs and silencing rules, a 12-row severity decision table, copy-pasteable manual health-check pipelines, 4 mandatory crisis route checks paired with 7 explicit forbidden configurations, the restore-first-refactor-never incident rule with a 2-question decision gate, an 11-row coverage matrix, and a 13-item migration onboarding gate. All content references existing project artifacts (Phases 37, 44, 47, 48, 49, 50) and governance contracts; no new operational policy invented. Validated against the Phase 49 republish event as a worked example. Zero source touches. v1.0.0 public beta operations triad — contract registry + disaster runbook + uptime checklist — is now complete. Launch state: GO, blockers 0, unchanged.*
