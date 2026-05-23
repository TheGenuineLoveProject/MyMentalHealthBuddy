# MMHB User Journey Map

**Baseline:** 2026-05-23 (Phase 55)
**Mode:** descriptive map — no UX changes

---

## 1. The primary journey (happy path)

```
   ┌──────────────────────────────────────────────────────────┐
   │  1. Landing                                              │
   │  /  →  redirects to /dashboard (auth'd) or /landing      │
   │  Surface: marketing variant or app shell                 │
   └────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
   ┌──────────────────────────────────────────────────────────┐
   │  2. Authentication                                       │
   │  /register  →  /login  →  AuthProvider session           │
   │  Surface: client/src/pages/(Register|Login).tsx          │
   └────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
   ┌──────────────────────────────────────────────────────────┐
   │  3. Onboarding                                           │
   │  /onboarding  →  goal selection, intro                   │
   │  Surface: Onboarding.tsx  OR  OnboardingFlow.jsx         │
   │  ⚠️  Two routes, two components — see duplication §2.3   │
   └────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
   ┌──────────────────────────────────────────────────────────┐
   │  4. Dashboard / Today                                    │
   │  /dashboard, /today, /wellness-dashboard                 │
   │  Surface: WellnessDashboard.jsx (lazy)                   │
   │  - Mood widget, chat entry, journal prompt               │
   │  - Footer links to /crisis (when layout/Footer renders)  │
   └────────────────┬─────────────────────────────────────────┘
                    │
       ┌────────────┼────────────┬────────────┐
       ▼            ▼            ▼            ▼
   ┌────────┐  ┌─────────┐  ┌────────┐  ┌─────────┐
   │ 5a Mood│  │ 5b Chat │  │5c Journ│  │5d Crisis│
   │ /mood  │  │ /chat   │  │/journal│  │/crisis  │
   │  OR    │  │ (one of │  │        │  │ F-33.6  │
   │/mood   │  │ four    │  │        │  │ 5/5     │
   │tracker │  │ surfac.)│  │        │  │ literals│
   └────────┘  └─────────┘  └────────┘  └─────────┘
       │            │            │            │
       └────────────┴────────────┴────────────┘
                    │
                    ▼
   ┌──────────────────────────────────────────────────────────┐
   │  6. Engagement loop                                      │
   │  - Streaks / XP via GamificationProvider                 │
   │  - Memory persistence via lumi-memory                    │
   │  - Return visits → /dashboard (skip onboarding)          │
   └──────────────────────────────────────────────────────────┘
```

## 2. Step-by-step detail

### 2.1 Landing (Step 1)

| Surface | Route | Component |
|---|---|---|
| Root | `/` | redirect logic in `client/src/App.jsx` |
| Marketing | `/landing` (+ many variants) | various marketing pages |
| Dashboard (auth'd) | `/dashboard` | `WellnessDashboard.jsx` |

**Continuity note:** root `/` redirects based on auth. Returning users skip directly to dashboard. New users land on a marketing variant.

### 2.2 Authentication (Step 2)

| Surface | Route | Component |
|---|---|---|
| Register | `/register` | `Register.tsx` |
| Login | `/login` | `Login.tsx` |
| Forgot password | `/forgot-password` | |
| Reset password | `/reset-password` | |

State after success: `AuthProvider` (React Context) holds user; JWT cookie set; subsequent `/api/*` calls authenticated.

### 2.3 Onboarding (Step 3) — duplication concern

| Surface | Route | Component |
|---|---|---|
| Path A | `/onboarding` | `Onboarding.tsx` |
| Path B | `/onboarding-flow` (or similar) | `OnboardingFlow.jsx` |

**Both routes are registered in `App.jsx`.** Depending on which link the user clicks (or which marketing campaign deep-links them), they land on a **different onboarding flow** with possibly different state contracts. This is a journey continuity break (cross-ref: duplication scan §2.3, MED severity).

### 2.4 Dashboard (Step 4)

| Surface | Route | Component |
|---|---|---|
| Dashboard | `/dashboard` | `WellnessDashboard.jsx` |
| Today | `/today` | `Today.jsx` |
| Wellness hub | `/wellness-tools-hub` | hub aggregator |

State: hydrated from server via TanStack Query (mood history, streak, latest entries) + Context (auth, theme, gamification).

### 2.5 First action (Step 5)

#### 5a — Mood (`/mood` OR `/mood-tracker`)

| Surface | Component |
|---|---|
| `/mood` | `MoodPage.jsx` |
| `/mood-tracker` (dashboard sub) | `dashboard/MoodTracker.jsx` |

**Two mood surfaces** → continuity break (duplication scan §2.4). State may persist to different stores depending on which surface the user enters.

#### 5b — Chat (one of FOUR surfaces)

| Surface | Component | Notes |
|---|---|---|
| Legacy chat | `AIChat.jsx` | older implementation |
| Chat panel | `chat/AIChatPanel.tsx` | newer panel |
| Lumi conversation | `lumi-conversation/LumiConversationPanel.tsx` | current Lumi-domain implementation |
| Companion widget | `AICompanion.jsx` | floating widget; uses hardcoded `INITIAL_MESSAGES` |

**Highest-severity journey continuity break** (duplication scan §2.5 + state graph §5). Conversation context does not persist across surfaces — a user who switches between them loses session memory.

#### 5c — Journal (`/journal`)

Single surface. Draft state in Zustand (`checkin-flow`-class store), persisted via TanStack mutation.

#### 5d — Crisis (`/crisis`)

`client/src/pages/CrisisResources.jsx`. Static content (no AI, no DB read). F-33.6 5/5 literals verified live in production. **The journey floor — always reachable, always intact.**

### 2.6 Engagement loop (Step 6)

- Streaks + XP via `GamificationProvider` (Context)
- Long-term memory via `lumi-memory` module (Zustand + server-backed)
- Return visit: user lands at `/dashboard` directly; onboarding skipped

## 3. Known journey breaks

| # | Where | Break | Severity |
|---|---|---|---|
| 1 | Step 3 | Two onboarding routes / components | MED |
| 2 | Step 5a | Two mood surfaces | MED |
| 3 | Step 5b | Four chat surfaces — no shared conversation state | HIGH |
| 4 | Step 5b (companion) | `AICompanion` hardcoded `INITIAL_MESSAGES` — context lost between sessions if not persisted | MED |
| 5 | Footer | Five footers — `/crisis` link only confirmed on `layout/Footer.tsx`; pages with other footers may not surface the visible crisis CTA | MED (BHCE-adjacent) |
| 6 | Pricing | `/pricing` and `/pricing-page` both registered with different components | MED |
| 7 | Routes | 1,036 wouter routes; many redirects + some unimplemented lazy targets risk leading to NotFound | LOW |

## 4. Crisis path — verified end-to-end

| Stage | Mechanism |
|---|---|
| Surface availability | `/crisis` route in App.jsx + SPA fallback in server/app.mjs |
| Content integrity | F-33.6 5/5 in source AND live production |
| Discovery | Footer link (where `layout/Footer.tsx` renders), AI companion system prompt instruction, check-in flow inline link |
| Fallback | Hardcoded resource dump in `agentGovernanceRules.ts:58` if AI fails |
| Provider-independence | static page; no LLM, no DB dependency |

**The crisis path is the most robust user journey in the entire platform.** It is the only path with explicit kernel-level invariants, monitoring at the S0 tier (per incident severity matrix), and a hardcoded fallback that survives provider outages.

## 5. Journey continuity score

See `docs/reports/PHASE_55_PLATFORM_COHESION_AUDIT.md` §11 for the **emotional UX continuity score**.

---

*This user journey map is descriptive of the canonical happy path as of 2026-05-23. The seven journey breaks in §3 are findings to be addressed in future planned phases — duplication scan §10 recommends the sequence. The crisis path (§4) is verified intact.*
