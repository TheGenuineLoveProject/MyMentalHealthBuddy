# MMHB Phase 28 — Post-Launch TODO Ledger

**Generated:** 2026-05-22
**Scope:** consolidation of every deferred TODO accumulated across Phases 18–27
**Mode:** documentation only. No source modified. No refactor.
**Status:** active backlog, ordered by impact × risk × effort

This ledger is the single source of truth for post-launch optimization work. Each item carries: origin phase, category, severity, estimated effort, estimated impact, dependencies, and the verification gate the change must pass before being declared complete.

> **Governance constraint:** no item in this ledger may be picked up under launch-window pressure (T-24h through T+72h). Items are post-stable-launch work only. The Launch Operations Runbook (Phase 27, §0) takes precedence during the launch window.

---

## 1. Severity legend

| Tier | Meaning |
|---|---|
| **S0** | Blocks launch or user safety. Currently: **none** — all S0 items closed by Phases 21–27. |
| **S1** | User-facing perf / cost / security impact. Schedule within 30 days of stable launch. |
| **S2** | Operational hygiene or dev-experience. Schedule within 90 days. |
| **S3** | Cosmetic / nice-to-have. Address opportunistically. |

## 2. Effort legend

| Code | Meaning |
|---|---|
| **XS** | < 1 hour — panel toggle or single-file edit |
| **S**  | 1–4 hours — focused single-system change |
| **M**  | 1–2 days — multi-file change with verification gate |
| **L**  | 3–5 days — version-major upgrade or coordinated rollout |
| **XL** | 1+ week — architectural |

---

## 3. The ledger (priority-ordered)

### TODO-26.1 — AVIF/WebP siblings for 11 avatar region PNGs ⭐ highest impact

- **Origin:** Phase 26 (static asset governance)
- **Category:** asset weight / perf
- **Severity:** **S1**
- **Effort:** **S**
- **Estimated impact:** ~14.8 MB raw → ~5 MB AVIF (≈ 66% reduction on the single largest asset cluster)
- **Detail:** 11 `MMHB_FLOAT_IDLE_UNIT_v1_region_*.png` files at ~1.35 MB each form ~50% of all PNG bytes in `client/dist`. Generate AVIF + WebP siblings, render via `<picture>` with format fallback chain (AVIF → WebP → PNG).
- **Verification gate:** Phase 26 contract — total `client/dist` drops below 25 MB; no visual regression on Float Idle mascot in light/dark + reduced-motion.
- **Dependencies:** none
- **Risk:** low — additive only, original PNG retained as fallback

### TODO-26.2 — AVIF/WebP/SVG for brand logos

- **Origin:** Phase 26
- **Category:** asset weight / perf
- **Severity:** **S1**
- **Effort:** **S** (or **M** if SVG re-tracing required)
- **Estimated impact:** 3.6 MB combined (2.0 MB + 1.6 MB) → ~400 KB est (≈ 89% reduction)
- **Detail:** `mmhb_brand_logo_lockup_*.png` and `thegenuineloveproject_logo_v2_*.png`. Prefer SVG if vector source exists; otherwise AVIF + WebP siblings.
- **Verification gate:** Phase 26 contract; logo crispness verified at 1×, 2×, 3× DPR.
- **Dependencies:** access to vector source (designer / Figma)
- **Risk:** low

### TODO-22.1 — `express` 4 → 5 major upgrade

- **Origin:** Phase 22 (safe package stabilization)
- **Category:** dependency / security maintenance
- **Severity:** **S1**
- **Effort:** **L** (breaking-change migration: router behavior, error handling, async handlers)
- **Estimated impact:** stays on a supported major; closes the major-version deferral carried since Phase 22.
- **Detail:** Express 5 changes default async error handling, removes deprecated APIs, changes path-to-regexp behavior. Migration must be done outside any launch window with full route smoke-test against `docs/reports/probe-routes.md`.
- **Verification gate:** all probe routes 200, all integration tests pass, no behavioral regression on the 326 `lazy()` route boundaries.
- **Dependencies:** none
- **Risk:** medium — coordinated with route-level tests

### TODO-22.2 — OpenTelemetry cluster coordinated bump

- **Origin:** Phase 22
- **Category:** observability dependency
- **Severity:** **S1**
- **Effort:** **M**
- **Detail:** OTel ecosystem packages (api, sdk-node, instrumentations, exporters) must move together. Phase 22 deferred this because partial bumps cause silent telemetry gaps.
- **Verification gate:** trace + metric + log signals visible end-to-end after bump; no schema drift on the `/healthz` and `/readyz` probes; baseline TTFB (~185 ms from Phase 23) unchanged ±10%.
- **Dependencies:** observability backend version compatibility check
- **Risk:** medium — silent telemetry loss is the failure mode

### TODO-26.4 — Consolidate 6 parallel avatar-region source directories

- **Origin:** Phase 26
- **Category:** repo hygiene
- **Severity:** **S2**
- **Effort:** **M**
- **Detail:** Avatar regions exist in 6 parallel directories across `public/`, `client/public/`, `client/dist/`, and version-snapshot folders. Reduce to 1 canonical source-tree copy + dist output. No on-the-wire impact, but eliminates "which copy do I update?" friction during future brand revisions.
- **Verification gate:** all references in JSX/TSX still resolve; build PASS; no 404s on the asset-404 smoke loop in the runbook §3.2.
- **Dependencies:** none
- **Risk:** medium — incorrect ref rewrite causes 404s

### TODO-24.1 — Split `WellnessDashboard` if it grows past 350 KB raw

- **Origin:** Phase 24 (bundle governance)
- **Category:** bundle budget
- **Severity:** **S2** (conditional — currently at 275 KB raw, 88 KB gz, under budget)
- **Effort:** **S**
- **Detail:** Trigger only if the chunk crosses the 350 KB raw / 100 KB gz threshold. Use Vite `manualChunks` to split by feature-area within the dashboard.
- **Verification gate:** Phase 24 budget table — largest chunk back under threshold; initial path still ≤ 150 KB gz.
- **Dependencies:** ongoing measurement via the weekly post-launch perf re-baseline (runbook §7).
- **Risk:** low — additive split only

### TODO-24.3 — Split `_autopilot` / `AdvancedToolsPage` if either grows past 350 KB raw

- **Origin:** Phase 24
- **Category:** bundle budget
- **Severity:** **S2** (conditional — currently 258 KB and 210 KB raw, both under budget)
- **Effort:** **S**
- **Detail:** Same trigger and approach as TODO-24.1, applied per-chunk.
- **Verification gate:** same as TODO-24.1.
- **Dependencies:** weekly measurement.
- **Risk:** low

### TODO-23.1 — `/metrics` endpoint → Prometheus exposition format

- **Origin:** Phase 23 (perf + observability baseline)
- **Category:** observability
- **Severity:** **S2**
- **Effort:** **M**
- **Detail:** Promote the current internal metrics surface to standard Prometheus text format so any compliant scraper can ingest without custom adapters. Coordinate scrape interval with the OTel cluster (TODO-22.2).
- **Verification gate:** `curl /metrics` returns valid Prometheus text format; scrape from a Prometheus-compatible client succeeds; no PII / secrets in any series label.
- **Dependencies:** preferably done after TODO-22.2 (OTel bump) to avoid double-migration of the metrics pipeline.
- **Risk:** low — additive endpoint

### TODO-18.1 — www → apex 301 redirect (panel toggle)

- **Origin:** Phase 18 (network edge baseline)
- **Category:** SEO / canonicalization
- **Severity:** **S2**
- **Effort:** **XS**
- **Detail:** Both `mymentalhealthbuddy.com` and `www.mymentalhealthbuddy.com` currently return 200. Configure www → apex 301 in the Replit domains panel to consolidate SEO signal on the apex and prevent duplicate-content split.
- **Verification gate:** `curl -I https://www.mymentalhealthbuddy.com/` returns 301 with `Location: https://mymentalhealthbuddy.com/...`; apex still 200; HSTS still present (and ideally TODO-18.4 closed at the same time).
- **Dependencies:** Replit domains panel access (no code change).
- **Risk:** very low — panel toggle, reversible

### TODO-26.3 — De-dupe 4 byte-identical pairs in `client/dist`

- **Origin:** Phase 26
- **Category:** asset hygiene
- **Severity:** **S3**
- **Effort:** **XS**
- **Estimated impact:** ~2.7 MB
- **Detail:** 4 pairs are byte-identical between `client/dist/lumi/official/` and `client/dist/brand/v17/` (lumi-emotion-orb ↔ benefit-understanding, lumi-companion ↔ benefit-companionship, lumi-path ↔ benefit-growth, lumi-soft-presence ↔ benefit-relief). Refactor brand-card source to import from `lumi/official/`, or symlink.
- **Verification gate:** Phase 26 inventory — duplicate pair count drops from 4 to 0; build PASS; no 404 on either path family.
- **Dependencies:** none
- **Risk:** low

### TODO-18.4 — Duplicate HSTS header (cosmetic)

- **Origin:** Phase 18
- **Category:** HTTP hygiene
- **Severity:** **S3**
- **Effort:** **XS**
- **Detail:** Edge currently emits HSTS twice (one from Replit edge, one from the app). Browsers honor the strictest of the two, so there is **no security impact** — purely cosmetic. Investigate origin (Replit edge config vs. app middleware) and suppress whichever is the redundant emitter.
- **Verification gate:** `curl -I` shows exactly one `Strict-Transport-Security` header with `max-age >= 31536000; includeSubDomains; preload`.
- **Dependencies:** identify edge vs. app emitter (read-only investigation, no behavior change).
- **Risk:** very low

### TODO-24.2 — Source-map upload to Sentry release artifacts

- **Origin:** Phase 24
- **Category:** observability (optional)
- **Severity:** **S3**
- **Effort:** **M**
- **Detail:** Production currently ships with `sourcemap: false` — the secure default verified in Phase 24. For richer Sentry stack traces, emit maps separately during build and upload to Sentry release artifacts **without** serving them publicly. Maintains the no-public-source-map security contract.
- **Verification gate:** Sentry shows resolved (non-minified) frames on a deliberately-thrown test error; `find client/dist -name "*.map"` still returns 0 after deploy (maps uploaded then discarded from public output).
- **Dependencies:** Sentry project + release token (managed via secrets panel).
- **Risk:** low if upload+discard sequence is enforced; high if a map ever leaks into the public dist (defeats Phase 24 contract).

---

## 4. Closed / retired

| TODO | Origin | Closed by | Notes |
|---|---|---|---|
| TODO-23.2 | Phase 23 | **Phase 25** | CSS purge audit — pipeline verified well-tuned (60 KB gz on wire, purge config correct, 0 duplicate selectors, near-zero vendor prefix). No source change recommended. |

---

## 5. Roll-up by severity

| Severity | Count | Items |
|---|---|---|
| S0 | 0 | (none) |
| **S1** | **4** | TODO-26.1, 26.2, 22.1, 22.2 |
| **S2** | **5** | TODO-26.4, 24.1, 24.3, 23.1, 18.1 |
| **S3** | **3** | TODO-26.3, 18.4, 24.2 |
| **Total open** | **12** | |
| Retired | 1 | TODO-23.2 |

## 6. Recommended scheduling

### Sprint 1 (T+7d → T+14d post-stable-launch)

Highest impact-to-effort items, all low-risk:

1. **TODO-18.1** (XS) — www→apex 301, panel toggle
2. **TODO-26.1** (S) — AVIF/WebP for avatar regions
3. **TODO-26.2** (S) — AVIF/WebP/SVG for brand logos
4. **TODO-26.3** (XS) — de-dupe 4 byte-identical pairs
5. **TODO-18.4** (XS) — duplicate HSTS investigation

**Combined expected impact:** ~17 MB reduction in shipped asset weight + SEO consolidation + cosmetic HTTP hygiene.

### Sprint 2 (T+14d → T+30d)

Medium-effort observability + dependency work:

6. **TODO-22.2** (M) — OTel coordinated bump
7. **TODO-23.1** (M) — Prometheus `/metrics` (after TODO-22.2)
8. **TODO-26.4** (M) — consolidate avatar source directories

### Sprint 3 (T+30d → T+60d)

Larger / conditional items:

9. **TODO-22.1** (L) — Express 4→5 (outside any launch window, full probe smoke required)
10. **TODO-24.2** (M) — Sentry sourcemap upload (optional)

### Conditional / measurement-driven

11. **TODO-24.1** — only if `WellnessDashboard` > 350 KB raw on weekly re-baseline
12. **TODO-24.3** — only if `_autopilot` or `AdvancedToolsPage` > 350 KB raw on weekly re-baseline

These are governed by the weekly post-launch perf re-baseline in Launch Operations Runbook §7.

## 7. Governance alignment

Every item in this ledger honors the MMHB v7.4 Archival Kernel:

- **Primary law** — no item mixes healing and business domain logic. Each TODO is scoped to a single domain (assets, observability, dependencies, HTTP hygiene).
- **Smallest valid engine** — items are sized by the smallest engine that delivers the change (panel toggle > additive sibling files > targeted upgrade > coordinated cluster bump > major-version migration).
- **BHCE override** — no item touches `/crisis`, 988, 741741, or 911 routing. If any work in this ledger inadvertently affects crisis surfaces, it must be halted and reclassified as S0 immediately.
- **Execution discipline** — every item has an explicit verification gate. No item is declared complete on intent alone.
- **Replit-safe execution** — all items implementable via panel toggles, additive file generation, `npm run db:push`, or coordinated dependency upgrades. No Docker, no manual SQL, no virtualenvs.
- **Circuit breaker** — items 24.1 and 24.3 are explicitly measurement-gated against the weekly post-launch baseline, so the 3×-recurrence rule has objective data.

## 8. Phase 28 summary

| Gate | Result |
|---|---|
| All deferred TODOs from Phases 18–27 enumerated | ✅ 12 open + 1 retired |
| Each item carries origin / severity / effort / impact / verification gate | ✅ |
| Roll-up by severity provided | ✅ (S1×4, S2×5, S3×3) |
| Recommended scheduling provided | ✅ 3 sprints + conditional bucket |
| Governance kernel alignment audited | ✅ all 6 clauses honored |
| No source modified / no refactor / no auth-db-routes-UI-deployment-infra touched | ✅ documentation only |

**Post-launch TODO ledger: ESTABLISHED. Backlog ready for sprint planning.**

---

## 9. References

- Launch Operations Runbook: `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md`
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`
- Phase 18 baseline: `docs/reports/PHASE_18_*` (network edge)
- Phase 22 baseline: `docs/reports/PHASE_22_*` (package stabilization)
- Phase 23 baseline: `docs/reports/PHASE_23_*` (perf + observability)
- Phase 24 baseline: `docs/reports/PHASE_24_*` (bundle governance)
- Phase 25 baseline: `docs/reports/PHASE_25_*` (CSS purge audit)
- Phase 26 baseline: `docs/reports/PHASE_26_*` (static asset governance)
- Phase 27 runbook: `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md`

---

*Phase 28 post-launch TODO ledger complete. Documentation only. No source code, no refactor, no auth/db/routes/UI/.replit/deployment-config/infrastructure changes.*
