# MMHB Phase 36 — F-33.6 Crisis-Resource Resilience Plan

**Generated:** 2026-05-22
**HEAD at start:** `09890bb6c` (Phase 35 post-launch hardening ledger)
**Mode:** documentation only. No source modified. No refactor. No `npm audit fix --force`. No runtime systems touched.
**Source of truth:** Phase 35

---

## 1. Scope

Phase 36 produces the **implementation planning document** for F-33.6 — the Sprint 1 mandatory-first item from Phase 35 — and this phase report. F-33.6 will harden the `/crisis` route so the three BHCE resources (988 / 741741 / 911) are present in raw HTML and visible without JavaScript execution.

Phase 36 introduces **zero new contracts**, **zero new TODOs**, and **zero changes to the v1.0.0 GO decision**. The plan is implementation-ready for a future Phase 37 (the actual edit), which is **not** included here.

## 2. Deliverables

| File | Purpose | Size |
|---|---|---|
| `docs/operations/F_33_6_CRISIS_RESOURCE_RESILIENCE_PLAN.md` | 12-section implementation plan for F-33.6 | ~340 lines |
| `docs/reports/PHASE_36_F_33_6_CRISIS_RESOURCE_PLAN.md` | This phase report |
 — |

## 3. Plan document — section index

| § | Topic |
|---|---|
| 1 | Exact problem statement (with Phase 33 §3.9 evidence) |
| 2 | Why F-33.6 is Sprint 1 priority (6 reasons) |
| 3 | Current `/crisis` behavior (network + body + 5 failure modes) |
| 4 | Target behavior if JavaScript fails (acceptance properties) |
| 5 | Smallest safe implementation plan (Approach A preferred, B alternative; out-of-scope list) |
| 6 | Files likely to inspect before editing (12 files, all read-only in Phase 37) |
| 7 | Files likely to modify in a future phase (3 files, ~40–60 lines, zero deletions) |
| 8 | Exact verification commands (pre-merge / post-deploy / BHCE canary) |
| 9 | Rollback plan (trigger / 10-step action / safety / BHCE post-incident) |
| 10 | No clinical autonomy reminder (kernel-bound copy and a11y rules) |
| 11 | Launch state — re-confirmed (GO unchanged) |
| 12 | References |

## 4. Element coverage map (asked-for vs. delivered)

| Asked-for element | Section in plan doc |
|---|---|
| exact problem statement | §1 (with Phase 33 evidence block) |
| why F-33.6 is Sprint 1 priority | §2 (6-row reason table) |
| current `/crisis` behavior | §3 (network + body + 5 failure modes) |
| target behavior if JavaScript fails | §4 (post-fix state diagram + acceptance properties) |
| smallest safe implementation plan | §5 (Approach A preferred, B alternative, out-of-scope list) |
| files likely to inspect before editing | §6 (12-file table, read-only in Phase 37) |
| files likely to modify in a future phase | §7 (3 files, ~40–60 lines, zero deletions, zero refactors) |
| exact verification commands | §8 (pre-merge 5 gates + post-deploy + canary upgrade) |
| rollback plan | §9 (trigger + 10-step + safety + BHCE post-incident requirement) |
| no clinical autonomy reminder | §10 (kernel-bound copy + a11y + IP rules) |
| confirm launch remains GO | §11 (explicit GO re-confirmation) |

All 11 requested elements present.

## 5. Inspection grounding (Phase 36 inputs)

Phase 36 inspected the following source surfaces **read-only** to ground the §6 and §7 file lists in actual codebase reality. No file was modified.

```
client/index.html                                            (SPA shell)
client/src/pages/CrisisResources.jsx                          (hydrated crisis page)
client/src/components/CrisisStabilizer.jsx                    (crisis-adjacent UI)
client/src/lumi-crisis/resources/crisisResources.ts           (canonical resource records)
client/src/lumi-crisis/components/CrisisPanel.tsx             (hydrated panel)
client/src/lumi-crisis/components/CrisisTriggerDetector.ts    (detector)
client/src/lumi-crisis/governance/crisisSafetyRules.ts        (copy governance)
client/src/governance/interactions/CrisisOverrideEngine.ts    (override engine)
client/src/governance/interactions/CrisisLanguagePattern.ts   (language patterns)
client/src/companion-voice/engine/crisisDetector.ts           (companion-voice detector)
server/app.mjs                                                (lines 138, 280–350: CSP comment + SPA fallback)
server/routes/sop.mjs                                         (lines 110–135, 310–330: SPA cache SOP)
public/index.html, client/analytics/index.html, static-export/index.html  (adjacent shells)
```

**Confirmed findings:**
- The SPA shell at `client/index.html` is the correct edit surface for Approach A. The existing theme-bootstrap IIFE is prior art for an inline shell pattern.
- `server/app.mjs` serves the shell unmodified via `res.sendFile(indexFile)` (line 348); Approach A requires no server changes.
- `server/routes/sop.mjs` enforces `index.html` cache headers; a shell content edit does not break that SOP.
- The canonical crisis resource records live in `client/src/lumi-crisis/resources/crisisResources.ts`; fallback copy must match this source of truth.
- No `client/src/App.tsx` was found in the standard location — Phase 37 should confirm the actual root mount file (likely `client/src/main.tsx` or `client/src/AppRoot.tsx`) before adding the one-line `.js-loaded` effect.

## 6. Strict mode compliance

| Strict rule | Compliance |
|---|---|
| No source code modification | ✅ documentation only (2 markdown files) |
| No refactor | ✅ no code touched |
| No auth / db / UI / .replit / deployment config / infrastructure changes | ✅ none touched |
| No `npm audit fix --force` | ✅ not invoked |
| Phase 35 as source of truth | ✅ F-33.6 row in Phase 35 §2 + §3 + §4 + §5 is the spine of the plan |
| Documentation only | ✅ 2 markdown files only |
| Launch decision unchanged | ✅ §11 of plan + §8 of this report re-confirm GO |
| Zero new contracts / TODOs introduced | ✅ Phase 36 plans the existing F-33.6 ledger row; nothing new is created |

## 7. Governance kernel alignment

- **Primary law (domain isolation)** — Plan touches the crisis (BHCE) surface only. No business logic, no platform debugging, no healing-content drift.
- **BHCE override** — §1, §2, §3, §4, §9, §10 of the plan all center the three resources and the asymmetric err-toward-provision rule. §9.5 requires a 24h BHCE post-incident document on any rollback.
- **Smallest valid engine** — §5 Approach A is the smallest possible engine (one HTML file + one useEffect + one CSS rule). Approach B is documented but explicitly deferred.
- **Execution discipline** — §8 gates the merge with 5 shell commands + a 3-browser visual matrix. §9 enforces single-deploy rollback within 5 minutes. No multi-blocker.
- **Replit mode** — every gate runnable from the Shell tab. Rollback is a single click in Replit Deployments.
- **Output contract** — §1 problem stated with evidence; §4 acceptance properties enumerated; §7 expected file delta quantified (~40–60 lines, 0 deletions); §9 rollback steps numbered and verifiable. No speculation.
- **Circuit breaker** — §9.5 names the post-incident document; if F-33.6 rolls back 3× the governance kernel routes the item to architectural review rather than another patch attempt.

All 7 kernel clauses honored.

## 8. Launch state — re-confirmed

```
PRE-PHASE-36 STATE                       POST-PHASE-36 STATE
─────────────────────────                ────────────────────
v1.0.0 GO          ✅                    v1.0.0 GO          ✅  (unchanged)
Blockers           0                     Blockers           0  (unchanged)
Ledger             17 (Phase 35)         Ledger             17 (unchanged)
F-33.6             Sprint 1 #1           F-33.6             Sprint 1 #1, plan ready
BHCE gate          ✅                    BHCE gate          ✅ (canary upgrade staged)
New TODOs          —                     New TODOs          0
New contracts      —                     New contracts      0
```

Phase 36 does not deploy. Does not modify runtime. Does not change configuration. Phase 34's GO decision is intact and Phase 35's ledger is unchanged.

## 9. Phase 36 summary

| Gate | Result |
|---|---|
| F-33.6 implementation plan authored | ✅ `docs/operations/F_33_6_CRISIS_RESOURCE_RESILIENCE_PLAN.md` (12 sections) |
| Phase report authored | ✅ this file |
| All 11 required elements delivered | ✅ §4 element map |
| Files-to-inspect grounded in real codebase | ✅ §5 inspection grounding |
| Files-to-modify scoped to ≤3 files | ✅ §7 of plan |
| Smallest-engine selected (Approach A) | ✅ §5 of plan + §7 governance alignment |
| Verification gates concrete + Replit-native | ✅ §8 of plan |
| Rollback plan with 5-min SLO | ✅ §9 of plan |
| Clinical-autonomy reminder included | ✅ §10 of plan |
| Launch GO re-confirmed | ✅ §11 of plan + §8 of this report |
| Strict mode honored | ✅ §6 compliance table |
| Zero new contracts / TODOs introduced | ✅ pure planning |
| Governance kernel alignment | ✅ all 7 clauses honored |
| No source modified | ✅ documentation only |

**F-33.6 implementation plan: READY. v1.0.0 public beta launch: GO, unchanged.**

---

## 10. References

- F-33.6 Implementation Plan (this phase): `docs/operations/F_33_6_CRISIS_RESOURCE_RESILIENCE_PLAN.md`
- Phase 35 post-launch hardening ledger: `docs/operations/POST_LAUNCH_HARDENING_LEDGER.md`
- Phase 35 report: `docs/reports/PHASE_35_POST_LAUNCH_HARDENING_LEDGER.md`
- Phase 34 launch decision: `docs/launch/V1_PUBLIC_BETA_LAUNCH_DECISION.md`
- Phase 33 verification report (F-33.6 origin): `docs/reports/PHASE_33_HARDENING_VERIFICATION.md`
- Phase 30 launch approval matrix (BHCE veto authority): `docs/operations/LAUNCH_APPROVAL_MATRIX.md`
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*Phase 36 F-33.6 crisis-resource resilience plan complete. Documentation only. No source code, no refactor, no auth/db/UI/.replit/deployment-config/infrastructure changes. v1.0.0 launch state: GO, unchanged.*
