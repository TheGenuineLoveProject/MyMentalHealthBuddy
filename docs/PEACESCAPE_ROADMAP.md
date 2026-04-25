# Peace Scape — Roadmap

> A long-arc, A→Z plan for MMHB's evolving sanctuary surface.
> Trauma-informed. Non-clinical. Calm by default. Slow on purpose.
> Last updated: 2026-04-25

## Why Peace Scape exists

MyMentalHealthBuddy is built around a single promise: a forever companion. Most
mental wellness apps churn users by treating engagement as a metric. Peace Scape
flips that. It is a **personal, evolving sanctuary** — the place your Buddy
lives, the place your reflections take root, and the place that gently grows
alongside you over months and years.

The user's words for what they want here:

- An **interactive Buddy** that feels alive on this surface
- A **user-customizable avatar** so the companion feels like *theirs*
- An **evolving learning space** that deepens as the user does

This roadmap is the path from a quiet stub today → a full sanctuary fabric.

---

## Design contract (applies to every phase)

Every phase below is bound by these invariants. They are not optional.

1. **Crisis safety is sacred.** Buddy on `/peacescape` MUST honor the same
   crisis routing as everywhere else. No animation, color, or audio change can
   override `/crisis` routing or the steady sage-green crisis state.
2. **Strict-protected import boundary.** Peace Scape code MUST NOT import from
   `/api/ai/chat` handlers, `server/ai/*` (orchestrator, memory, profile,
   summary, crisis), or `/start` page internals.
3. **Read-only by default.** Each phase explicitly names its writes. Anything
   not explicitly written is read-only.
4. **Educational only.** No diagnosis, no treatment claims, no "level up" /
   "streak" punitive language. Stages are *places*, not *scores*.
5. **`prefers-reduced-motion` gated.** Every animation has a static fallback.
6. **WCAG AA.** Every progress bar has `role="progressbar"` + aria values.
   Every visual state has a text equivalent.
7. **Original copy.** No platitudes, no scraped wellness clichés.
8. **Replit-safe.** No external infra beyond what is already wired
   (Postgres via Drizzle, Express, React/Vite). No new heavyweight deps without
   user approval.

---

## Phase 1 — Sanctuary foundation  *(LIVE — shipped 2026-04-25)*

**Status:** Complete.

**Surfaces:**
- `client/src/pages/PeacescapePage.jsx` — `/peacescape` route
- `client/src/components/zen/ZenScape.jsx` + `zen-scape.css` — gradient/ripple/petal backdrop with optional Buddy hero
- `server/routes/peacescape.mjs` — `GET /api/peacescape/state`
- `shared/schema.mjs::userAvatars` + `server/db/ensureSchema.mjs` — idempotent
  `user_avatars` table

**What it does today:**
- Reads the user's journal count and (optional) `user_avatars` row
- Computes the user's **evolution stage** (Seed Garden → Inner Cathedral)
- Returns a starter scape for guests
- Renders a hero with Buddy at 200px, a sanctuary-state card, a stage progress
  bar, and a public roadmap teaser

**What it does NOT do yet:** writes, persistence of customizer choices, a
sanctuary scene illustration. Those are Phases 2–3.

---

## Phase 2 — Avatar customizer

**Goal:** Let the user choose their Buddy's *palette* and *accessory*. Small,
tasteful, non-cosmetic-economy choices.

**Schema (already provisioned in Phase 1):**
- `user_avatars.palette` — `sage` | `dawn` | `dusk` | `lavender` | `ember`
- `user_avatars.accessory` — `none` | `flower` | `scarf` | `lantern` | `feather`

**API (new):**
- `PUT /api/peacescape/avatar` (auth required)
  - Body: `{ palette, accessory }`
  - Validates against allowed enum
  - Upserts `user_avatars` row, returns canonical row
  - Rate-limited to 30 changes/hour to prevent thrash

**Frontend:**
- New panel on `/peacescape` with palette swatches + accessory chips
- Live BuddyAvatar preview reflecting choices via CSS variable injection
- "Save" + "Revert" with optimistic UI + toast feedback
- Reduced-motion respected on swatch transitions

**Buddy integration:**
- Extend `client/src/components/avatar/BuddyAvatar.tsx` to accept an optional
  `palette` and `accessory` prop. These map to existing CSS variables
  (`--buddy-eye-color`, `--buddy-heart-color`) and a small overlay layer.
- Crisis state STILL forces sage green and the canonical crisis palette,
  ignoring user choice. (Hard-coded in `BuddyAvatar.css`.)

**Acceptance:**
- 8 contract gates still PASS
- VISUAL_MAP guard still PASSes (no new BuddyState introduced)
- Crisis screenshot is byte-identical pre/post (steady sage, ≥5000ms)
- A11y: every swatch has `aria-label`; selected state announced

---

## Phase 3 — Scape evolution

**Goal:** The sanctuary itself changes as the user reflects. Currently we name
stages; in this phase we render them.

**Visual:**
- New `client/src/components/zen/PeaceSceneSVG.jsx` — single SVG with 6 layered
  stages. Each stage adds elements (wildflowers → trees → moss → pond → forest
  → cathedral light). Stages are CSS-toggled via a `data-stage="N"` attribute
  to keep one DOM tree.
- All animations are slow (10–20s loops) and `prefers-reduced-motion` gated.

**API additions:**
- `GET /api/peacescape/state` already returns `stage`/`nextStage` — no new
  endpoint needed.

**Microcopy:**
- Each stage transition shows a one-time gentle observation
  ("Something is taking root" / "The sanctuary remembers your visits")
- Stored in `localStorage` — no DB write, no notification spam.

**Acceptance:**
- All 6 stages render at every viewport down to 320px wide
- Reduced-motion fallback shows the static end-state SVG with no transitions
- Crisis state: scene fades to a still, low-saturation render; no motion

---

## Phase 4 — Learning curriculum

**Goal:** Bite-sized, trauma-informed micro-lessons that unlock alongside the
user. NOT a course platform. NOT gamified. Each lesson is 60–180 seconds of
reading + one optional reflection prompt.

**Schema (new):**
- `lessons` (read-only seed; populated from `data/lessons/*.json`):
  - `slug`, `title`, `body_md`, `stage_required`, `tags`, `evidence_refs`
- `user_lesson_progress` (writes):
  - `user_id`, `lesson_slug`, `read_at`, `reflection_text` (nullable)

**API:**
- `GET /api/peacescape/lessons` — returns lessons unlocked at the user's stage
- `POST /api/peacescape/lessons/:slug/read` — marks read
- `POST /api/peacescape/lessons/:slug/reflect` — saves reflection (auth +
  rate-limited)

**Frontend:**
- New `/peacescape/learn` sub-route with a quiet card grid
- Each lesson card: tag pill + title + 1-line preview
- Reading view: full markdown render + optional reflection composer
- All content tagged with the same `evidence_refs` shown to the user

**Content sourcing:**
- Original writing only. No scraping. Each lesson cites at least one
  peer-reviewed source by name + year.

**Acceptance:**
- Lessons load in <300ms (server-rendered JSON, no AI inference at request time)
- All lesson content reviewed against `WELLNESS_MICROCOPY` standards
- Reflection composer respects same PII redaction & crisis-detection patterns
  used in `/journal` (re-uses, not re-implements)

---

## Phase 5 — Enlightenment journey

**Goal:** A long-arc, multi-month map of the user's inner work. NOT levels.
NOT XP. **Chapters** — narrative, named, optional.

**Concept:**
- 7 chapters: *Awakening, Tending, Naming, Releasing, Returning, Becoming,
  Belonging*. Each chapter has 3–5 lessons + 1 long reflection prompt.
- Chapters are **always available** — no hard gating. The page simply
  *highlights* the chapter that matches the user's current stage + recent
  themes (read from `buildJournalSummary` themes, not from a new model).

**Schema:**
- `user_chapter_progress` — `user_id`, `chapter_slug`, `started_at`, `completed_at`
- No "score", no "rank".

**Frontend:**
- New `/peacescape/journey` page with a quiet vertical timeline
- Each chapter card opens an expanded view with its lessons + reflection
- Visual: the Peace Scape SVG subtly shifts color palette per chapter

**Acceptance:**
- Every chapter is reachable directly via URL slug
- "Skip ahead" is always available — no forced linear flow
- Crisis-detection in reflection composer matches `/journal` exactly

---

## Phase 6 — 360° support fabric

**Goal:** Weave Peace Scape, Buddy, journal, mood check-ins, and the
metacognition mirror into one coherent fabric. The user should feel "held by
the whole thing", not "using 5 separate features".

**Mechanisms (all read-only orchestration; no new AI calls):**
- A new lightweight `usePeaceFabric()` hook reads from existing endpoints
  (`/api/growth/journey`, `/api/peacescape/state`, `/api/journal`,
  `/api/mood`) and returns a single derived view: `{stage, recentFeeling,
  suggestedNextStep}`.
- `suggestedNextStep` is one of: *journal · breathe · rest · learn · just be*.
  It is **always optional and dismissible**.
- Buddy's idle state on `/peacescape`, `/growth`, and `/start` softly reflects
  `recentFeeling` (still bound by VISUAL_MAP — no new states introduced).

**UI threads:**
- A small persistent "sanctuary" pip in the global nav that pulses gently when
  the user has unread lesson cards or a stage transition. Dismissible. Never
  red. Never urgent.
- A weekly digest email (opt-in only) summarizing: time visited, dominant
  feeling, one chapter highlight. NO comparison to other users. NO streak shame.

**Acceptance:**
- 8 contract gates still PASS
- No new BuddyStates added
- Crisis routing still short-circuits everything
- Email opt-in defaults to OFF; consent UX matches `WELLNESS_MICROCOPY`
- Full feature is reachable on mobile + keyboard-only navigation

---

## Out-of-scope (forever, on purpose)

- Streaks. Leaderboards. Push notifications past the opt-in digest.
- Cosmetic economy / paid avatar items / loot.
- Social comparison surfaces.
- Any AI-generated lesson content surfaced as authoritative.
- Re-writes of `/api/ai/chat`, `server/ai/*`, or `/start` internals.

---

## Open questions to revisit before Phase 2

1. Do we expose palette/accessory choice to **guests** (localStorage) or
   require account? Current lean: account-only, to keep `user_avatars` the
   single source of truth.
2. Should crisis state visually neutralize the entire scape, not just Buddy?
   Lean: yes — fade scape to low-saturation still frame, surface crisis CTA.
3. Should the metacognition mirror at `/growth` and Peace Scape at
   `/peacescape` eventually merge? Lean: keep separate. They serve different
   moments — one is *insight*, one is *home*.

---

## Change protocol

Any change to this roadmap MUST:

1. Be reflected in `replit.md` under the appropriate System Architecture section
2. Be accompanied by a contract-gates run (`bash scripts/check-contract-routes.sh`)
3. Preserve the design contract above (8 invariants)
4. Be reviewed by the architect skill before merge
