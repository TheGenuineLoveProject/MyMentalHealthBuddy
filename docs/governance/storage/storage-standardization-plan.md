# Storage Standardization Plan — Phase H2.2 (Documentation Only)

> **Status:** Forward, additive plan compiled 2026-05-30. **No code in this document.** Nothing here is implemented yet.
> **Primary Law:** Documentation only. This plan does not replace `localStorage`, does not add IndexedDB, does not add any persistence library, and does not modify runtime code.
> **Companions:** `storage-taxonomy.md` (inventory), `storage-risk-matrix.md` (risks).
> **Hard scope guard:** Any future implementation derived from this plan **must not touch** auth, journal, crisis, healing, chat, billing, dashboard, or admin flows. Those domains are documented in the taxonomy for awareness only and are **excluded** from migration scope.

---

## 1. Objective

Converge MMHB's decentralized, inconsistently-guarded browser-storage access (191 `localStorage` files) toward a **single, additive, guarded accessor** — adopted incrementally, lowest-risk surfaces first — without changing behavior for working code and without entering any excluded domain.

This directly addresses risks **R1/R2/R3** (unguarded, inconsistent, decentralized access) and unblocks **R4** (SSR readiness) from `storage-risk-matrix.md`.

---

## 2. Guiding constraints (non-negotiable)

- **Additive, not destructive.** Introduce a guarded accessor; do not rip out working call sites en masse. Migrate incrementally; every step is independently revertible.
- **No new dependency.** A guarded accessor is plain JS/TS over the existing `localStorage` API. No IndexedDB, no library.
- **No domain crossing.** Excluded flows (auth/admin/journal/crisis/healing/chat/billing/dashboard) are not migrated under this plan.
- **Behavior parity.** Normal-path behavior (what users experience when storage works) must be identical before and after each step.
- **Verify gate per step.** Each batch ends with `npm run verify:all` green + targeted HTTP checks before the next batch begins. One blocker at a time (kernel execution discipline).
- **Preserve business↔healing separation and crisis routing** in every touched surface.

---

## 3. Target shape (described, not coded)

A future guarded accessor would centralize:
- **Availability check** — detect storage presence once (private mode / disabled).
- **Safe get / set / remove** — try/catch wrapping, returning a typed fallback on failure instead of throwing.
- **Safe JSON** — defensive `parse`/`stringify` so malformed values (R10) degrade gracefully.
- **Optional namespace + version** — converge on one prefix and a version marker (R6/R7), applied only to in-scope keys.

This document intentionally stops at description. The concrete API, file location, and signatures are deferred to an authorized implementation phase.

---

## 4. Phased rollout (each additive + reversible)

| Phase | Scope | Why this order |
|---|---|---|
| **S1 — Introduce accessor (no call-site changes)** | Add the guarded accessor module only; nothing imports it yet. | Zero behavior change; pure addition. Fully revertible by deleting one file. |
| **S2 — Public preference keys** | Migrate appearance/UX preference keys (`theme`, `glp-mode`, `glp-calm-mode`, `glp-a11y-settings`, `glp-mood-background`) on public pages. | Lowest sensitivity, public surfaces, small blast radius. |
| **S3 — Public wellness progress (non-journal)** | Wellness/self-care progress keys not owned by excluded domains (e.g. `glp-challenge-progress`, `selfcare_streak`, `habits_completed_today`). | Public, additive; explicitly excludes journal/reflection keys. |
| **S4 — Public tools/monitors** | Tool/monitor data keys on public tool pages (e.g. `values_explorer_data`, `digital_detox_data`). | Self-contained per tool page. |
| **S5 — Hotspot reads hardening (in-scope contexts only)** | Add defensive reads where in-scope contexts/hooks read storage (e.g. `ReadingLevelContext`, Lumi theme/behavior hooks). | Highest leverage; excludes `AuthContext` (auth) and journal/emotion-as-clinical surfaces. |

**Explicitly NOT in this plan:** `AuthContext`/admin token keys (R5), journal/reflection keys, and any healing/chat/billing/dashboard surface. Those require separate, governed authorization.

---

## 5. Per-step verification plan (for the future implementation)

1. `node --check server/app.mjs` — server unaffected (sanity).
2. `npm run build` — `✓ built`.
3. `npm run verify:all` — expect `Summary: 121 pass, 0 warn, 0 fail` (or current baseline).
4. HTTP smoke on touched public routes (e.g. `/`, `/about`, `/features`, `/tools`, plus `/crisis` always-200): all `200`.
5. Reduced-motion / a11y unaffected on touched pages.
6. Behavior parity check: storage-available path identical; storage-unavailable path degrades gracefully (no crash).
7. `git status --short` — only the intended files changed.

---

## 6. Rollback model

- **S1** rolls back by deleting the single accessor file.
- **S2–S5** roll back per-batch by reverting the migrated call sites (each batch is small and isolated), or via platform checkpoint rollback.
- No step alters data shape destructively, so reverting code does not strand stored data.

---

## 7. Priority rationale

Ranked by **Impact × Risk Reduction × Dependency Order × Reversibility**: S1→S5 front-loads the highest-leverage, lowest-regret, fully-reversible work (resilience of public surfaces, SSR unblock) while deferring all governance-sensitive and excluded-domain storage to separate authorization.

---

## 8. Stop point

H2.2 is **documentation only**. No accessor exists yet, no call site is changed, no key is moved. Implementation of S1+ requires explicit, separate authorization. Crisis routing, business↔healing separation, and all excluded domains remain untouched.
