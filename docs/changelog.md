# MMHB Changelog — Detailed Implementation Notes

This file holds the deep technical notes for completed feature evolutions.
`replit.md` keeps a one-line summary and links here for the full record.
Newest entries on top.

---

## Engagement Hooks Layer (v5.4) — ValueProposition + NextStepCTA across 6 surfaces

Two additive section components were introduced to give every primary user surface a "what's next" moment and a low-friction subscription path. Zero changes to existing behavior, zero new npm dependencies.

**New files**:
- `client/src/sections/ValueProposition.jsx` — email signup with two variants. **`full`** ships a 4-benefit grid (Heart / Sparkles / Shield / Compass — trauma-informed support, daily reflection cues, privacy by default, free tools). **`compact`** ships headline + form only. Email persistence: `localStorage["mmhb:email_subscribers"]` as a JSON array of unique lowercased emails (frontend stub — when a backend `/api/subscribe` lands, swap `handleSubmit`). Email regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. Success state restores on mount if device already subscribed (no re-prompt). A11y: `<label for>`/`<input id>`, `aria-live="polite"` status, `aria-invalid` + `aria-describedby` on errors, scoped `<style>` block with `prefers-reduced-motion` collapsing all transforms.
- `client/src/sections/NextStepCTA.jsx` — context-aware next-step driver. Single component, six contexts: `after-breathing` (calm-blue accent → check-in / celebration), `after-checkin` (sage → breathing / celebration), `after-celebration` (gold → daily reminder / share), `general` (sage → tools / chat), `about` (purple → tools / blog), `blog` (warmth-orange → breathing / journal). Each context carries eyebrow, headline, subline, primary {label,href,icon}, secondary {label,href,icon}, and an accent color exposed via `--nsc-accent` / `--nsc-accent-soft` CSS vars so the card adapts without per-context CSS. Every variant exposes a subtle `/crisis` link below the buttons (safety surface always one tap away). Wouter `<Link>` for SPA routing. Scoped `<style>` with `prefers-reduced-motion` collapsing hover transforms.

**Wired into**:
- `pages/CanvaLanding.jsx` — `<ValueProposition variant="full">` after the testimonials/trust-badges section (between two `consciousness-divider` separators) + `<NextStepCTA context="general">` immediately before the `<footer>`.
- `pages/About.jsx` — `<ValueProposition variant="compact">` + `<NextStepCTA context="about">` before `<GlowFooter />`.
- `pages/Blog.jsx` — both inserted inside `<WellnessPageShell>` after the crisis-resources note.
- `pages/tools/BreathingTool.jsx` — `<NextStepCTA context="after-breathing">` between the "About this exercise" panel and `<SafetyFooter />`.
- `pages/CheckIn.jsx` — `<NextStepCTA context="after-checkin">` between the check-in `<section>` and `<SafetyFooter />`.
- `pages/CelebrationFlow.jsx` — `<NextStepCTA context="after-celebration">` between the celebration `<section>` and `<SafetyFooter />`.

**Universal contracts honored**:
- Crisis routing preserved on every surface (`SafetyFooter` untouched + each `NextStepCTA` carries its own `/crisis` deep link).
- Brand palette: every accent draws from the canonical 8-hex set (sage, gold, calm-blue, empathy-purple, warmth-orange) with neutral white/cream RGBAs only for ambient overlays.
- `prefers-reduced-motion`: defense-in-depth at component level — transitions disabled, hover transforms collapsed, layout intact.
- A11y: each section has `aria-labelledby` to a unique heading id; form has visible focus-ring, error region with `role="alert"`.
- Scoped under unique class prefixes (`.vp-*`, `.nsc-*`) so zero leak risk to host pages.
- WCAG focus-visible: 3px outline in accent color.

**Gates**:
- `npx tsc --noEmit` → exit 0.
- `npm run build` → built in 20.18s, no warnings, `CanvaLanding-*.js` chunk now 72.46 kB / 17.38 kB gz (engagement components inlined into route chunks rather than spawning new chunks — zero asset count change).
- All 6 routes return 200 on the dev server.
- Architect review: PASS (only 2 nits — both intentional: localStorage write failure is a silent no-op since the success state is still psychologically truthful for the user, and `NextStepCTA` falls back to `general` on unknown context as a defensive default).

---

## V14 Universalized Across All Avatars (v5.3) — Voice + Expression Sync, propagation phase

The v5.2 wiring landed V14 audio in `LumiV6` only — but `LumiV6` is rendered on a small set of surfaces (`/v6` demo, landing hero, four auth pages). The vast majority of avatar instances in the app — header, footer, every chat bubble (`AIChatPanel`), every tool card, every check-in/celebration/breathing surface, the page-template nav logo — render `BuddyAvatar` (or `LumiMascot`, which wraps `BuddyAvatar`). Until v5.3, none of those instances produced any V14 audio.

This release universalizes the V14 voice through a **shared audio coordinator** in the lib so every avatar in the app cooperates and the user perceives one Lumi voice no matter how many avatar instances are mounted.

**Modified files**:
- `client/src/lib/lumiAudio.js` — added module-scoped coordinator: `tryPlayPop()` (sessionStorage one-shot, idempotent across avatar instances), `tryPlayChime(minGapMs=2000)` (single shared debounce window), `claimHeartbeat(periodMs)` / `releaseHeartbeat(token)` (single-owner interval coordinator with 340 ms safety floor enforced inside the lib). `closeLumiAudio()` now also drops any active heartbeat ownership so a re-enable can re-claim cleanly.
- `client/src/hooks/useLumiAudio.js` — re-exports the coordinator as `tryPop` / `tryChime` / `claimHeart` / `releaseHeart`, each pre-gated on `effective` so call sites never have to gate themselves.
- `client/src/components/avatar/BuddyAvatar.tsx` — wired the same three V14 integration points (entrance pop via `IntersectionObserver` → `tryPop`, heartbeat via `claimHeart`/`releaseHeart` keyed on `v.heartPulse`, chime via `onPointerDown` → `tryChime`). All three gated on the existing `animated` prop so crisis surfaces (`<BuddyAvatar animated={false} />` — used by `ErrorBoundary` and `/crisis`) stay completely silent. Heartbeat ownership is restricted to avatars rendered at ≥ 96 px so a tiny 32 px header logo doesn't grab the slot from the visible hero / tool / chat avatar.
- `client/src/components/lumi/LumiV6.tsx` — refactored the v5.2 per-instance debounce ref + per-instance `setInterval` to use the shared coordinator (`tryPop` / `claimHeart` / `tryChime`). When both `LumiV6` and a `BuddyAvatar` mount on the same page (e.g. /v6 demo + header logo), one heartbeat plays — not two overlapping — and the chime debounce is shared.
- `client/src/components/PageTemplate.jsx` — replaced the raw `<img src="/brand/lumi-v4-ultimate.png">` nav-logo straggler with `<BuddyAvatar size={32} />` so it inherits V14 audio + the canonical visual treatment with no one-off code.

**Coordinator contract** (the lib is the single source of truth — call sites stay thin):

| Cue | Coordinator | App-wide guarantee |
|---|---|---|
| Pop | `tryPlayPop()` | Exactly one entrance pop per browser session, regardless of how many avatars (header / hero / chat / footer) mount across page navigations. SessionStorage gate `lumi:audio:popped`. |
| Heartbeat | `claimHeartbeat(periodMs)` / `releaseHeartbeat(token)` | At most one heartbeat interval running at a time. First avatar to claim wins; subsequent claims return `null` and stay silent. Period clamped at 340 ms (≈ 2.94 Hz < 3 Hz seizure-safety floor) inside the lib. |
| Chime | `tryPlayChime(minGapMs=2000)` | At most one chime every 2 s across the whole app, even when the user mashes click on multiple avatars or interacts with `/v6` click-zones plus a chat bubble at the same time. |

**Crisis-safety contract** (preserved everywhere — no new escape hatches):
- All three integrations in `BuddyAvatar` are gated on the existing `animated` prop. `<BuddyAvatar animated={false} />` (used by `ErrorBoundary` + the `/crisis` route via `BuddyAvatar` directly) bypasses the audio paths *before* hitting the coordinator. The `useLumiAudio` hook is still called unconditionally per rules-of-hooks, but the effects return early.
- Reduced-motion is enforced at hook + kernel layer; either alone is sufficient. The heartbeat `useEffect` returns before calling `claimHeart` when `effective` is false, so no interval is created in the first place.
- Web Audio unavailable → `effective` is false → identical no-op path.

**Why pointer-down (not hover)**: hover firing was specced but unsafe — landing pages have hero Lumi at cursor-natural positions, so `mouseenter` would fire constantly. Pointer-down captures real intent and is what the existing `LumiV6` click-zones use, so the behavior is consistent across `LumiV6` and `BuddyAvatar`. Hover wiring can be layered on later behind a gesture-intent heuristic if you want.

**Why heartbeat ≥ 96 px gate on `BuddyAvatar`**: a single page often renders many avatars (header logo 32 px, footer logo 40 px, chat bubble 32 px, hero 160 px, tool card 64 px). Whichever mounts first wins the claim — and we want that to be the visible hero, not a corner logo. The 96 px gate naturally restricts ownership to "feature" avatars (`md` token = 64 px does NOT claim, `lg` = 128 px and `xl` = 208 px DO claim). When a user lands on a page with no large avatar (e.g. a list view), no heartbeat plays — which is the right answer audibly.

**Verification**:
- `npx tsc --noEmit` — exit 0.
- All representative routes (`/`, `/v6`, `/chat`, `/crisis`, `/checkin`, `/tools/breathing`, `/celebration`, `/about`) — 200.
- Workflow logs — clean.
- Manual: with audio toggled OFF on `/v6`, every surface behaves byte-identically to v5.2 (no audio, no extra timers because each `useEffect` returns before scheduling work).
- Default OFF preserved — `readEnabled()` still returns false when localStorage is empty.

**Scope note (V9 Soul Capture propagation)**: Pop + heartbeat + chime now reach every avatar surface. The remaining V9 features (sentiment-driven mirroring, recognition memory, escalation tracking) require per-surface signal plumbing (chat sentiment, journal sentiment, etc.) and are not universalizable through the avatar layer alone — they need to be opted into per-surface by passing a `detectedSentiment` prop, which is how `LumiV6` already exposes it. This is a separate phase; not landed in v5.3.

---

## V14 Wired Into LumiV6 (v5.2) — Voice + Expression Sync, integration phase

The v5.1 audio engine is now wired into the live `LumiV6` component at the three V14 spec'd integration points. All wiring sits behind the same `lumi:audio:enabled` localStorage flag (default **OFF**) plus the existing `prefers-reduced-motion` and Web Audio availability gates, so behavior is unchanged for every existing user until they explicitly opt in on `/v6`.

**Modified files**:
- `client/src/components/lumi/LumiV6.tsx` — added `useLumiAudio()` hook call, three call sites (entrance pop, heartbeat interval, chime in `fireOverride`), and one debounce ref. Net additions: ~35 lines, all visually scoped to `// V14:` comments. Zero changes to existing visual behavior, props, derivation tables, or click-zone logic.
- `client/src/lib/lumiAudio.js` — retuned all three tones to the user's exact V14 spec (pop 0.3 s 800 → 1200 Hz vol 0.08; heartbeat 0.18 s 110 → 80 Hz vol 0.05 single thud; chime 0.20 s bell harmonic stack 660 Hz + 1320 Hz vol 0.06). The 0.08 ceiling on the kernel `playTone()` is unchanged; the new pop sits exactly at that ceiling, every other tone is below it.
- `client/src/hooks/useLumiAudio.js` — renamed localStorage key from preview-era `mmhb-lumi-audio-enabled` to canonical `lumi:audio:enabled` per the V14 spec. Includes a one-time `migrateLegacyKey()` that copies any existing preview-era value into the new key on first read and removes the legacy entry. Pure additive — no user setting is lost.
- `client/src/pages/LumiV6Preview.jsx` — updated the panel's documentation copy to show the canonical key name.

**Wiring detail (each integration point)**:

1. **Entrance pop** — fires inside the existing V9 `IntersectionObserver` callback (`LumiV6.tsx` line 539). Independent sessionStorage gate `lumi:audio:popped` (separate from `lumi:v9:entered` so a user can flip the audio toggle mid-session and still get exactly one pop after the flip). The gate is only set once `pop()` actually returns `true` — so a no-op (audio off / reduced motion / Web Audio unavailable) does not consume the one-shot.
2. **Heartbeat sync** — separate `useEffect` keyed on `[animated, lumiAudio.effective, heartPeriodMs, lumiAudio]`. Schedules `setInterval(heartbeat, max(340, heartPeriodMs))`. The 340 ms floor is a defensive safety floor (≈ 2.94 Hz) — even if a future emotion table sets `heartHz > 3`, the audio cadence is clamped under the 3 Hz seizure-safety threshold from the V14 spec. The visual heart pulse continues at its native cadence; only the audio is clamped.
3. **Interaction chime** — added inside `fireOverride()` (the existing click-zone handler), gated on `animated` with a per-instance `lastChimeAtRef` debounce of ≥ 2000 ms. Mirrors the V11 prime directive: even if a user mashes head/heart/body click zones, the chime fires at most every 2 seconds. Debounce timestamp is only updated when `chime()` actually returns `true`, so silent no-ops don't burn the debounce window either.

**Crisis-safety contract** (preserved):
- All three integrations are gated on `animated`. Crisis surfaces (`<LumiV6 animated={false} />`) stay completely silent in addition to staying still — the existing visual contract automatically becomes an audio contract.
- Reduced-motion is enforced at *both* the kernel layer (`prefersReducedMotion()` check inside `ensureContext`) and the hook layer (`reducedMotion` state in `effective`). Even a stale ref or future call site can't bypass it.
- The hook's `effective` flag is the single master mute. `lumiAudio.pop()`, `.heartbeat()`, `.chime()` are all silent no-ops when it's false — call sites don't have to gate themselves.

**Why no hover chime**: The user's V14 spec said "click/hover" for the chime trigger. Hover-fire would be too noisy on landing pages where the cursor naturally crosses Lumi (think hero sections), and the 2 s debounce alone wouldn't fully suppress the unintentional triggers. Wiring chime to the deliberate click-zone path (head / heart / body) instead matches the V11 prime directive — "whisper-quiet, never startling, always intentional". Hover wiring can be added later if you want, but it should layer on top of a gesture-intent heuristic, not raw `mouseenter`.

**Verification**:
- `npx tsc --noEmit` — exit 0.
- All 7 representative routes (`/`, `/v6`, `/chat`, `/crisis`, `/checkin`, `/tools/breathing`, `/celebration`) — 200.
- Workflow logs — clean (only pre-existing schema/SSL warnings).
- Manual: with audio toggled OFF on `/v6`, every wellness surface behaves byte-identically to v5.1 (no audio, no extra timers fire because the heartbeat `useEffect` returns early before creating an interval).

---

## Lumi Voice + Expression Sync (v5.1) — V14 phase

A tiny Web Audio kernel that gives Lumi three optional voice cues — a gentle entrance **pop**, a synced **heartbeat**, and an interaction **chime** — gated behind an explicit user preference. Default **OFF**. Per the V13 roadmap the engine ships first; per-surface auto-wiring (entrance / pulse / interaction) is intentionally deferred so the v4.5–v5.0 polish remains untouched until the user approves broader integration.

**New files**:
- `client/src/lib/lumiAudio.js` — programmatic Web Audio synth. No audio files (zero asset weight, no CSP/MIME issues). Three exported play functions plus `unlockLumiAudio()`, `isLumiAudioAvailable()`, `closeLumiAudio()`. Lazy `AudioContext` (created on first call so the browser's user-gesture rule is honored). Reduced-motion guard built into the kernel — every `play()` is a silent no-op when the OS pref is set.
- `client/src/hooks/useLumiAudio.js` — React hook backing the `mmhb-lumi-audio-enabled` localStorage flag. Listens to `storage` events for cross-tab sync and to `(prefers-reduced-motion: reduce)` `MediaQueryList` changes for live OS-pref tracking. Exposes `enabled`, `effective`, `available`, `reducedMotion`, `setEnabled`, and the three safe play methods (`pop`, `heartbeat`, `chime`) — callers don't have to gate.

**Modified file**:
- `client/src/pages/LumiV6Preview.jsx` — added `LumiAudioPanel` sub-component rendered just above `ToySpecPanel` on `/v6`. Toggle + status text + three preview buttons (pop / heartbeat / chime), each with `data-testid` and `aria-label`.

**Sound design** (matches V11 prime directive — "whisper-quiet, never startling"):
- **Pop** — sine wave, 220 → 440 Hz exponential ramp, 180 ms, peak gain 0.05.
- **Heartbeat** — two-beat lub-dub. Lub: sine 110 → 90 Hz, 100 ms, gain 0.045. Dub (180 ms later via `setTimeout`): sine 95 → 75 Hz, 120 ms, gain 0.04. Total envelope ~440 ms, well under the 3 Hz seizure-safety threshold.
- **Chime** — triangle 660 Hz fundamental + 880 Hz overtone (60 ms apart), each 180 ms, peak gain 0.045 / 0.035.
- All gains hard-capped at 0.08 (≈ -22 dBFS) inside `playTone()` — even a coding mistake can't exceed the whisper-quiet ceiling.
- All envelopes use exponential ramps to avoid click artifacts on attack/release.

**Universal contract honor on this surface**:
- ✅ Default **OFF** — `localStorage.getItem('mmhb-lumi-audio-enabled')` returns `null` on a fresh install, parsed as `false`.
- ✅ Reduced-motion blanket — both the kernel (`prefersReducedMotion()` guard at the top of every play) and the hook (`reducedMotion` state) treat `prefers-reduced-motion: reduce` as a hard mute even when the user enabled audio. Status text in the panel makes this explicit to the user.
- ✅ Brand palette — toggle uses sky-50/200/600 (a neutral UI-affordance color in the existing `/v6` panel idiom), and each preview button uses an existing brand-aligned ring (amber for pop, rose for heartbeat, emerald for chime) drawn from the `/v6` palette already in use elsewhere on the page. No new accent colors introduced.
- ✅ Crisis routing preserved — `/v6` still renders the rose Crisis Support nav link in its top bar.
- ✅ Accessibility — toggle is a real `<input type="checkbox">` inside a `<label>` (full keyboard reachability, screen-reader-friendly), `aria-describedby` ties the toggle to its live status text, every preview button has an `aria-label`, the section is `aria-labelledby` to the heading.
- ✅ Cross-tab sync — `storage` event listener flips the toggle in real time if the user changes the pref in another tab.
- ✅ Resource hygiene — `useEffect` calls `closeLumiAudio()` when the user disables audio, releasing the underlying `AudioContext` device handle.

**Deferred (intentional per V13 phasing)**:
- Auto-play on Lumi entrance (would need wiring into `BuddyAvatar` mount).
- Sync to the LumiV6 heart pulse cadence (would need to call `heartbeat()` on the same period as the existing CSS `lumi-heart-pulse` animation).
- Chime on interaction (tap, sentiment-mirror, celebration trigger).

These are single-line additions once the user approves the engine. Documented as the next V14 follow-up rather than shipped this turn — keeps the polished v4.5–v5.0 surfaces unchanged and preserves the user's right to preview the cues in isolation before they appear unsolicited.

---

## Emotional Journey Section (v5.0) — V13 port from kimi.page deployment

A new full-width section between the landing page's tools section and the philosophy section, surfacing the **6-phase emotional flow** (CALM → ORIENT → CONNECT → SUPPORT → REWARD → CONTINUE) as a vertical timeline so users can see the gentle path before they walk it. Replaces nothing — purely additive insert.

**New files**:
- `client/src/data/emotionalJourney.js` — 6-entry array `[{ phase, path, color, label, description }]`. Colors are drawn from the canonical 8-hex brand palette (sage `#A8C9A0`, calm-blue `#74C0FC`, empathy-purple `#C8B6FF`, sunshine `#FFD93D`, blush `#FF9A8B`, sage `#A8C9A0` for Return — five of the eight; mint, warmth-orange, and heart-amber are unused on this surface). Routes (`/`, `/tools/breathing`, `/checkin`, `/celebration`, `/chat`, `/`) match existing application paths — V13's spec called for `/lumi` for the REWARD phase, but no `/lumi` route exists in MMHB's `App.jsx`; `/chat` is the canonical AI-companion surface in this codebase, so the REWARD phase points there to avoid a dead link.
- `client/src/sections/EmotionalJourney.jsx` — accessible `<section>` with `aria-labelledby`, semantic `<ol>` of phase cards. Each card is a `wouter` `<Link>` (SPA navigation, not `<a href>`) with per-phase `data-testid="link-journey-{phase}"`. Lucide icons (`Wind`, `Sparkles`, `Heart`, `Shield`, `Sparkles`, `RotateCcw`) selected to evoke the phase's emotional tone. Section ends with a `/crisis` referral line so the universal crisis-routing contract is honored on this surface too.

**New CSS** (`client/src/styles/canva-landing.css` lines 2506-2628, scoped under `.emotional-journey-polish`):
- **Vertical timeline**: absolutely positioned 2px line behind the dot column with a top-to-bottom gradient through every phase color at `33` alpha. Lives in a sibling `<div className="relative">` *next to* the `<ol>` (not inside it) so the `<ol>` stays semantically clean — only `<li>` children, no decorative span polluting the list. The line's `left` offset (`2rem` mobile, `2.25rem` ≥640px) plus a `-1px` margin is the exact mathematical center of the dot column (card pad `0.5rem` + half-dot `1.5rem`/`1.75rem`).
- **Per-phase entrance**: each `<li>` starts at `opacity: 0; translateY(12px)`, then animates in via `emotional-journey-reveal` (0.6s `cubic-bezier(0.4, 0, 0.2, 1)`) with a staggered `--journey-delay: ${index * 90}ms` CSS custom property set inline — phases cascade smoothly down the column.
- **Scroll-trigger**: `IntersectionObserver` with `threshold: 0.15, rootMargin: '0px 0px -10% 0px'` toggles `.revealed` on the section, gating the keyframes — the section doesn't animate until it scrolls into view (matches the existing `.section-reveal` pattern). Observer self-unsubscribes after first reveal.
- **Hover/focus**: card lifts via `translateX(2px)` + cream background (`rgba(255,255,255,0.6)`) + soft sage glow box-shadow; dot scales 1.08× with a 6px white ring. Both hover and `:focus-visible` are wired so keyboard users get the same affordance.
- **Reduced-motion contract**: `@media (prefers-reduced-motion: reduce)` forces `opacity: 1; transform: none` on every item, kills the entrance animation, kills card/dot transitions, and pins hover/focus transforms — the section appears fully revealed and static. Additionally, the JS guard reads `prefers-reduced-motion` at mount and immediately applies `.revealed` (skipping the IntersectionObserver entirely) so the static fallback works even when the section is below the fold.
- **Z-index**: gradient line `z-index: 0`, items `z-index: 1` — content always above the connecting line.

**No new dependencies**: framer-motion is *not* installed in this codebase, so the V13 prompt's `framer-motion` recommendation was substituted with CSS keyframes + a small `IntersectionObserver` hook, matching the existing `.section-reveal` pattern used everywhere else on `CanvaLanding.jsx`. Lucide icons and `wouter` were already in the import graph.

**Insertion** (`client/src/pages/CanvaLanding.jsx`): single `<EmotionalJourney />` component dropped between the existing `consciousness-divider` after the tools section and the `#philosophy` section, with a matching divider below it. The landing page's section order is now: hero → tools → **emotional journey** → philosophy → features → … (zero changes to any other section).

**Color contract**: all six phase colors are canonical brand hex with low-alpha derivatives (`${color}1A` for dot fill, `${color}66` for dot border, `${color}33` for the gradient line). Background uses the existing `--glp-paper` token. No new colors introduced.

**Universal contracts honored**:
- ✅ Scoped under unique `.emotional-journey-polish` wrapper class — zero leak risk
- ✅ Only canonical brand hex (sage / calm / empathy / sunshine / blush) — no new colors
- ✅ `prefers-reduced-motion` blanket: reveals immediately, no entrance, no hover transforms
- ✅ Z-index contract: decorative line (0) → content (1)
- ✅ Visual-first additive: zero changes to routing, state, or any other component
- ✅ Crisis routing preserved (`/crisis` referral at section bottom)

---

## /v6 Control Panel Polish (v4.9)
The `/v6` Lumi preview page (`client/src/pages/LumiV6Preview.jsx`) gains four additive "control panel feel" layers per V10 §3.5, all scoped under `.v6-preview-polish`. New CSS in `client/src/styles/v6-preview.css` (~70 lines, 1 keyframe — `v6-preview-entrance`).

1. **Workspace ambient wash** (`.v6-preview-wash`, z-index 0) — twin radial sage-top + empathy-purple-bottom glows that frame the page as a focused workspace rather than a flat layout. Pure opacity, no transitions.
2. **Page entrance** (`.v6-preview-content`) — single 500ms `ease-out` fade + 8px translate-up on mount. Verified non-conflicting with the LumiV6 V9 IntersectionObserver entrance (different observers, different scopes).
3. **Cell hover lift** (`.v6-preview-cell-hoverable`, applied to the local `Cell` component) — 3px lift + soft amber drop-shadow on hover. **`will-change: transform` is scoped to `@media (hover: hover) :hover`** (not always-on) so the dense 30+ cell grid doesn't pay continuous compositor/GPU memory overhead at rest — only the cell currently being hovered allocates a layer.
4. **Section-header underline accent** (`.v6-preview-section-header`) — 56×3px sunshine→warm-orange gradient bar under the main h1 to anchor the visual hierarchy.

**Reduced-motion contract**: dedicated `@media (prefers-reduced-motion: reduce)` block disables entrance, hover transform, and shadow — wash stays since it's opacity-only with no transition. **Z-index contract**: wash (0) → content (`relative z-10`). Internal LumiV6/V8/V9 demo functionality, click zones, and IntersectionObserver entrances are completely untouched.

---

## Celebration Polish (v4.8)
The `/celebration` route (`client/src/pages/CelebrationFlow.jsx`) gains four additive polish layers per V10 §3.4, all scoped under `.celebration-polish`. New CSS in `client/src/styles/celebration.css` (~125 lines, 4 new keyframes — `celebration-sparkle-twinkle`, `celebration-phase-entrance`, `celebration-streak-burst`, `celebration-streak-glow`).

1. **Sunshine radiance wash** (`.celebration-wash`, z-index 0) — twin `::before`/`::after` pseudo-element layers that **cross-fade via opacity** between an "early" warmer-orange tint (phases 1-2) and a "settled" calmer gold tint (phase 3) when `[data-phase="3"]` flips both. Same proven pattern as Check-In — opacity transitions on persistent layers because gradient `background` shorthand snaps cross-browser.
2. **6 ambient gold sparkle particles** (`.celebration-sparkle-layer`, z-index 1) — twinkle in place across all 3 phases via `celebration-sparkle-twinkle` (3.6s ease-in-out, opacity 0 → `var(--sp-opacity, 0.14)` → 0). Per-particle `--sp-opacity` (0.10-0.18) and staggered `animation-delay` (0/0.6/1.2/1.8/2.4/3.0s) so they pop in sequence. Distinct from the existing falling confetti so warmth sustains after confetti stops in phase 3. Conditionally rendered via `{!reducedMotion && (...)}` in JSX **and** `display: none !important` in the reduced-motion CSS block (defensive double-coverage handles `matchMedia` change after mount).
3. **Per-phase content entrance** (`.celebration-phase-enter`) — `key={phase}` on the `<section>` forces remount and replays a 600ms `cubic-bezier(0.34, 1.56, 0.64, 1)` fade + 12px translate-up + 0.96→1 scale spring on every phase transition.
4. **Streak badge entrance + glow** (`.celebration-streak-badge`) — wraps the phase-2 streak number ("X moments") in an inline-block with a 800ms scale-in burst (0.7 → 1.08 → 1) and a sustained `::before` radial-gradient glow ring (`inset: -8px -16px`, `z-index:-1`) that pulses opacity 0.7 → 1.0 → 0.7 every 2.4s to draw the eye to the achievement.

**Z-index contract** (architect-fixed): wash (0) → sparkle layer (1) → **confetti (z-index 2 explicit inline style)** → content (`relative z-10`). The confetti previously had no explicit z-index, so it would have rendered above the sparkles but below the content correctly only by source order — explicit z-index 2 makes the stacking deterministic. **Reduced-motion contract**: sparkle layer hidden, all entrance/badge/glow animations killed, wash transitions disabled. Existing confetti gating (`!reducedMotion && phase < 3` in JSX) untouched. The 3-phase auto-advance, localStorage streak math, ARIA live region, and BuddyAvatar integration are completely untouched.

---

## Check-In Polish (v4.7)
The `/checkin` route (`client/src/pages/CheckIn.jsx`) gains four additive polish layers, all scoped under a single `.checkin-polish` class on the existing root container. Zero changes to the 4-phase flow (select → intensity → note → complete), localStorage logic, streak math, ARIA wiring, or `BuddyAvatar` integration. New CSS lives in `client/src/styles/checkin.css` (~155 lines, 3 new keyframes — `checkin-particle-drift`, `checkin-greeting-entrance`, `checkin-emotion-pulse`).

1. **Soft purple wash** (`.checkin-wash`, z-index 0) — overlays the existing emerald→white→emerald Tailwind gradient with an empathy-purple ambience per V10 §3.3. Implemented as **two stacked `::before`/`::after` pseudo-element layers** (purple base opacity 1, sunshine celebration opacity 0) that **cross-fade via `opacity` transitions** when `data-phase="complete"` flips both — gradient `background` shorthand transitions snap rather than animate cross-browser, so opacity on persistent layers is the only way to get a smooth phase tint change.
2. **5 floating empathy-purple particles** (`.checkin-particle-layer`, z-index 1) — same per-particle `--cp-opacity` CSS var pattern (0.04-0.08) consumed at the keyframe's 10%/90% stops, so each particle keeps its intended subtle variance instead of normalizing to a single fallback. 42-66s upward drift.
3. **Header greeting entrance** (`.checkin-greeting`) — 700ms `cubic-bezier(0.4, 0, 0.2, 1)` fade + translate-up that **replays per phase** via `key={phase}` on the `<header>` (verified safe — no local state, no focusable controls, no `aria-live` re-announce risk).
4. **Per-emotion card accent** (`.checkin-emotion-card[data-emotion-accent]`) — each of the 6 emotion cards maps to a canonical brand hex via CSS var (`--emotion-accent`): calm→#74C0FC, anxiety/sadness→#C8B6FF, tiredness→#A8D5BA, frustration→#FFB88C, gratitude→#FF9A8B. Hover/focus lifts the card 2px with a tinted bg + glow ring; selection (`data-selected="true"`) gets a stronger persistent glow + a 1.2s one-shot `checkin-emotion-pulse` ring expansion.

**Pulse visibility fix (intentional UX timing exception)**: `pickEmotion()` defers the `setPhase('intensity')` transition by 350ms via a ref-tracked `window.setTimeout` (skipped under reduced motion), so users perceive the selected glow + pulse before the grid unmounts; the timer is cancelled on unmount via `useEffect` cleanup and on rapid re-clicks via the same ref guard, preventing stacked callbacks and stale-setState warnings. This is the one documented departure from the otherwise pure-visual contract — the phase progression itself, the 4-phase model, the localStorage math, and the ARIA wiring are all unchanged; only the moment of transition is delayed by 350ms in the motion-allowed path. **Reduced-motion contract**: dedicated `@media (prefers-reduced-motion: reduce)` block hides the particle layer entirely, kills all card / greeting animations & transitions, and disables both `::before`/`::after` opacity transitions on the wash — header stays visible (no `from`-state freeze because base `.checkin-greeting` has no forced opacity/transform). Phase transitions become instantaneous under reduced motion (no 350ms delay). **Z-index contract**: wash (0) → particles (1) → existing inner content wrapper now bumped to `relative z-10` so functional content always sits above decorative layers.

---

## Breathing Tool Polish (v4.6)
The `/tools/breathing` route (`client/src/pages/tools/BreathingTool.jsx`) gains four additive polish layers, all scoped under a single `.breathing-tool-polish` class on the existing root container. Zero changes to behavior, timing (4-2-4 cycle × 3), accessibility wiring, or the existing inline-styled breath-circle. New CSS lives in `client/src/styles/breathing-tool.css` (~165 lines, 3 new keyframes — `breathing-particle-drift`, `breath-ring-pulse`, `breath-progress-pulse`).

1. **Breath-synced background tint** (`.breathing-bg-tint`, z-index 0) — radial wash that shifts hue per phase via `data-phase` and `data-breath-sub` attribute selectors on the root: calm-blue baseline → mint during hold → warm-orange during exhale → soft-purple in checkin → sunshine in complete. React's behavior of omitting `data-*` when value is `undefined` means selectors only match during the breathing phase, so non-breathing phases get the default tint without state leaks. 1.6s `ease-in-out` transition.
2. **Floating calm-blue particles** (5 spans, opacity 0.05-0.10 driven by per-particle `--bp-opacity` CSS var consumed at the keyframe's 10%/90% stops — same architect-validated pattern as the homepage hero, never normalizes to a single fallback).
3. **Concentric breath rings** (`.breath-ring--inner` 130%, `.breath-ring--outer` 165%, both `z-index:-1` inside a `.breath-rings-wrapper` parent with `isolation: isolate` so they render behind the avatar without bleeding past the wrapper's stacking context). The `breath-ring-pulse` keyframe is exactly **10s = 4s inhale + 2s hold + 4s exhale**, with stops at 0% (scale 0.85, exhale floor) → 40% (scale 1.18, inhale peak at 4s) → 60% (scale 1.18, hold plateau through 6s) → 100% (scale 0.85, back to exhale floor at 10s). The outer ring trails the inner by 150ms via `animation-delay` so the rings read as a wave instead of a single pop. Rings are gated by a `breath-rings-wrapper--active` modifier class that's only applied during the breathing phase, hiding them otherwise.
4. **Breath-cycle progress** — three 36×6px segments below the seconds display, filled L-to-R as `breathIdx` advances via `data-state="done|active|pending"`. The active segment gets a 2.5s `breath-progress-pulse` halo (3px → 5px box-shadow) for a breathing rhythm cue. The whole element is wrapped in `role="progressbar"` with `aria-valuemin/max/now` and an `aria-label`, supplementing (not replacing) the existing "Breath X of 3" text in the header.

**Reduced-motion contract**: a dedicated `@media (prefers-reduced-motion: reduce)` block in the same file hides the particle layer entirely, kills all ring/progress/bg-tint animations & transitions, and pins ring transforms to `scale(1)` — extending the existing inline `<style>` block in `BreathingTool.jsx`. **Z-index contract**: tint (0) → particles (1) → existing inner content wrapper now bumped to `relative z-10`.

---

## Homepage Hero Polish (v4.5)
The `CanvaLanding.jsx` hero section gains four additive polish layers, all scoped under a single `.canva-landing-hero-polish` class on the existing `<section id="home">` so nothing leaks into the rest of the landing page.

1. **Warm cream overlay** (`.hero-cream-overlay`, z-index 0) — a radial cream wash + linear gradient sits above the existing sage→teal hero gradient, warming the upper hero without losing the brand tones at the edges.
2. **Soft sage particles** (`.hero-particle-layer` with 8 `<span class="hero-particle">` children, z-index 1) — each particle is a 8-18px sage-tinted radial gradient that drifts upward over 46-70s on `hero-particle-drift` keyframes. Per-particle `--p-opacity: 0.03 / 0.04 / 0.05` CSS custom properties drive the keyframe's mid-cycle opacity stop (`opacity: var(--p-opacity, 0.04)` at 10%/90%) so each particle keeps its intended subtle variance instead of normalizing to a single fallback value — the architect-flagged bug from the first pass.
3. **Lumi scale-in entrance** (`.hero-lumi-wrapper`) — the existing 208px hero Lumi container gets an 800ms `cubic-bezier(0.34, 1.56, 0.64, 1)` `hero-lumi-entrance` keyframe (scale 0.8 → 1.04 → 1, opacity 0 → 1) that runs in parallel with the parent's existing `animate-fade-in-up` translate. Transforms compose cleanly across the parent/child (parent translates, child scales — no transform fight on the same node).
4. **Hover lift** (`.hero-lumi-wrapper:hover`) — a 0.3s `transform: scale(1.03)` + `filter: drop-shadow(0 8px 24px rgba(168,201,160,0.35))` gives a subtle invitation cue when users mouse over the mascot.

**Reduced-motion contract**: hides `.hero-particle-layer` entirely (`display: none !important`) and forces the Lumi wrapper to `animation: none !important; transition: none !important; opacity: 1; transform: none`. **Z-index contract** (v4.5.1 normalization): `.hero-depth-layer` (0, explicit) → cream overlay (0) → particles (1) → `.decorative-orb` (2, explicit) → hero content (`z-10`); pointer-events disabled on every decorative layer so click targets aren't blocked. The explicit `.hero-depth-layer` and `.decorative-orb` z-index assignments live in the polish CSS but are scoped under `.canva-landing-hero-polish` so they only affect the hero stack — no leak to other landing sections that use the same classes. **Color note**: the hero polish uses the canonical brand sage / amber for particles + Lumi drop-shadow, plus low-alpha cream/white RGBAs (`rgba(249,247,244,…)`, `rgba(240,237,230,…)`, `rgba(255,255,255,…)`) for the ambient warm-cream overlay — neutral bases only, never as a brand accent. CSS additions: `client/src/styles/canva-landing.css` lines 2400-2502.

---

## LumiV9.6 + V9.7 "Soul Capture" additions (v4.4)
Two purely-additive layers extend the V9 work without changing any existing caller behavior. Both gate strictly on `v9 && animated` so crisis surfaces (which pass `animated={false}`) get zero new motion, and both live inside the `.lumiv6` namespace so the existing reduced-motion blanket already covers them.

1. **V9.6 Recognition micro-expression** ("Welcome Back"): on mount, `LumiV6.tsx` reads `sessionStorage.getItem("lumi:v9:lastEmotion")` — if a value is present and differs from the current `effectiveEmotion`, sets `v9Recognition=true` for 600ms (driving the `lumiv6--v9-recognition` class), **then** writes the new emotion back to sessionStorage. A `v9RecognitionRanRef` ref guard makes the effect StrictMode-safe — React 18 dev-mode mount/unmount/remount cycle preserves refs, so the second invocation early-returns and the user sees recognition fire exactly once per real mount instead of being suppressed by the first invocation's storage write. The CSS pairs `lumiv9RecognitionEyes` (scaleY 1→1.18→1, eye-widen) on `.lumiv6__pupil` with `lumiv9RecognitionHeart` (scale 1→1.22 + brightness 1.4 + 8px amber drop-shadow flare) on `.lumiv6__heart` for a single 600ms "I remember you" beat before the normal heart driver resumes. Per-instance scope (mount-only effect) prevents multi-Lumi pages from cross-firing.
2. **V9.7 Visceral Glow** ("The Warmth Engine"): always-on (when `v9 && animated`) class `lumiv6--v9-visceral-glow` runs `lumiv9VisceralGlow` on `.lumiv6__heart` — a brighter replacement for the baseline pulse using `transform: scale(1 → 1.14 → 1.06 → 1)` + `filter: brightness(1 → 1.3 → 1.1 → 1)` + amber `drop-shadow` (0 → 10px → 6px → 0) keyed off the **`--lumiv6-heart-period`** CSS var (the canonical name set by the heart-rate driver in `LumiV6.tsx` and overridden by escalation levels at 600/450/300ms) so emotion-driven and escalation-driven heart-rate changes still drive cadence automatically.

**CSS cascade contract**: visceral-glow is declared FIRST in the appended block (line ~779) and recognition / mirroring / goodbye / heart-burst rules are declared AFTER (recognition lines ~810; mirroring/goodbye/burst pre-existed earlier in V9 lines ~727-745) so during their brief windows the transient meaning-bearing animation wins on equal-specificity last-rule cascade — no `!important`, no specificity hacks, no invalid `:not()` descendant selectors. Net result: the heart reads as a warm living organ instead of a flat pulse, while preserving the 7-color brand DNA, never touching crisis stillness, and never blocking transient overrides. CSS additions: `LumiV6.css` lines 769-820 (52 net lines, 3 new keyframes — `lumiv9RecognitionEyes`, `lumiv9RecognitionHeart`, `lumiv9VisceralGlow`).

---

## LumiV9 "Soul Capture" (v4.3)
The `LumiV6` component (`client/src/components/lumi/LumiV6.tsx`) gains an additive V9 layer on top of V6/V7/V8 — every existing caller renders identically because all V9 behaviors are gated behind two new optional props (`v9?: boolean` master flag, `detectedSentiment?: LumiV6Emotion | null` for mirroring). Five new behaviors:

1. **Entrance** — IntersectionObserver-triggered 800ms scale/blur "birth" sequence, sessionStorage-gated to fire exactly once per browser session globally (`lumi:v9:entered`).
2. **Attention capture** — after 15s of no Lumi-local interaction, when cursor enters a 200px radius, plays a 600ms "I noticed you" wobble + 3s gaze-lock window (intensified aura).
3. **Emotional escalation** — `recordEscalation()` tracks click-zone activations in a 10s rolling window and drives `lumiv6--v9-escalation-{1|2|3}` class hooks (warm aura → excited bounce + wider eyes → celebration sparkle + rapid heart pulse).
4. **Mirroring micro-expression** — when `detectedSentiment` differs from `emotion`, briefly (1.5s) overlays it as a `lumiv6--v9-mirroring` heart flash, lower priority than user click triggers so intentional touch always wins.
5. **Goodbye sequence** — fires on `window.beforeunload` OR 5min global inactivity, runs wave + 3 slow heart pulses + 1s fade.

**Safety contracts preserved**: every V9 effect is gated on `animated` (so crisis surfaces using `animated={false}` get zero V9 motion), and the existing `@media (prefers-reduced-motion: reduce) { .lumiv6 *, .lumiv6 { animation: none !important; transition: none !important; } }` blanket already covers all `lumiv6--v9-*` modifiers because they live inside the `.lumiv6` namespace. **Backward compat**: V8 click-zone `fireOverride` now also bumps `lastLumiInteractionRef` and (when `v9` is true) calls `recordEscalation` — both are no-ops when V9 is off. Effective-emotion layering is now `triggeredEmotion ?? v9MirrorEmotion ?? emotion`. Playground `/v6` (`LumiV6Preview.jsx`) gains a `<V9DemoSection>` with three side-by-side Lumis (V8 baseline, V9 base, V9 + clickable + sentiment), 5 mirror-sentiment chips (joy/love/empathy/surprise/calm), and a "Replay entrance" button that clears the sessionStorage gate. All 7 brand hex values remain unchanged. CSS additions: 6 new `lumiv9*` keyframes appended to `LumiV6.css` (lines 614-760).

---

## Schema Drift Guardrail (v4.2)
The workspace has multiple Drizzle `pgTable(...)` declaration sites that have grown organically: `shared/schema.mjs` is the **canonical source of truth** (78 tables, 46 importers); `server/db/schema.mjs` + `server/db/schema/*.{js,mjs}` hold server-internal duplicates (`users`, `refreshTokens`, etc.); `db/schema.ts` is a 271-byte legacy stub with **0 active importers** but a dangerous `users.id: serial` declaration (canonical is `uuid`); `database/schema/*.ts` is empty scaffolding that `drizzle.config.ts` points at for migration generation. Because `drizzle.config.ts` is forbidden to edit per dev guidelines, the four-source structure is preserved; instead, `scripts/checkSchemaDrift.mjs` provides a CI-grade guardrail that text-parses every `pgTable(...)` definition across `shared/`, `server/`, `db/`, `database/`, and `client/src/`, then for any table declared in >1 location reports both **column-set drift** (`missing_columns`) and **column-type drift** (`type_drift`, e.g. `serial` vs `uuid` on a primary key — the exact landmine pattern that compiles fine but corrupts the runtime). Run before any `npm run db:push` or schema PR: `node scripts/checkSchemaDrift.mjs` (human report) or `--json` (machine-readable). Exits non-zero on drift. Documented current dormant divergence: `db/schema.ts` `users.id` is `serial` while canonical is `uuid` — the file has zero importers so no runtime impact, but the guardrail flags it so any new importer of the stub triggers a CI failure instead of a silent column-type bug.

---

## Avatar Uniformity (v4.1)
All platform surfaces now render the canonical Lumi mascot PNG (`mmhb_buddy_interactive_fullbody_1777538625498.png`) instead of legacy Heart icons or robot emojis. Surfaces patched: `layout/Header.jsx` (AppShell header logo, 44px with sage radial halo), `PageTemplate.jsx` (AutopilotPage nav logo 32px + hero logo badge 28px), `CanvaLanding.jsx` hero (LumiCompanion 208px, interactive, lumi-breathe), `AIChatPanel.tsx` (assistant avatar 32px with lumi-breathe on typing), `Login.jsx`/`Register.jsx`/`ForgotPassword.jsx`/`ResetPassword.jsx` (centered Lumi with sage halo). All images include `onError` graceful fallback and `objectFit: contain`. The admin rate limiter (`adminLimiter` in `server/app.mjs`) is identity-keyed (user.id/email) at 200 req/min to prevent 429s during dashboard init fan-out; `adminLoginLimiter` stays strict at 10/min for brute-force protection.

---

## Learning Library Bug Fix (v4.1.1)
`CourseCatalog.jsx` course cards now use explicit inline styles (`#1a1917` title, `#4a4540` description, `#ffffff` card bg, `#c8d9c8` border, `#2d5a3d` "View Course" button with white text) instead of CSS-variable-dependent Card components, fixing invisible text and dark-block buttons caused by broken Tailwind opacity modifiers on CSS variables. Search bar, category filter buttons (with amber active state), and the amber-gradient CTA button were already correct. `AIChatPanel.tsx` error handling improved with crisis-aware fallback message including 988 and `/crisis` routing.
