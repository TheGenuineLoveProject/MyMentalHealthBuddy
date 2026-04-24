# MMHB Buddy Engine — Architecture

> Healing-domain modular companion for MyMentalHealthBuddy.
> Visual avatar + emotional state machine + safe AI route + React hook +
> telemetry-ready output.

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
