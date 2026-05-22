# MMHB Phase 32 — Production Hardening and Final Launch Stabilization

**Generated:** 2026-05-22
**HEAD at start:** `c30208d78` (Phase 31 T-1h sign-off packet)
**Mode:** documentation + verification planning only. No source modified. No refactor. No runtime systems touched.
**Evidence base:** verified Phases 21–31

---

## 1. Scope

Phase 32 establishes the **production hardening verification plan** — a single, executable checklist (`docs/operations/PRODUCTION_HARDENING_CHECKLIST.md`) covering Lighthouse readiness, accessibility, Core Web Vitals, image and bundle audits, SEO, structured data, robots/sitemap, dependency hygiene, dead-code detection, CSP, cache-control, monitoring, and incident escalation.

**Strict mode contract honored:** smallest-safe-fix-first; no architecture rewrite; no framework migration; no database redesign; no deployment topology changes; no speculative refactors; Replit-first; verification-first. Phase 32 produces zero source modifications — every finding is routed to the Phase 28 ledger for the next planning cycle.

## 2. Deliverables

| File | Purpose | Size |
|---|---|---|
| `docs/operations/PRODUCTION_HARDENING_CHECKLIST.md` | 18-section verification plan | ~510 lines |
| `docs/reports/PHASE_32_PRODUCTION_HARDENING.md` | This report — Phase 32 marker |
 — |

## 3. Checklist — section index

| § | Topic | Type |
|---|---|---|
| 1 | Lighthouse readiness checklist (5 categories, 5 routes, target bands) | scored gate |
| 2 | Accessibility verification matrix (12 checks, WCAG AA + BHCE) | binary gate |
| 3 | Core Web Vitals targets (LCP/INP/CLS/FCP/TTFB, per-route) | scored gate |
| 4 | Image optimization audit (4 inventory commands, 7-row checklist) | inventory + audit |
| 5 | Bundle-size audit (6 verification commands, 7-row budget table) | budget gate |
| 6 | Route-by-route SEO checklist (5 meta commands, 8-route matrix) | binary gate |
| 7 | Structured data validation (extraction + Rich Results Test) | validation |
| 8 | robots / sitemap verification (5 commands, 7-row checklist) | binary gate |
| 9 | Dependency hygiene verification (4 commands, 5-row audit) | binary gate |
| 10 | Unused asset / dead-code detection (6 commands, 5-row checklist) | inventory + audit |
| 11 | CSP verification (3 commands, 8-row audit) | binary gate |
| 12 | Cache-control verification (5 commands, 6-row audit) | binary gate |
| 13 | Final production monitoring checklist (12 signals + 4-window pulse rotation) | procedure |
| 14 | Post-launch incident escalation map (decision tree + contacts + artifacts) | procedure |
| 15 | Replit-native verification commands index | tool inventory |
| 16 | Findings → triage routing (format + routing rules) | procedure |
| 17 | Sign-off (consultative; no signature surface) | meta |
| 18 | References | links |

## 4. Element coverage map (asked for vs. delivered)

| Asked-for element | Section in checklist |
|---|---|
| lighthouse readiness checklist | §1 |
| accessibility verification matrix | §2 (12 checks) |
| Core Web Vitals targets | §3 (LCP/INP/CLS/FCP/TTFB per route) |
| image optimization audit | §4 (inventory + 7-row checklist) |
| bundle-size audit | §5 (6 commands + 7-row budget table) |
| route-by-route SEO checklist | §6 (8-route matrix) |
| structured data validation | §7 |
| robots/sitemap verification | §8 |
| dependency hygiene verification | §9 |
| unused asset detection | §10 |
| CSP verification | §11 |
| cache-control verification | §12 |
| final production monitoring checklist | §13 (12 signals + pulse rotation) |
| post-launch incident escalation map | §14 (decision tree + contacts + artifact deadlines) |
| Replit-native verification commands only | §15 (tool inventory — every command verified Replit-native) |

All 15 requested elements are present.

## 5. Strict mode compliance

Every element of the strict mode contract is honored:

| Strict rule | Compliance |
|---|---|
| Smallest-safe-fix-first | §16 routes findings to smallest engine first; no architectural changes proposed |
| No architecture rewrite | zero new contracts; verification surface only |
| No framework migration | TODO-22.1 (Express 4→5) remains ledgered, not actioned |
| No database redesign | zero database content in this phase |
| No deployment topology changes | TODO-18.1 (www→apex) and TODO-18.4 (dup HSTS) ledgered, not actioned |
| No speculative refactors | every finding routes to the Phase 28 ledger for triage |
| Replit-first | §15 tool inventory confirms every command Replit-native |
| Verification-first | every section is read-only verification; zero mutating operations |

## 6. Source-of-truth + baseline traceability

Every gate in the hardening checklist traces back to either a verified Phase 21–31 baseline or a well-known industry standard:

| Hardening gate | Source |
|---|---|
| Lighthouse Performance ≥ 85 | industry standard + Phase 23 baseline (~185 ms TTFB) |
| Accessibility WCAG AA | user preference (`replit.md`) + Lighthouse a11y |
| Core Web Vitals "Good" bands | web.dev / Chrome UX Report standard |
| Image inventory commands | Phase 26 baseline (35 MB dist, 14.8 MB avatars → TODO-26.1) |
| Bundle budgets | Phase 24 (8 vendor chunks, 99 KB gz init) + Phase 25 (60 KB gz CSS) |
| SEO matrix | Lighthouse SEO category |
| Structured data audit | Google Rich Results Test + MMHB v7.4 kernel (no MedicalEntity) |
| robots/sitemap verification | Phase 29 §2.8 |
| Dependency audit | Phase 22 baseline + Phase 28 ledger (TODO-22.1, 22.2) |
| Dead-code detection | non-destructive (user preference) |
| CSP audit | Phase 18 baseline (HSTS verified, TODO-18.4 dup) |
| Cache-control | BHCE adjacency for `/crisis` |
| Monitoring | Phase 23 (probes) + Phase 27 (runbook) + Phase 29 (probe checklist) |
| Incident escalation | Phase 29 §5 severity matrix + Phase 27 §3 on-call |

Zero new contracts introduced. The hardening checklist is a verification lens; every standard it applies already exists either in Phases 21–31 or in established industry guidance.

## 7. Governance alignment

- **Primary law (domain isolation)** — §11 (CSP) and §12 (cache-control) explicitly flag `/crisis` as BHCE-adjacent. §2 row 12 mandates trauma-informed language audit. §7 forbids `MedicalEntity` schema per kernel.
- **BHCE override** — §2 row 1 (accessibility) demands A11y = 100 on `/crisis`. §12 row 3 makes `/crisis` cache-control a launch blocker. §13 row 8 mandates hourly `/crisis` canary through T+72h. §14 decision tree branches BHCE-first.
- **Smallest valid engine** — §16 triage routing explicitly prefers ledger entries over source changes; only hard launch blockers escalate immediately. Fix discipline: CSS fix > React patch > new component > new page > new service.
- **Execution discipline** — every command is read-only. §10 audit explicitly non-destructive per user preference. §16 routes findings to triage rather than direct action.
- **Replit mode** — §15 tool inventory confirms every command Replit-native (curl, grep, find, du, md5sum, npm, npx lighthouse, gzip; plus workflows / secrets / deployment-history panels and `fetch_deployment_logs`).
- **Output contract** — every section produces structured outputs (pass/fail, command outputs, score bands). §16 standardizes finding format with TODO-ID, severity, source, evidence, sprint, owner.
- **Circuit breaker** — §14 mandates post-incident artifacts with explicit deadlines (P0 BHCE: 24h; P0: 48h; P1: 7d) so 3×-recurrence rule has data to evaluate against.

All 7 kernel clauses honored.

## 8. Findings ledger (this phase)

Phase 32 produces no new TODOs. It re-anchors and cross-references the following already-ledgered items from Phase 28 within the hardening lens:

| Existing TODO | Hardening §  | Why surfaced |
|---|---|---|
| TODO-26.1 (AVIF avatars) | §4 row 3, §5 row 6 | image optimization + dist size |
| TODO-26.2 (AVIF logos) | §4 row 3, §5 row 6 | image optimization + dist size |
| TODO-26.3 (de-dupe pairs) | §4 row 5, §10 row 2 | image optimization + dead-code detection |
| TODO-26.4 (consolidate avatar dirs) | §10 row 1 | unused asset surface |
| TODO-24.1 (split WellnessDashboard) | §5 row 2 | bundle ceiling guard |
| TODO-24.3 (split _autopilot / AdvancedToolsPage) | §5 row 2 | bundle ceiling guard |
| TODO-24.2 (Sentry sourcemap upload) | §5 row 4 | source map governance |
| TODO-23.1 (Prometheus `/metrics`) | §13 row 6 | metrics standardization |
| TODO-22.1 (Express 4→5) | §9 row 4 | dependency hygiene |
| TODO-22.2 (OTel cluster) | §9 row 5, §13 row 5 | dependency + observability |
| TODO-18.1 (www → apex 301) | (cross-doc) | edge consolidation |
| TODO-18.4 (duplicate HSTS) | §11 row 6 | security header hygiene |

**Net new TODOs:** 0. The hardening checklist surfaces existing work; it does not create new commitments.

## 9. Phase 32 summary

| Gate | Result |
|---|---|
| Hardening checklist authored | ✅ `docs/operations/PRODUCTION_HARDENING_CHECKLIST.md` (18 sections) |
| Phase report authored | ✅ this file |
| All 15 required elements delivered | ✅ §4 element map |
| All gates traced to baseline or industry standard | ✅ §6 traceability table |
| Strict mode rules honored | ✅ §5 compliance table (all 8 rules) |
| Zero new contracts introduced | ✅ no new TODOs created |
| Governance kernel alignment | ✅ all 7 clauses honored |
| No source modified / no refactor / no runtime systems touched | ✅ documentation only |

**Production hardening verification plan: ESTABLISHED. Ready for execution at T-1h and post-launch monitoring rotation.**

---

## 10. TODO ledger pointer (unchanged)

Full ledger: `docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md`.

- **S0:** 0
- **S1:** 4 (TODO-26.1, 26.2, 22.1, 22.2)
- **S2:** 5 (TODO-26.4, 24.1, 24.3, 23.1, 18.1)
- **S3:** 3 (TODO-26.3, 18.4, 24.2)
- **Total open:** 12 | **Retired:** 1 (TODO-23.2)

Phase 32 adds **zero** new TODOs. The hardening checklist is the verification contract; routing produces ledger entries only when concrete findings are observed in a subsequent execution cycle.

---

## 11. References

- Production Hardening Checklist: `docs/operations/PRODUCTION_HARDENING_CHECKLIST.md` (this phase)
- Launch Approval Matrix: `docs/operations/LAUNCH_APPROVAL_MATRIX.md` (Phase 30)
- T-1h Sign-Off Packet: `docs/operations/T_MINUS_1H_LAUNCH_SIGNOFF.md` (Phase 31)
- Production Probe Checklist: `docs/operations/PRODUCTION_PROBE_CHECKLIST.md` (Phase 29)
- Post-Launch TODO Ledger: `docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md` (Phase 28)
- Launch Operations Runbook: `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md` (Phase 27)
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*Phase 32 production hardening verification plan complete. Documentation + verification planning only. No source code, no refactor, no auth/db/routes/UI/.replit/deployment-config/infrastructure changes. Smallest-safe-fix-first discipline preserved.*
