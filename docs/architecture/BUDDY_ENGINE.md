# MMHB Buddy Engine — Architecture

> **Status: v1.7**
> Healing-domain modular companion for MyMentalHealthBuddy.
> Visual avatar + emotional state machine + safe AI route + React hook +
> telemetry-ready output + signal-driven /start integration + time-based
> recovery + tool-specific expressions + memory-aware visual baseline +
> accessibility & safety polish.

## v1.7 Changes (April 2026)

Accessibility-only and safety polish — zero changes to AI, server,
orchestrator, memory, profile, telemetry crisis, or tool-execution logic.

- **State-specific aria-label vocabulary.** New `BUDDY_ARIA_LABEL`
  Record in `BuddyAvatar.tsx` maps every BuddyState to a calm,
  consent-based, trauma-informed phrase that screen-reader users can
  rely on:
  - calm        → "Buddy avatar showing calm support mode"
  - sad         → "Buddy avatar showing gentle support mode"
  - anxious     → "Buddy avatar showing anxious breathing support mode"
  - overwhelmed → "Buddy avatar showing grounding support mode"
  - encouraged  → "Buddy avatar showing encouraging support mode"
  - crisis      → "Buddy avatar showing crisis-safe support mode"
  - celebrate   → "Buddy avatar showing celebrating support mode"
  Falls back to the existing `v.label` if a future state is added before
  the map is updated, so screen readers never go silent.
- **Defensive aria-hidden on decorative SVG inner groups.** Eyes, heart
  group, and base shadow now carry explicit `aria-hidden="true"` even
  though they inherit from the outer SVG's `aria-hidden`. Belt-and-
  suspenders against future refactors that might un-hide the parent.
- **`focusable="false"`** added to the SVG element to keep legacy
  IE/Edge from inserting Buddy into the keyboard tab order.
- **Screen-reader companion copy on /start.** A visually-hidden
  `<p className="sr-only">` line near BuddyAvatar tells AT users:
  *"Buddy is a visual companion. Your support tools still work without
  animation."* — read once on initial reading order, never re-announced.
- **Reduced-motion + non-flashing crisis safety preserved.** Already
  shipped in v1.2/v1.4 and re-verified for v1.7:
  - `BuddyAvatar.css` global `@media (prefers-reduced-motion: reduce)`
    gate (lines 176-185) cancels all keyframe animations and the
    `fill` transition.
  - Crisis state uses calm green (`#7FD8A8`), never red, with steady
    motion (`buddyMotion: "steady"`) and a slow heart cadence.
  - No interactive children inside BuddyAvatar — no `onClick`, no
    `tabindex`, no buttons. Pure visual, keyboard-pass-through.
- **Additive telemetry:** `buddy_accessibility_ready` fires once per
  /start mount alongside `start_page_click`. Confirms Buddy mounted
  with all a11y affordances. No message text, no profile data.

## v1.6 Changes (April 2026)

- **Memory-aware visual baseline.** Buddy's idle (calm) tone is gently
  personalized using ONLY existing client-side signals — `currentStreak`,
  `daysAway`, completion-of-tool, paywall hint. NEVER reads or writes
  profile data. The pure helper `resolveBuddyBaseline({...})` returns the
  suggested baseline; the call site gates application on `buddyState ===
  "calm"` so tool/emotional states ALWAYS win.
- **Loop guard via signal fingerprint.** `baselineAppliedRef` and
  `baselineSignalsRef` (a fingerprint of `streak:daysAway:completed:paywall`)
  prevent infinite ping-pong with v1.4 recovery. After baseline applies
  and v1.4 recovers Buddy to calm 20s later, the same fingerprint hits
  the latch and the effect returns early. The fingerprint correctly
  ALLOWS re-baseline when signals genuinely change (e.g., streak
  increments after `recordStreak` succeeds).
- **Baseline copy beneath avatar:**
  - `daysAway >= 2` → "Buddy is here to help you restart gently."
  - `currentStreak >= 7` → "Buddy remembers your consistency."
  - `currentStreak >= 3` → "Buddy is here for today's reset."
  - paywall hint → "Buddy can help you go deeper when you're ready."
  - default → "Buddy is here with you."
- **Additive telemetry:** `buddy_baseline_applied { baseline, currentStreak,
  daysAway }`. No private profile data; no message text.

## v1.5 Changes (April 2026)

- **Tool-specific avatar expressions.** `mapToBuddyState` now has
  explicit, highest-specificity branches for all 7 canonical tool IDs so
  Buddy visually participates in the active tool, not just the user's
  worded request:
  - `box_breathing` → anxious (breathing pulse)
  - `grounding_54321` → overwhelmed (sensory grounding)
  - `thought_reframe` → encouraged (focused/reframe)
  - `emotional_checkin` → sad (soft/gentle)
  - `overload_reset` → overwhelmed (held-not-flooded)
  - `relationship_repair` → encouraged (warm preparation)
  - `pattern_interrupt` → encouraged (loop-breaking)
- **Module fallbacks** kept for cases where the AI tags a domain but no
  tool yet: `anxiety / emotional_processing / cognitive_reframe /
  self_regulation`.
- **Tool-specific helper copy.** New `buddyToolCopy` map adds a clear
  micro-line per tool ("Buddy is helping you think clearly.", "Let Buddy
  help you ground.", etc.). The helper-copy precedence is now layered:
  crisis → completion (v1.4) → active tool (v1.5) → grounding (v1.4) →
  baseline (v1.6) → null.
- **Robust toolId access.** Reads both `tool.tool.id` (orchestrator
  double-nested shape) AND `tool.id` (flatter shape) so future server
  refactors don't silently drop tool-aware mapping.
- **Additive telemetry:** `buddy_tool_expression { toolId, buddyState }`,
  emitted inline in the v1.3 mapping effect with the freshly-computed
  state (no stale closure). Deduped per unique toolId via
  `buddyToolExpressionRef`.

## v1.4 Changes (April 2026)

- **Time-based state recovery.** Non-crisis emotional states gradually
  return to `calm` so Buddy feels emotionally synchronized rather than
  stuck. Two timing tiers: 12s "soft landing" after `toolCompleted`
  (`encouraged → calm`), 20s natural recovery for everything else
  (`anxious / sad / overwhelmed / encouraged → calm`). Crisis NEVER
  auto-transitions — the user needs steady grounding, not motion.
- **Grounding helper copy.** A small `aria-live="polite"` line appears
  beneath the avatar:
  - `anxious / overwhelmed` → "Follow Buddy's breath."
  - `encouraged + toolCompleted` → "You did one small thing for yourself."
  Layout reserves the line height (`min-h-[1.25rem]`) so the page never
  shifts when copy appears or disappears. Subtle opacity-only fade,
  disabled under `prefers-reduced-motion`.
- **Additive telemetry events** (client-side `track()` only — no pipeline
  changes): `buddy_state_recovered`, `buddy_completion_soft_landing`,
  `buddy_grounding_visible`. No message text is logged.
- **Three-effect coordination, race-free.** The v1.3 mapping effect
  (signal-driven) and the v1.4 recovery effect cannot ping-pong because
  the recovery's setBuddyState("calm") doesn't change any of the v1.3
  effect's dependencies. Architect-reviewed.

## v1.3 Changes (April 2026)

- **Avatar bound to real /start outcomes** (not just static or input-based).
  `client/src/pages/Start.tsx` now derives `buddyState` from a pure mapper
  `mapToBuddyState({modules, toolId, selectedToolId})` driven off the
  existing `/api/ai/chat` response and the entry-point button the user
  clicked.
- **Signal precedence (highest first):** `crisis` → `toolCompleted` →
  `mapToBuddyState(modules + toolId + selectedToolId)` → `calm`. Crisis is
  never overridden; tool completion always lifts to `encouraged`.
- **`selectedToolId` fallback** ensures the avatar reacts immediately on
  click (before AI responds) AND stays meaningful when the AI doesn't tag
  modules. Mapping: `calm`→anxious, `think`→encouraged, `feel`→sad.
- **Smooth color transitions** (`transition: fill 600ms ease`) on eyes and
  heart so state changes never snap or flash. Disabled under
  `prefers-reduced-motion`.
- **No AI / route / orchestrator changes.** Pure read-only client wiring
  on top of existing surfaces.

## v1.2 Changes (April 2026)

- **Crisis safety re-grounded.** Crisis state now uses calm green eyes
  (`#6FE3B0`) and steady green heart (`#7FD8A8`) at a slow 5800ms pulse —
  emotionally safe and grounded, never alarming. The previous red+fast
  values were removed from both `VISUAL_MAP` and the CSS override.
- **Slower, calmer cadences.** Anxious heart pulse slowed to 4400ms (was
  2200ms — too close to mirroring distress). Sad shifted from blue to soft
  purple (`#B19CD9`) per healing-domain spec. Overwhelmed dimmed to sage
  green for a held-not-flooded feel. Celebrate kept warm gold heart with
  green eyes.
- **Server-side `BUDDY_VISUALS` mirror in `server/routes/buddy.mjs` is
  intentionally NOT updated** in v1.2 — strict rule forbade modifying
  that file. The rendered avatar on `/start` reads from the *client*
  `VISUAL_MAP` (via `getBuddyVisualOutput`), so the visible UI is correct.
  The `/api/buddy` response's `buddy` block returns slightly older visual
  values; this is informational drift only and doesn't affect rendering.

## v1.1 Changes (April 2026)

- **Server response contract** now returns a complete `buddy` block with
  `safetyMode`, `motion`, `eyeColor`, `heartColor`, `heartPulse` so any client
  (web, mobile, future hardware companion) can render the visual without
  re-implementing the vocabulary.
- **Motion vocabulary upgraded** to semantic, healing-domain names:
  `idle`, `slow_glow`, `breathing`, `grounding`, `warm_glow`, `steady`,
  `sparkle`. The previous mechanical names (`breathe`/`sway`/`tremor`/etc.)
  were replaced — the visual behavior was preserved, only the vocabulary
  changed.
- **Input validation tightened** — server now trims input and enforces a
  1000-character maximum (was 2000). Empty input returns `400`.
- **/start integration (visual-only)** — `BuddyAvatar` now renders at the top
  of `client/src/pages/Start.tsx`. State is driven by the existing `crisis`
  flag (calm by default). Buddy does **not** call `/api/buddy` from `/start`;
  it does **not** alter `/api/ai/chat`, tool execution, or response
  rendering. The `/start` `useBuddy()` integration is intentionally deferred
  to a future task.

---

## 1. Ownership Model

The Buddy Engine is **isolated by design**. It is built *beside* the existing
platform — never inside it — so it can evolve, be replaced, or be ported to a
physical device without touching production-critical surfaces.

| Concern | Owner | Notes |
|---|---|---|
| Visual rendering | `client/src/components/avatar/BuddyAvatar.tsx` | Pure SVG. No fetch, no AI, no business logic. |
| Visual styling | `client/src/components/avatar/BuddyAvatar.css` | State-class scoped keyframes. All animations gated by `prefers-reduced-motion`. |
| Visual contract | `client/src/lib/avatarState.ts` | `BuddyState` union, `resolveBuddyState`, `getBuddyVisualOutput`. Pure logic. |
| Conversation lifecycle | `client/src/hooks/useBuddy.ts` | Owns state, messages, send(), 60s idle reset. Talks **only** to `/api/buddy`. |
| Server endpoint | `server/routes/buddy.mjs` | `POST /api/buddy` → `{ok, text, state}`. Healing only. |
| Crisis safety | `server/engine/crisisDetection.mjs` (shared) | Buddy *delegates* — it does **not** own crisis detection. |
| Mount | `server/app.mjs` (`app.use("/api", buddyRoutes)`) | Mounted alongside other route registries; CSRF-allowlisted as a stateless healing surface. |

### What Buddy does **not** own

The Buddy Engine never reads from, writes to, or imports:

- `/api/ai/chat` (the production conversational AI endpoint)
- memory / profile / summary / provider / orchestrator subsystems
- telemetry pipelines (Buddy is *telemetry-ready* but does not emit yet)
- the `/start` route or any user-onboarding surface
- billing, subscription, monetization, or admin tooling

If a future feature needs any of the above, it must be added through the
existing surface — never by widening `buddy.mjs`.

---

## 2. Healing Rules

The Buddy Engine is bound by an explicit healing-only contract. Violations are
treated as bugs.

1. **No diagnosis.** Buddy never names disorders, never claims clinical
   knowledge, and never suggests medications.
2. **No therapy-replacement claims.** Buddy is companionship, not treatment.
3. **No monetization.** No upsells, no plan prompts, no billing copy.
4. **No business logic.** No analytics events, no growth experiments, no
   personalization based on subscription tier.
5. **2–3 sentences max** per non-crisis reply. Pattern: **validate → ground →
   one small step.** Crisis replies may be longer to deliver safety resources.
6. **Calm, consent-based language.** No imperatives that override the user's
   autonomy. Suggestions are framed as invitations.
7. **Original writing only.** No copyrighted clinical material.
8. **Crisis short-circuits server-side.** Detection happens before any
   classification or reply selection. Every crisis response is *guaranteed* by
   the route boundary to include the canonical line:
   *"988 Suicide & Crisis Lifeline by calling or texting 988"*.
9. **WCAG AA.** Visual states never rely on color alone (motion + glow +
   `aria-label` carry redundant signal).
10. **`prefers-reduced-motion` is honored** for every avatar animation.

---

## 3. State Model

```
type BuddyState =
  | "calm"
  | "sad"
  | "anxious"
  | "overwhelmed"
  | "encouraged"
  | "crisis"
  | "celebrate";
```

The state model is intentionally small — seven states cover the dominant
emotional registers a user is likely to express in a healing conversation
without fragmenting the visual identity.

### Visual contract (`getBuddyVisualOutput`)

Each state resolves to:

| Field | Purpose |
|---|---|
| `eyeColor` | Recolors the green default eyes to mirror state. |
| `heartColor` | Recolors the chest-heart glow + shape. |
| `heartPulse` | One full heartbeat cycle in ms — slower for calm, faster for distress. |
| `motion` | Body micro-motion: `breathe \| sway \| tremor \| rise \| bounce \| still`. |
| `label` | Used for `aria-label` and tooltip text. |

### Cadence map

| State | Heart pulse | Motion | Visual reasoning |
|---|---|---|---|
| `calm` | 5200 ms | breathe | Resting parasympathetic cadence. |
| `sad` | 6400 ms | sway | Slow, heavy, gentle rocking. |
| `anxious` | 2200 ms | tremor | Fast pulse, micro-jitter. |
| `overwhelmed` | 1800 ms | tremor | Faster still, signaling flood. |
| `encouraged` | 4400 ms | rise | Lifted, slightly elevated. |
| `crisis` | 1400 ms | still | Urgent pulse, body holds steady to communicate presence. |
| `celebrate` | 3200 ms | bounce | Energetic, joyful spring. |

### State resolution

The server is the **canonical source of truth** for state during a turn.
`resolveBuddyState` is a defensive fallback used only when the server omits
state, or when external code passes raw input.

### Idle reset

`useBuddy` arms a 60-second idle timer (`BUDDY_IDLE_RESET_MS`) after every
exchange. On expiry the visual state returns to `calm` — **except when the
current state is `crisis`**, which is sticky until the user explicitly
re-engages or `reset()` is called. This prevents the visual from softening
while the user may still be in distress.

---

## 4. Future Physical Avatar Compatibility

The Buddy Engine is shaped so it can drive a future hardware companion (a
desk-top robot, a wearable, a glanceable device) without rework.

The visual contract is intentionally **device-agnostic primitives**:

- `eyeColor` → maps cleanly to addressable LEDs.
- `heartColor` + `heartPulse` → maps to a chest LED with PWM cadence.
- `motion` → maps to servo-driven micro-motions (breathe = chest cam, sway =
  base yaw, tremor = high-frequency yaw, rise = lift servo, bounce = lift +
  tilt, still = no actuation).
- `label` → maps to optional TTS announcement.

A hardware adapter can subscribe to the same `useBuddy()`-shaped event stream
(`{state, text, ts}`) and translate it into device commands. No code in
`BuddyAvatar.tsx` is needed on the device side — the visual component and the
hardware adapter are siblings, both consuming the same pure state contract.

A future `client/src/lib/buddyTelemetry.ts` can stream `{state, ts}` tuples
to an analytics sink — the contract is already telemetry-ready because the
state vocabulary is closed and stable.

---

## 5. Verification Commands

Run from a shell after the workflow is live on port 5000.

### Health check

```bash
curl http://0.0.0.0:5000/health
```

Expected: `{"ok":true,"service":"mymmentalhealthbuddy",...}`

### Buddy — anxious

```bash
curl -X POST http://0.0.0.0:5000/api/buddy \
  -H "Content-Type: application/json" \
  -d '{"message":"I feel anxious"}'
```

Expected: `{"ok":true,"state":"anxious","text":"..."}`

### Buddy — crisis (must include 988 line)

```bash
curl -X POST http://0.0.0.0:5000/api/buddy \
  -H "Content-Type: application/json" \
  -d '{"message":"I want to kill myself"}'
```

Expected: `{"ok":true,"state":"crisis","text":"... 988 Suicide & Crisis Lifeline by calling or texting 988 ...","crisis":true,"resources":[...]}`

### Buddy — celebration

```bash
curl -X POST http://0.0.0.0:5000/api/buddy \
  -H "Content-Type: application/json" \
  -d '{"message":"I just won an award!"}'
```

Expected: `{"ok":true,"state":"celebrate","text":"..."}`

### Buddy — empty input

```bash
curl -X POST http://0.0.0.0:5000/api/buddy \
  -H "Content-Type: application/json" \
  -d '{"message":""}'
```

Expected: `400 {"ok":false,"error":"Please share a message so I can respond.","state":"calm"}`

### Preservation check

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST \
  http://0.0.0.0:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hi"}'
```

Expected: `403` (CSRF gate intact — proves `/api/ai/chat` still mounted, not `404`).

---

## 6. Change Discipline

When modifying the Buddy Engine:

1. **Never widen** `buddy.mjs` to import from memory/profile/summary/provider/
   orchestrator. If you need them, build a separate route.
2. **Never weaken** the boundary that guarantees the 988 line in every crisis
   response (`ensureCrisisLineInText` in `buddy.mjs`).
3. **Never remove** the 60-second idle reset from `useBuddy.ts`.
4. **Never remove** the `prefers-reduced-motion` gate in `BuddyAvatar.css`.
5. **Never connect** Buddy to `/start` without a separate, explicit task —
   the engine is intentionally beside-the-platform until that integration is
   approved.
6. Adding a new `BuddyState` is **additive only**: extend the union in
   `avatarState.ts`, add a row to `VISUAL_MAP`, add a state class in
   `BuddyAvatar.css`, and add a reply pool in `REPLY_LIBRARY`. Do not rename
   or remove existing states.
