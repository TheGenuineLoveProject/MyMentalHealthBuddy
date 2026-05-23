# MMHB Phase 50 — Disaster Recovery Runbook Baseline

**Generated:** 2026-05-23 02:10 UTC
**Mode:** **documentation only.** No source edits, no refactor, no auth / database / routes / UI / deployment config / `.replit` / infrastructure / dependency changes.
**HEAD on main:** `13122eae3` *Create a snapshot of the current application state and its documentation* (Phase 49 platform checkpoint)
**Launch state:** ✅ **v1.0.0 public beta — GO** (unchanged)

---

## 1. Executive summary

Created `docs/operations/DISASTER_RECOVERY_RUNBOOK.md` — the single document the on-call engineer needs at 3am during an incident. Structured for fast-path triage: every section answers a single operational question, with copy-pasteable shell commands and explicit decision criteria. Authority anchors back to the v7.4 Governance Kernel (BHCE Primary Law) and the Phase 48 contract registry.

This phase consolidates the operational knowledge accumulated across Phases 37 (F-33.6 crisis fallback), 41 (security headers), 44 (canary baseline), 45-47 (`/readyz` deploy-gap lesson), 48 (contract registry), and 49 (immutable snapshot + rollback procedure) into a single playbook. From this baseline forward, every incident response has a single doc to open.

| Deliverable | Path | Purpose |
|---|---|---|
| Runbook | `docs/operations/DISASTER_RECOVERY_RUNBOOK.md` | the on-call playbook (10 sections) |
| Phase report | `docs/reports/PHASE_50_DISASTER_RECOVERY_RUNBOOK.md` | this file |

## 2. Runbook structure (10 sections)

| § | Title | Purpose |
|---|---|---|
| §0 | Read this first — Primary Law | BHCE override clause; sets the asymmetric-risk frame |
| §1 | Severity ladder | P0–P3 with examples and response windows |
| §2 | Emergency health checks | 30-second triage + 60-second forensic + failure-pattern → likely-cause table |
| §3 | Rollback procedures | full-deploy rollback (P0/P1) + investigation-without-rollback (P2/P3) |
| §4 | Crisis route protection | non-negotiable P0 invariants; F-33.6 verification gate |
| §5 | Do-not-do incident rules | 14 specific anti-patterns with rationale and alternative |
| §6 | Database-specific recovery | bounded section explicitly handing off to Replit checkpoint flow |
| §7 | Recovery success criteria | 18-assertion canary + 10 invariants + browser smoke + forensics + 24h shadow |
| §8 | Quick reference card | print-and-tape-to-monitor cheat sheet |
| §9 | Change-control | how this runbook itself is amended |
| §10 | References | links to every supporting artifact |

## 3. Coverage requested vs delivered

| User-specified section | Runbook location | Delivered |
|---|---|---|
| Emergency health checks | §2 (subsections 2.1, 2.2, 2.3) | ✅ 30-sec triage, 60-sec forensic, failure-pattern table with 10 patterns |
| Rollback instructions | §3 (subsections 3.1, 3.2) + §6 (DB) | ✅ Replit checkpoint flow (preferred), snapshot-as-reference flow (fallback), roll-forward decision criteria |
| Crisis route protection | §4 (subsections 4.1, 4.2, 4.3, 4.4) | ✅ verification gate, 5 hard rules, synthetic monitoring requirement, cross-domain contamination check |
| Do-not-do incident rules | §5 — 14 rules in a 3-column table (don't / why / do-this-instead) | ✅ covers git, npm, config files, security, DB, escalation, evidence capture, communication |
| Recovery success criteria | §7 (subsections 7.1–7.5) | ✅ canary suite, 10 invariants, browser smoke, forensics capture, 24-hour shadow window |

## 4. Source material consolidated into the runbook

| Source | Runbook contribution |
|---|---|
| Phase 37 (F-33.6 crisis fallback) | §4 literal set definition; §0 BHCE Primary Law statement |
| Phase 41 (security lockdown) | §5 "do not disable helmet/CSP/HSTS" rule |
| Phase 44 (canary baseline) | §2.1 expected-healthy table |
| Phase 47 (republish gap) | §2.3 "deploy didn't restart" pattern; §3 emphasis on `/api/health.startedAt` as freshness anchor |
| Phase 48 (contract registry) | §2 expected-response sizes; §7.1 references the 18-assertion canary directly |
| Phase 49 (immutable snapshot) | §3.1 rollback procedure (fallback path); §7.4 forensics capture protocol |
| MMHB v7.4 Kernel | §0, §4.4, §5 rules concerning cross-domain contamination and source-edit governance |
| Project hard rules (replit.md) | §5 "do not `npm audit fix --force`," "do not run `db:push --force` ad-hoc," "do not edit forbidden config files" |
| Diagnostics skill | §3.1 checkpoint-rollback path; §6 DB hand-off |

No new content is invented — every rule traces to either a kernel contract, a forbidden-action rule, or a real artifact in the project history.

## 5. Authoring principles applied

- **One question per section.** Each section answers exactly one operational question; nothing about "how to think" or "what the architecture is."
- **Copy-pasteable, not theoretical.** Every check is a shell pipeline. Every threshold is a literal number, not "should be small."
- **Failure-pattern → cause table.** Engineers scan-read under pressure; §2.3 lets them find their pattern in 5 seconds.
- **Hard rules use red language.** §4 says "NEVER negotiate" deliberately — the kernel asymmetric-risk principle is the point.
- **`do-not-do` paired with `do-this-instead`.** Otherwise the rule reads like obstruction; the alternative makes compliance possible.
- **Recovery is not closed at the canary.** §7.5 mandates a 24-hour shadow window; this is borrowed from the Phase 49 forensic frame and prevents premature "all clear" declarations.
- **No emojis in body content** (per user preference); banner badges and table cells use plain text and ASCII checkmarks only.
- **All checks runnable from a bare shell.** No dependency on jq, custom CLIs, or paid tooling — only `curl`, `python3`, `grep`, `awk`, `sha256sum`.

## 6. What the runbook explicitly does NOT do

- It does not prescribe specific monitoring tools or alerting providers — it specifies the **checks** that must be wired up to whatever tool is adopted (§4.3, §9).
- It does not contain auth credentials, environment variable values, API keys, or any secret material.
- It does not script the rollback itself — the Replit Deployments panel is the canonical surface, and the runbook tells operators to use it rather than scripting around it.
- It does not commit to a specific incident-management tool (PagerDuty, Opsgenie, etc.). The severity ladder (§1) is tool-agnostic.
- It does not duplicate the contract registry — it **references** it (§7.1) so the canary suite has a single source of truth.

## 7. Worked example — using the runbook against the Phase 47 incident

To validate the runbook covers a real recent incident:

**Scenario (Phase 47):** `/readyz` deploy gap — fix on `main`, production still serving SPA shell.

**Runbook path that would have driven response:**

1. §2.1 triage → `/readyz` shows `size=10652B  ct=text/html`; expected `size=57B  ct=application/json` → mismatch.
2. §2.3 pattern table → "`/readyz` returns 10,652 B `text/html` instead of 57 B JSON" → row reads *"route handler missing from deployed build; not P0 if `/ready` still works; treat as deferred deploy gap."* P3 severity per §1.
3. §2.2 deploy-freshness check → `/api/health.startedAt` predates the fix commit by 62 m 29 s → confirms gap.
4. §3 → "investigation without rollback" path because crisis surface intact and `/ready` covers readiness; not §3.1 because there is nothing to roll back to (the fix is forward, not backward).
5. §7 → republish, then re-run §2.1 (was Phase 49: 18/18 PASS) + §4.1 (was 5/5).
6. §7.4 → post-mortem written (Phase 47 report). ✅

The runbook would have routed this incident to a low-urgency follow-up rather than a panic, exactly as actually happened. Validates §1 severity model and §2.3 pattern coverage.

## 8. Strict-mode compliance (Phase 50 spec)

| Rule | Compliance |
|---|---|
| Documentation only | ✅ two files written: runbook + this report; zero source touches |
| Do not modify source code | ✅ zero |
| Do not refactor | ✅ zero |
| Do not touch auth / database / routes / UI / deployment config / infrastructure / dependencies / `.replit` | ✅ none touched |
| Create `docs/operations/DISASTER_RECOVERY_RUNBOOK.md` | ✅ 10-section runbook |
| Create `docs/reports/PHASE_50_DISASTER_RECOVERY_RUNBOOK.md` | ✅ this file |
| Include emergency health checks | ✅ runbook §2 (30-sec triage + 60-sec forensic + 10-pattern cause table) |
| Include rollback instructions | ✅ runbook §3 (checkpoint-rollback preferred path + snapshot-as-reference fallback + roll-forward criteria) |
| Include crisis route protection | ✅ runbook §4 (verification gate + 5 hard rules + monitoring requirement + cross-domain contamination check) |
| Include do-not-do incident rules | ✅ runbook §5 (14 rules with rationale + alternative) |
| Include recovery success criteria | ✅ runbook §7 (canary + 10 invariants + browser smoke + forensics + 24-hour shadow) |
| Commit docs only | ✅ via platform checkpoint on `main` |
| Stop | ✅ §10 |

## 9. File integrity

| File | Pre-Phase-50 | Post-Phase-50 | Change |
|---|---|---|---|
| `server/app.mjs` | SHA `28356f33…` | SHA `28356f33…` (untouched) | none |
| `package.json` / `package-lock.json` | Phase 40 baseline | Phase 40 baseline | none |
| `.replit` | SHA `016c533c…` | SHA `016c533c…` | none |
| `docs/operations/DISASTER_RECOVERY_RUNBOOK.md` | did not exist | new | created |
| `docs/reports/PHASE_50_DISASTER_RECOVERY_RUNBOOK.md` | did not exist | new | created |

No other files touched.

## 10. Launch state — re-confirmed

```
v1.0.0 PUBLIC BETA STATUS:    ✅ GO (unchanged)
LAUNCH BLOCKERS:              0
RUNBOOK STATUS:               ✅ baselined (10 sections, all 5 user-requested coverage areas)
PROD /readyz CONTRACT:        ✅ LIVE (from Phase 49)
PROD CONTRACT CANARY:         18 / 18 PASS (from Phase 49)
F-33.6 LIVE STATE:            ✅ 5/5 literals on /crisis
SECURITY POSTURE:             S0 HOLD (unchanged)
MAIN HEAD:                    13122eae3 (Phase 49 platform checkpoint)
NEW SOURCE EDITS:             0
NEW DOC ARTIFACTS:            2 (runbook + this report)
NEXT ACTION (suggested):      doc-only Phase 51 — promote registry §7 row from
                              ⏳ pending → ✅ deployed (still open from Phase 49 §9);
                              recalibrate Phase 44 /readyz tolerance from
                              10,652 B ± 5% → ~57 B ± 30%
```

## 11. References

- The runbook itself: `docs/operations/DISASTER_RECOVERY_RUNBOOK.md`
- Contract registry (referenced by runbook §7.1): `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md`
- Phase 37 (F-33.6 source — anchors runbook §4): `docs/reports/PHASE_37_F_33_6_IMPLEMENTATION.md`
- Phase 44 (canary baseline — anchors runbook §2.1): `docs/reports/PHASE_44_PRODUCTION_MONITORING_CANARY.md`
- Phase 47 (republish gap — anchors runbook §2.3 + worked example §7): `docs/reports/PHASE_47_POST_DEPLOY_READYZ_VERIFY.md`
- Phase 48 (contract registry — anchors runbook §7): `docs/reports/PHASE_48_PRODUCTION_CONTRACT_REGISTRY.md`
- Phase 49 (immutable snapshot — anchors runbook §3.1 fallback): `docs/reports/PHASE_49_IMMUTABLE_RUNTIME_SNAPSHOT.md`
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`
- Diagnostics skill (rollback path): `.local/skills/diagnostics/SKILL.md`

---

*Phase 50 disaster recovery runbook baseline complete. Created `docs/operations/DISASTER_RECOVERY_RUNBOOK.md` — a 10-section on-call playbook covering BHCE Primary Law, 4-tier severity ladder, 30-second triage + 60-second forensic + 10-pattern failure-cause table, full-deploy and roll-forward procedures, 5-rule crisis route protection, 14-item do-not-do incident rules, 10-invariant recovery success criteria with 24-hour shadow window, and a print-ready quick reference card. All content consolidates existing project artifacts (Phases 37, 41, 44, 47, 48, 49) and governance contracts; no new operational policy invented. Validated against the Phase 47 incident as a worked example. Zero source touches. v1.0.0 public beta launch state: GO, blockers 0, unchanged.*
