# Avatar v4.2 Execution Plan — Dry Run

**Status:** governance traceability only. Build follows immediately.
**Locked:** 2026-05-10. Kernel: MMHB v7.4.

---

## Part 1 — Verification Checklist (v4.2 sweep, just merged)

- [x] 13 files touched (BuddyAvatar + Header + 3 NEW + 3 INJECT + 5 SWEEP)
- [x] `npx tsc --noEmit` → 0 errors
- [x] `/`, `/chat`, `/tools`, `/crisis` → HTTP 200
- [x] 0 orphan `mmhb_buddy` imports in swept files
- [x] `lumiAssets.js` theme registry preserved (1 ref)
- [x] Resolution order verified: `pose > style > colorMode`
- [x] Safety: ErrorBoundary `state="crisis"` → `motion: "steady"` (asymmetric risk)
- [x] Adapter mode: LumiMascot/LumiBrandLogo wrapper APIs preserved
- [x] Architect review pass; 2 polish fixes applied (chat header 36px, CelebrationOverlay focus management)

---

## Part 2 — 18-emotion → 7-colorMode mapping (single source of truth)

**Module:** `client/src/lib/buddyEmotion.ts`
**Surface:** `classifyEmotion(text) → BuddyEmotion`, `emotionToAvatar(emotion) → { state, colorMode, pose? }`

| Emotion         | BuddyState   | colorMode | pose?        | Notes |
|-----------------|--------------|-----------|--------------|-------|
| `crisis`        | crisis       | purple    | —            | overrides everything; motion=steady |
| `distress`      | sad          | purple    | hugging      | severe but pre-crisis |
| `sadness`       | sad          | purple    | —            | |
| `grief`         | sad          | purple    | hugging      | |
| `loneliness`    | sad          | purple    | hugging      | |
| `shame`         | sad          | purple    | —            | |
| `anxiety`       | anxious      | blue      | —            | |
| `fear`          | anxious      | blue      | —            | |
| `overwhelm`     | anxious      | blue      | —            | |
| `confusion`     | calm         | blue      | —            | grounding tone |
| `anger`         | anxious      | orange    | —            | warm acknowledgment |
| `frustration`   | anxious      | orange    | —            | |
| `tiredness`     | calm         | sleep     | —            | |
| `sleep`         | calm         | sleep     | —            | |
| `gratitude`     | encouraged   | pink      | —            | |
| `love`          | encouraged   | pink      | —            | |
| `hope`          | encouraged   | yellow    | —            | |
| `joy`           | celebrate    | yellow    | celebrating  | |
| `pride`         | celebrate    | yellow    | celebrating  | |
| `calm` (default)| calm         | default   | —            | sage canonical |

**Classifier:** keyword-based regex over assistant + last-user turn. Crisis keywords short-circuit to `crisis` (kernel asymmetric-risk rule). Falls back to `calm`/`default`.

---

## Part 3 — 3 tool flows

| Route             | Status today                            | Action |
|-------------------|----------------------------------------|--------|
| `/tools/breathing`| ConfigRoute → autopilot stub           | Replace with real `BreathingTool.jsx` (4-7-8 cycle, big Lumi anchor, calm/blue) |
| `/checkin`        | `<Redirect to="/mood" />` (broken)     | Replace with real `CheckIn.jsx` (5 quick prompts, dynamic Lumi mood reflection) |
| `/celebration`    | `CelebrationRitual.jsx` (real, 311 LOC)| Inject BuddyAvatar at top — minimal patch, preserve confetti + affirmation flow |

**New files:**
- `client/src/pages/tools/BreathingTool.jsx`
- `client/src/pages/CheckIn.jsx`

**App.jsx edits:**
- Add `BreathingTool` + `CheckIn` lazy imports
- Replace `/tools/breathing` route body
- Replace `/checkin` redirect with real route

---

## Part 4 — AIChatPanel dynamic sentiment + pose

**File:** `client/src/components/chat/AIChatPanel.tsx`
**Change:** import `classifyEmotion` + `emotionToAvatar`. For each assistant bubble, derive `{state, colorMode, pose}` from that bubble's text. Typing indicator stays `state="anxious"` (breathe motion). Replaces TODO(buddy-emotion) marker.

```ts
const emotion = classifyEmotion(m.content);
const a = emotionToAvatar(emotion);
<BuddyAvatar state={a.state} colorMode={a.colorMode} pose={a.pose} size="sm" />
```

---

## Part 5 — A11y & safety rules (verified inline)

- `prefers-reduced-motion`: respected by BuddyAvatar (existing) + LoadingSpinner (CSS) + CelebrationOverlay (CSS)
- Crisis stillness: only `state="crisis"` guarantees `motion: "steady"`. Used in ErrorBoundary; classifier short-circuits to it on self-harm signals
- Screen readers: assistant avatars `aria-hidden="true"` (decorative beside text), interactive shapes have `aria-label`
- Crisis routing: every wellness page links `/crisis`; classifier never suppresses 988/741741 surfacing in chat replies (they live in the message text, not the avatar)

---

## Part 6 — Cuteness DNA (Hello Kitty principle)

Top 10 design principles, distilled:
1. **Round, not sharp** — no edges on the body silhouette
2. **Eyes do the work** — emotion lives in pupil shape/lid, not facial muscles
3. **Static dignity** — calm pose by default; motion is earned, never imposed
4. **No mouth = universal** — readers project their own emotion (Sanrio rule)
5. **Symmetric color** — single accent hue per state, never 2 competing
6. **Generous negative space** — halo, not frame
7. **Soft shadow only** — no hard outlines
8. **Pose communicates intent** — body posture > facial micro-expression
9. **Predictable placement** — same anchor position across surfaces builds trust
10. **Safety supersedes cuteness** — crisis state = stillness, never sparkle

Our system already satisfies 1, 3, 5, 6, 7, 9, 10. Items 2/4/8 are encoded in the asset PNGs (style/pose).

---

## Part 7 — Execution order (verify after each)

1. Doc (this file) ✓
2. `buddyEmotion.ts` — TS check
3. `BreathingTool.jsx` + `CheckIn.jsx` — TS check
4. `App.jsx` route swaps — smoke test 3 routes
5. `CelebrationRitual.jsx` injection — smoke test
6. `AIChatPanel.tsx` sentiment wiring — TS check + `/chat` smoke
7. Final TS + smoke + architect review

## Ask-before-building items
None. All 7 parts proceed.
