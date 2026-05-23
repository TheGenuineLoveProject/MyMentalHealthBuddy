# MMHB Phase 52 — Production Incident Severity Matrix Baseline

**Generated:** 2026-05-23 02:16 UTC
**Mode:** **documentation only.** No source edits, no refactor, no auth / database / routes / UI / deployment config / `.replit` / infrastructure / dependency changes.
**HEAD on main:** `ee3aaf68f` *Add uptime monitoring checklist for production systems* (Phase 51 platform checkpoint)
**Production deployed commit:** `ed813afab` *Published your App* (republish landed mid-Phase 52 — operations triad docs now in the deployed bundle)
**Launch state:** ✅ **v1.0.0 public beta — GO** (unchanged)

---

## 1. Executive summary

Created `docs/operations/INCIDENT_SEVERITY_MATRIX.md` — the single source of truth for incident severity classification. Defines a 4-tier ladder (S0/S1/S2/S3) with explicit trigger conditions, response steps, exit criteria, and a unified decision table. Codifies three load-bearing rules — crisis route priority, rollback-first, no emergency refactors, and no `npm audit fix --force` — as named, governance-protected invariants.

This phase **completes** the v1.0.0 operations stack:

| Phase | Doc | Question it answers |
|---|---|---|
| 48 | Contract registry | "What is the contract that production must serve?" |
| 50 | Disaster recovery runbook | "What do I do when production breaks?" |
| 51 | Uptime monitoring checklist | "How do I find out that production broke?" |
| **52** | **Incident severity matrix** | **"How bad is this, and what does that imply?"** |

Together these four docs cover the full incident lifecycle: detection → classification → response → recovery → forensics.

Coincident with this phase, a **republish landed** (`ed813afab`) — the Phase 50 + Phase 51 docs are now in the deployed bundle. No verification required for this phase since the deliverables are doc-only, but noted for forensic completeness.

| Deliverable | Path | Purpose |
|---|---|---|
| Matrix | `docs/operations/INCIDENT_SEVERITY_MATRIX.md` | the severity classification authority |
| Phase report | `docs/reports/PHASE_52_INCIDENT_SEVERITY_MATRIX.md` | this file |

## 2. Matrix structure (14 sections)

| § | Title | Purpose |
|---|---|---|
| §0 | Read this first | the three load-bearing rules stated up-front |
| §1 | Severity ladder at a glance | one-line definitions + SLAs + routing |
| §2 | Severity is decided by impact, not by cause | classification principle |
| §3 | S0 — Critical | definition, 10 triggers, 8-step response, crisis priority, auto-action rules, exit criteria |
| §4 | S1 — High | definition, 12 triggers, 9-step response, DB special case, exit criteria |
| §5 | S2 — Medium | definition, 10 triggers, 7-step response, exit criteria |
| §6 | S3 — Low | definition, 8 triggers, 5-step response, exit criteria |
| §7 | Severity decision table | 28-row symptom → severity lookup for fast classification |
| §8 | Rollback-first rule | the 2-question gate + rollback definition + rationale |
| §9 | No unsafe emergency refactors | 10 forbidden actions + 5 allowed actions + rationale |
| §10 | No `npm audit fix --force` during an incident | 8 forbidden actions + 5 allowed actions + CVE escalation path + rationale |
| §11 | Cross-cutting rules | 8 rules that apply at every severity |
| §12 | Severity downgrade / upgrade rules | governance for changing classification mid-incident |
| §13 | Change-control for this matrix | how this doc itself is amended |
| §14 | References | every supporting artifact |

## 3. Coverage requested vs delivered

| User-specified section | Matrix location | Delivered |
|---|---|---|
| S0 / S1 / S2 / S3 definitions | §3, §4, §5, §6 (one full section per tier) | ✅ definition + triggers + response + crisis priority + exit criteria for each |
| Trigger conditions | §3.2 (10), §4.2 (12), §5.2 (10), §6.2 (8) — 40 total | ✅ each trigger is enumerated, evidence-anchored, and ties to existing artifacts |
| Response steps | §3.3, §4.3, §5.3, §6.3 — numbered tables with time budgets | ✅ each step has a budget; total mitigation budget stated per tier |
| Crisis route priority | §3.4, §4.4, §5.4, §6.4 — explicit at every severity | ✅ S0 absolute priority + the obligation persists at every tier |
| Rollback-first rule | §8 (subsections 8.1 2-question gate, 8.2 definition, 8.3 rationale) | ✅ as a named, governance-protected invariant |
| No unsafe emergency refactors | §9 (subsections 9.1 forbidden, 9.2 allowed, 9.3 rationale) | ✅ 10 forbidden actions enumerated + 5 allowed actions paired with constraints |
| No `npm audit fix --force` during incident | §10 (subsections 10.1 forbidden, 10.2 allowed, 10.3 CVE special case, 10.4 rationale) | ✅ broadened to cover all unsafe npm operations + CVE escalation path |

## 4. The three load-bearing rules

These are stated in §0 and each gets a dedicated section. They are positioned as **governance-protected invariants** — modifying any one requires kernel review (§13).

### 4.1 Crisis route priority (§3.4 + §11)

> S0 has absolute priority over every other incident, every other ongoing change, every other engineering activity.

Asymmetric risk frame: false-positive cost is small, false-negative cost is unbounded.

### 4.2 Rollback-first rule (§8)

> During an active incident, the first option considered must be: roll back to the last-known-good state. Other options are evaluated only if rollback is not faster, not safer, or not possible.

Codified as a 2-question decision gate that any on-call can apply in 30 seconds:
1. Is the user-facing crisis surface intact right now?
2. Will this change get the site back faster than rolling back?

### 4.3 No unsafe emergency refactors (§9)

> During an active incident, do not refactor, redesign, rewrite, or "improve while we're in there."

Enumerates 10 specific actions that count as "refactor" and are forbidden during an incident, paired with 5 specific actions that are allowed.

### 4.4 No `npm audit fix --force` during an incident (§10)

> `npm audit fix --force` is a breaking-change operation. It is never an incident response action.

Broadened from the user request to cover the full class of unsafe npm operations (8 forbidden), with an explicit CVE escalation path (§10.3) for the case that most tempts an exception.

## 5. Source material consolidated into the matrix

| Source | Matrix contribution |
|---|---|
| Phase 37 (F-33.6 origin) | §3.2 trigger list (literal-stripping triggers); §11 verification rule |
| Phase 41 (security S0 HOLD) | §10.4 rationale (the moderates are accepted risk, not auto-fixable) |
| Phase 44 (canary baseline) | §5.2 trigger values (latency thresholds); §6.2 (route count baseline 127) |
| Phase 47 (republish gap) | §4.2 trigger row ("`/readyz` returns 10,652 B HTML — deploy gap") |
| Phase 48 (contract registry) | §3.2 + §4.2 (canary endpoint references); §7 decision table grounding |
| Phase 49 (immutable snapshot) | §11.6 (post-mortem snapshot reference) |
| Phase 50 (disaster recovery runbook) | §3.3 + §4.3 response step procedures point into runbook sections |
| Phase 51 (uptime monitoring checklist) | §7 decision table mirrors §2.4 of checklist; §3.5 silencing rule |
| MMHB v7.4 Kernel | §0 BHCE Primary Law; §8.3 + §9.3 smallest-valid-engine and circuit-breaker rationales; §13 governance review |
| Project hard rules (replit.md) | §10 entire section (`npm audit fix --force` forbidden); §9.1 (`.replit` and `vite.config.ts` forbidden during incidents) |

No new operational policy is invented; every rule traces to a kernel contract, an existing project rule, or a real artifact.

## 6. Authoring principles applied

- **Severity-by-impact, not by cause.** §2 explicitly disavows the common error of classifying by what's failing rather than who's affected.
- **Asymmetric risk applied to classification itself.** §12 makes upgrades always free, downgrades evidence-gated. "When in doubt, classify one level higher."
- **Every tier has the same shape.** Definition → triggers → response (numbered table with time budgets) → crisis route priority → exit criteria. Predictable structure under pressure.
- **The decision table is the load-bearing artifact.** §7 lets an operator look up a symptom and find the severity in 5 seconds. Everything else is justification.
- **Load-bearing rules get their own section AND a §0 mention.** Rollback-first, no-emergency-refactor, no-audit-fix-force each have ~50 lines of explanation, plus a one-line summary in §0 so they're impossible to miss.
- **Forbidden / allowed paired.** §9 and §10 always pair the don't-do with the do-this-instead. Otherwise the rules read like obstruction.
- **Cross-cutting rules separated.** §11 captures the rules that apply at every severity so they don't get duplicated across §3-§6.
- **Governance review explicitly required for high-stakes changes.** §13 says which changes to this matrix need kernel review (the three load-bearing rules cannot be weakened without it).
- **No emojis in body content** (per user preference); table cells use ASCII checks/X only.
- **All evidence-anchored.** Every threshold (5 % users, 200 MB heap, 127 routes, 5 s p95, 48 h TLS, etc.) ties to a project baseline or existing artifact.

## 7. What the matrix explicitly does NOT do

- **Does not duplicate the disaster recovery runbook.** Response steps **reference** runbook sections (e.g. "execute disaster recovery runbook §3.1") rather than restating procedures.
- **Does not duplicate the uptime monitoring checklist.** Trigger conditions overlap by necessity, but the matrix focuses on **classification**, the checklist focuses on **detection**.
- **Does not duplicate the contract registry.** Expected values (10,652 B, 57 B, 127 routes, etc.) are **referenced** rather than restated.
- **Does not name specific incident-management tools.** PagerDuty, Opsgenie, Slack — pick any; the SLAs are tool-agnostic.
- **Does not assume team size.** Single-person on-call vs distributed team — the matrix works for both; only routing details (§1) vary.
- **Does not specify escalation chains.** "Secondary on-call" is a role, not a person; staffing belongs in the on-call rota doc, not here.

## 8. Worked examples — applying the matrix to real Phase events

### 8.1 Phase 47 — `/readyz` returns HTML, not JSON

1. §7 decision table row "`/readyz` returns 10,652 B HTML (deploy gap, `/ready` works)" → **S1**.
2. §4.3 step 4 — verify crisis gate (was 5/5, intact).
3. §4.3 step 5 — disaster recovery runbook §2.3 pattern table identifies as "deploy gap; treat as deferred."
4. §4.3 step 6 — apply §8.1 2-question gate → (a) crisis intact yes (b) roll-forward fastest yes → minimal patch + redeploy.
5. §4.6 exit criteria met after Phase 49 republish (18/18 canary PASS, gate verified, post-mortem written).

Matrix correctly routed an event that could have been mis-escalated as S0 ("readiness endpoint broken!") to its actual severity (S1, deferred), preserving on-call sleep while still flagging the issue.

### 8.2 Phase 49 — discovering production was redeployed

1. Discovery: `/api/health.startedAt` changed mid-phase → no symptom yet; matrix would classify the *discovery itself* as **S3** (deploy freshness change, no user impact, app healthy).
2. §6.3 step 1: log in next sprint planning. Done — captured in Phase 49 report.
3. §6.3 step 3: verify crisis gate. Done — 5/5 confirmed.
4. §6.5 exit: phase report written.

Matrix correctly distinguishes "discovered a deploy I didn't initiate" from an actual incident.

### 8.3 Hypothetical — accidentally introduce a new critical CVE via a dep update

1. §7 decision table: "New critical CVE in top-level dep" → **S1**.
2. §10.3 case applies — CVE in dep tree.
3. §10.3 explicit guidance: **do not run `npm audit fix --force`**. Identify the package, pin to a known-safe version in a planned phase.
4. §10.3 alternative path: if exploitation is active, escalate to security response (which itself may be S0).
5. Mitigation: rollback to pre-vulnerable dep state per §8; planned-phase upgrade lands afterward.

Matrix steers the response away from the tempting "just `npm audit fix`" path that has caused real outages elsewhere.

## 9. Strict-mode compliance (Phase 52 spec)

| Rule | Compliance |
|---|---|
| Documentation only | ✅ two files written: matrix + this report; zero source touches |
| Do not modify source code | ✅ zero |
| Do not refactor | ✅ zero |
| Do not touch auth / database / routes / UI / deployment config / infrastructure / dependencies / `.replit` | ✅ none touched |
| Create `docs/operations/INCIDENT_SEVERITY_MATRIX.md` | ✅ 14-section matrix |
| Create `docs/reports/PHASE_52_INCIDENT_SEVERITY_MATRIX.md` | ✅ this file |
| Include S0/S1/S2/S3 definitions | ✅ matrix §3, §4, §5, §6 (one dedicated section per tier) |
| Include trigger conditions | ✅ 40 enumerated triggers across §3.2, §4.2, §5.2, §6.2 |
| Include response steps | ✅ numbered tables with time budgets in §3.3, §4.3, §5.3, §6.3 |
| Include crisis route priority | ✅ matrix §3.4 (S0 absolute priority) + §4.4, §5.4, §6.4 (gate obligation persists) + §11 cross-cutting rule |
| Include rollback-first rule | ✅ matrix §8 (definition + 2-question gate + rationale) |
| Include no unsafe emergency refactors | ✅ matrix §9 (10 forbidden + 5 allowed + rationale) |
| Include no `npm audit fix --force` during incident | ✅ matrix §10 (broadened to cover full class of unsafe npm operations) |
| Commit docs only | ✅ via platform checkpoint on `main` |
| Stop | ✅ §11 |

## 10. File integrity

| File | Pre-Phase-52 | Post-Phase-52 | Change |
|---|---|---|---|
| `server/app.mjs` | SHA `28356f33…` | SHA `28356f33…` (untouched) | none |
| `package.json` / `package-lock.json` | Phase 40 baseline | Phase 40 baseline | none |
| `.replit` | SHA `016c533c…` | SHA `016c533c…` | none |
| `docs/operations/INCIDENT_SEVERITY_MATRIX.md` | did not exist | new | created |
| `docs/reports/PHASE_52_INCIDENT_SEVERITY_MATRIX.md` | did not exist | new | created |

No other files touched.

## 11. Launch state — re-confirmed (with new sidebar)

```
v1.0.0 PUBLIC BETA STATUS:       ✅ GO (unchanged)
LAUNCH BLOCKERS:                 0
OPERATIONS STACK STATUS:         ✅ COMPLETE (4 docs)
                                   - Contract registry         (Phase 48)
                                   - Disaster recovery runbook (Phase 50)
                                   - Uptime monitoring checklist (Phase 51)
                                   - Incident severity matrix  (Phase 52, this)
DEPLOYED COMMIT:                 ed813afab  Published your App  ← republish landed mid-phase
                                   (operations triad docs now in deployed bundle —
                                    they're docs, so the deployment has no runtime effect)
LOCAL MAIN HEAD:                 ee3aaf68f  (Phase 51 checkpoint; +1 from deployed
                                   since deployed includes Phase 50 only)
PROD /readyz CONTRACT:           ✅ LIVE (from Phase 49)
PROD CONTRACT CANARY:            18 / 18 PASS (from Phase 49)
F-33.6 LIVE STATE:               ✅ 5/5 literals on /crisis (from Phase 49)
SECURITY POSTURE:                S0 HOLD — 6 moderate / 0 high / 0 critical (unchanged)
NEW SOURCE EDITS THIS PHASE:     0
NEW DOC ARTIFACTS:               2 (matrix + this report)
NEXT ACTION (suggested):         doc-only Phase 53 — execute the registry §7 promotion
                                 deferred since Phase 49 (flip /readyz row from
                                 ⏳ pending → ✅ deployed) and the Phase 44 canary
                                 tolerance recalibration (10,652 B ± 5% → ~57 B ± 30%)
```

## 12. References

- The matrix itself: `docs/operations/INCIDENT_SEVERITY_MATRIX.md`
- Contract registry (referenced throughout matrix): `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md`
- Disaster recovery runbook (matrix response steps point here): `docs/operations/DISASTER_RECOVERY_RUNBOOK.md`
- Uptime monitoring checklist (matrix decision table mirrors checklist §2.4): `docs/operations/UPTIME_MONITORING_CHECKLIST.md`
- Phase 37 (F-33.6 origin — anchors S0 triggers): `docs/reports/PHASE_37_F_33_6_IMPLEMENTATION.md`
- Phase 41 (S0 HOLD security baseline — anchors §10.4 rationale): `docs/reports/PHASE_41_SECURITY_LOCKDOWN.md`
- Phase 44 (canary baseline — anchors thresholds): `docs/reports/PHASE_44_PRODUCTION_MONITORING_CANARY.md`
- Phase 47 (republish gap precedent — §8.1 worked example): `docs/reports/PHASE_47_POST_DEPLOY_READYZ_VERIFY.md`
- Phase 48 (registry baseline): `docs/reports/PHASE_48_PRODUCTION_CONTRACT_REGISTRY.md`
- Phase 49 (immutable snapshot — §8.2 worked example): `docs/reports/PHASE_49_IMMUTABLE_RUNTIME_SNAPSHOT.md`
- Phase 50 (disaster recovery runbook): `docs/reports/PHASE_50_DISASTER_RECOVERY_RUNBOOK.md`
- Phase 51 (uptime monitoring checklist): `docs/reports/PHASE_51_UPTIME_MONITORING_CHECKLIST.md`
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*Phase 52 production incident severity matrix baseline complete. Created `docs/operations/INCIDENT_SEVERITY_MATRIX.md` — a 14-section authoritative classification document covering 4 severity tiers (S0/S1/S2/S3) with 40 enumerated trigger conditions, numbered response procedures with time budgets, a 28-row symptom → severity decision table, three load-bearing rules positioned as governance-protected invariants (rollback-first §8, no-emergency-refactor §9, no-`npm audit fix --force` §10), 8 cross-cutting rules, and severity downgrade/upgrade governance. All content references existing project artifacts (Phases 37, 41, 44, 47, 48, 49, 50, 51) and governance contracts; no new operational policy invented. Validated against three worked examples (Phase 47, Phase 49, hypothetical CVE). Zero source touches. v1.0.0 public beta operations stack — contract registry + disaster runbook + uptime checklist + severity matrix — is now complete. Coincident republish (`ed813afab`) landed mid-phase; operations triad docs are now in deployed bundle. Launch state: GO, blockers 0, unchanged.*
