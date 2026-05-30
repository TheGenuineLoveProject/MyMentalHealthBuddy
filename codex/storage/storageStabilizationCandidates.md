# Storage Stabilization Candidates — Phase H2.5 (ANALYSIS ONLY)

> **Mode:** STABILIZATION CANDIDATE GOVERNANCE — analysis only, no runtime change, no wrapper, no centralization, no migration.
> **Sources:** `codex/storage/storageUsageAudit.json`, `codex/storage/storageHotspotClusters.json`.
> **Generated at:** 2026-05-30T22:55:36.535Z.
> **No runtime change · no wrapper · no centralization · no migration.** Candidates are future-safe observations only.

## Explicitly excluded domains (never candidates)

`admin`, `auth`, `billing`, `chat`, `crisis`, `dashboard`, `healing`, `journal`, `provider`.

## Candidate gates (ALL must hold)

- public-safe
- non-sensitive
- non-excluded/non-cross-domain
- low coupling (single domain)
- low blast radius (≤3 findings)
- hydration-safe
- SSR-safe
- isolated
- fully migration-allowed

## Summary

| Metric | Value |
| --- | --- |
| Public baseline files considered | 17 |
| Qualified candidates | 0 |
| Near-miss public files (gated) | 17 |
| By complexity | {} |
| By future-safe priority | {} |

## Qualified stabilization candidates

_No file meets all lowest-blast-radius gates. See near-miss table for the closest public files and their blockers._

## Near-miss public files (observe-only; gated by listed blockers)

| File | Keys | Domain | Findings | Blocked by | SSR risk | Hydration risk | Governance |
| --- | --- | --- | --- | --- | --- | --- | --- |
| client/src/components/layout/Header.jsx | glp-mode | ux-preferences | 2 | hydration risk present | low (file carries window/storage guard) | present (read in init/render) — stabilize hydration first | Public but gated by: hydration risk present. Observe only. |
| client/src/components/lumi/LumiCompanion.jsx | (dynamic) | lumi-ux | 1 | SSR risk present (no window guard) | present (no window guard) — stabilize guard first | low (no init/render-time read detected) | Public but gated by: SSR risk present (no window guard). Observe only. |
| client/src/components/WellnessScore.jsx | last_wellness_score | wellness-progress | 2 | SSR risk present (no window guard) | present (no window guard) — stabilize guard first | low (no init/render-time read detected) | Public but gated by: SSR risk present (no window guard). Observe only. |
| client/src/lumi-memory/state/memoryStore.ts | (dynamic) | lumi-ux | 3 | SSR risk present (no window guard) | present (no window guard) — stabilize guard first | low (no init/render-time read detected) | Public but gated by: SSR risk present (no window guard). Observe only. |
| client/src/pages/pathways/CalmPlan.jsx | glp_calm_plan | ux-preferences | 1 | SSR risk present (no window guard) | present (no window guard) — stabilize guard first | low (no init/render-time read detected) | Public but gated by: SSR risk present (no window guard). Observe only. |
| client/src/components/AccessibilityToolbar.jsx | glp-a11y-settings | ux-preferences | 3 | hydration risk present; SSR risk present (no window guard) | present (no window guard) — stabilize guard first | present (read in init/render) — stabilize hydration first | Public but gated by: hydration risk present; SSR risk present (no window guard). Observe only. |
| client/src/components/DigitalDetox.jsx | digital_detox_data | tools-monitors | 3 | hydration risk present; SSR risk present (no window guard) | present (no window guard) — stabilize guard first | present (read in init/render) — stabilize hydration first | Public but gated by: hydration risk present; SSR risk present (no window guard). Observe only. |
| client/src/components/GoalProgress.jsx | wellness_goals | wellness-progress | 2 | hydration risk present; SSR risk present (no window guard) | present (no window guard) — stabilize guard first | present (read in init/render) — stabilize hydration first | Public but gated by: hydration risk present; SSR risk present (no window guard). Observe only. |
| client/src/components/SelfCompassion.jsx | self_compassion_data | tools-monitors | 2 | hydration risk present; SSR risk present (no window guard) | present (no window guard) — stabilize guard first | present (read in init/render) — stabilize hydration first | Public but gated by: hydration risk present; SSR risk present (no window guard). Observe only. |
| client/src/components/SleepTracker.jsx | sleep_history | tools-monitors | 2 | hydration risk present; SSR risk present (no window guard) | present (no window guard) — stabilize guard first | present (read in init/render) — stabilize hydration first | Public but gated by: hydration risk present; SSR risk present (no window guard). Observe only. |
| client/src/components/StressMonitor.jsx | stress_monitor_data | tools-monitors | 2 | hydration risk present; SSR risk present (no window guard) | present (no window guard) — stabilize guard first | present (read in init/render) — stabilize hydration first | Public but gated by: hydration risk present; SSR risk present (no window guard). Observe only. |
| client/src/components/ui/CalmModeToggle.jsx | glp-calm-mode | ux-preferences | 4 | blast radius >3 findings; hydration risk present | low (file carries window/storage guard) | present (read in init/render) — stabilize hydration first | Public but gated by: blast radius >3 findings; hydration risk present. Observe only. |
| client/src/components/WorryTimeScheduler.jsx | worry_time_data | tools-monitors | 2 | hydration risk present; SSR risk present (no window guard) | present (no window guard) — stabilize guard first | present (read in init/render) — stabilize hydration first | Public but gated by: hydration risk present; SSR risk present (no window guard). Observe only. |
| client/src/pages/GrowthAnalyticsPage.tsx | (dynamic) | analytics | 6 | blast radius >3 findings; SSR risk present (no window guard) | present (no window guard) — stabilize guard first | low (no init/render-time read detected) | Public but gated by: blast radius >3 findings; SSR risk present (no window guard). Observe only. |
| client/src/components/HabitTracker.jsx | habit_streaks, habits_completed_today, habits_last_date, wellness_habits | wellness-progress | 12 | blast radius >3 findings; hydration risk present; SSR risk present (no window guard) | present (no window guard) — stabilize guard first | present (read in init/render) — stabilize hydration first | Public but gated by: blast radius >3 findings; hydration risk present; SSR risk present (no window guard). Observe only. |
| client/src/components/SelfCareChecklist.jsx | selfcare_completed, selfcare_date, selfcare_streak, selfcare_total_points | wellness-progress | 13 | blast radius >3 findings; hydration risk present; SSR risk present (no window guard) | present (no window guard) — stabilize guard first | present (read in init/render) — stabilize hydration first | Public but gated by: blast radius >3 findings; hydration risk present; SSR risk present (no window guard). Observe only. |
| client/src/components/ValuesExplorer.jsx | values_explorer_data | tools-monitors | 4 | blast radius >3 findings; hydration risk present; SSR risk present (no window guard) | present (no window guard) — stabilize guard first | present (read in init/render) — stabilize hydration first | Public but gated by: blast radius >3 findings; hydration risk present; SSR risk present (no window guard). Observe only. |

---

**Scope note:** This report is governance/observation only. It modifies no runtime code, replaces no storage mechanism, adds no wrapper/library, centralizes nothing, and migrates nothing. Excluded domains (auth, healing, crisis, journal, provider, billing, dashboard, admin, chat) are never listed as candidates. Crisis routing and business↔healing separation are unaffected. Companion docs: `docs/governance/storage/`, `codex/storage/`.
