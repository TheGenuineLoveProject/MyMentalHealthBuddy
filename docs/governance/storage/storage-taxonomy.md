# Storage Taxonomy — Phase H2.2 (Documentation Only)

> **Status:** Reality-only inventory of MMHB's browser-storage usage, compiled 2026-05-30 from the current green state.
> **Primary Law:** Documentation and inventory only. This document changes no runtime code, replaces no `localStorage`, adds no IndexedDB, and introduces no persistence library.
> **Scope guard:** This taxonomy *describes and classifies* existing usage. It prescribes nothing for auth, journal, crisis, healing, chat, billing, dashboard, or admin flows — those domains are catalogued for awareness only and are explicitly out of scope for any future change (see `storage-standardization-plan.md`).
> **Legend:** **VERIFIED** = observed in code today · **PARTIAL** = present but inconsistent · **MISSING** = absent · **FUTURE** = not built.

---

## 1. Mechanisms in use (VERIFIED)

| Mechanism | Distinct client files | Notes |
|---|---|---|
| `localStorage` | **191** | Dominant persistence mechanism on the client. |
| `sessionStorage` | **19** | Narrow, mostly ephemeral/per-tab usage. |
| IndexedDB | 0 | Not used. Out of scope to add (H2.2 rule). |
| Cookies (client-set) | n/a here | Session/auth cookies are server-managed (see `runtime-topology.md`); not part of this client-storage taxonomy. |

There is **no single canonical storage wrapper** module in `client/src` today (**MISSING**). Access happens directly via `localStorage.*` / `window.localStorage.*` at call sites. A recurring inline safe-write idiom `try { … } catch (err) { console.warn("[storage-safe-write]", err); }` appears in some hotspots (e.g. `main.jsx`, `context/EmotionContext.jsx`) but is **not applied uniformly** (**PARTIAL**).

> Guard-pattern signal: ~306 client files contain `typeof window`, `typeof localStorage`, or a `catch`. This is a **superset** (any try/catch counts), so it is **not** evidence of consistent storage guarding. Treat guard coverage as **PARTIAL / unverified per-site**, not "306 guarded".

---

## 2. Classification by access pattern (VERIFIED)

- **Raw / unguarded direct access** — e.g. `context/AuthContext.jsx` reads/writes `localStorage.getItem(key)` / `setItem(key, value)` without a try/catch. Throws if storage is unavailable.
- **`window.localStorage.*` form** — e.g. `sections/ValueProposition.jsx`, `sections/EmailCapture.jsx`. Functionally equivalent; same unguarded exposure unless wrapped.
- **Inline safe-write idiom** — `main.jsx`, `context/EmotionContext.jsx` wrap writes/removes in try/catch with a `[storage-safe-write]` warn. The reads in the same files are not always wrapped.
- **Module-scoped sync buffers** — `utils/LocalSync.js` persists a pending-items queue under a sync key.

---

## 3. Architectural hotspots (VERIFIED)

Context providers and hooks are the highest-leverage storage touchpoints because they run app-wide:

- `context/EmotionContext.jsx` — emotion/continuity state.
- `context/AuthContext.jsx` — token/key read-write. *(Excluded domain: auth — catalogue only.)*
- `context/ReadingLevelContext.jsx` — reading-level preference.
- `hooks/useAnalytics.mjs` — analytics state.
- `hooks/useLumiAudio.js`, `hooks/useLumiBehavior.js`, `hooks/useLumiTheme.js` — Lumi UX preferences.
- `main.jsx` — scheduled-reminder persistence at boot.
- `utils/LocalSync.js` — offline/pending sync buffer.

---

## 4. Key inventory by category (VERIFIED — observed string keys)

> Counts are occurrence counts across the codebase (not unique writes). Categories marked **[EXCLUDED DOMAIN]** are documented for awareness and are **not** targets of any future standardization work.

### 4.1 Auth & admin session **[EXCLUDED DOMAIN — auth/admin]**
- `adminSessionToken` (14), `mmhb_token` (7), `adminVerified` (6), `glp_admin_feature_flags` (6), `mmhb_guest_id` (4), `glp_admin_content` (3), `glp_admin_alerts` (3)
- **Sensitivity note:** tokens/verification flags in `localStorage` are security-relevant. Documented only; **no change proposed here**.

### 4.2 UX / appearance preferences (public-safe)
- `theme` (4), `glp-mode` (4), `glp-calm-mode` (4), `glp-mood-background` (3), `glp-a11y-settings` (3)

### 4.3 Wellness / self-care progress
- `glp-challenge-progress` (7), `wellness_habits` (4), `selfcare_streak` (4), `selfcare_completed` (4), `habits_completed_today` (4), `selfcare_date` (3), `selfcare_total_points` (2), `wellness_goals` (2), `ritualStreak` (2)

### 4.4 Reflection / journaling data **[EXCLUDED DOMAIN — journal]**
- `glp_reflections` (4), `glp_reflection_draft` (4), `glp_reflection_xp` (3), `weekly_reflections` (2)
- Documented for awareness; **out of scope** (journal domain).

### 4.5 Values / tools / monitors
- `values_explorer_data` (4), `digital_detox_data` (3), `worry_time_data` (2), `stress_monitor_data` (2), `sleep_history` (2), `self_compassion_data` (2), `social_connection_data` (2), `viz_favorites` (2)

### 4.6 Lumi emotional state
- `lumi:v9:lastEmotion` (3), `lumi:v9:entered` (3) — note the only namespaced (`lumi:v9:`) keys observed; everything else is flat/unprefixed.

### 4.7 Misc UI / drafts / dismissals
- `glp-scheduled-reminder` (5), `soft_launch_banner_dismissed` (2), `social_drafts_v2` (2), `savedAffirmations` (2), `resilienceStories` (2)

---

## 5. Naming-convention observations (VERIFIED)

- **No consistent prefix.** Coexisting conventions: `glp-…`, `glp_…`, `lumi:v9:…`, `mmhb_…`, and bare snake_case (`wellness_habits`, `sleep_history`).
- **Mixed separators** (`-`, `_`, `:`) for the same product.
- **Only one namespace carries an explicit version** (`lumi:v9:`); the rest have no schema/version marker (**MISSING** versioning).

---

## 6. What this taxonomy deliberately does NOT do

- Does not modify, move, or rename any key.
- Does not replace `localStorage` or add IndexedDB / any persistence library.
- Does not prescribe changes to auth, journal, crisis, healing, chat, billing, dashboard, or admin flows.
- Does not propose code. Companion documents: `storage-risk-matrix.md`, `storage-standardization-plan.md`.
