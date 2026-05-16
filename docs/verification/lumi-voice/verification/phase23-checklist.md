# Phase 23 — Lumi Voice Presence — Verification Checklist

## Module location
- `client/src/lumi-voice/` — standalone, opt-in, zero production wiring.

## File inventory (14 spec files + barrel)
- runtime/BreathPacingEngine.ts
- runtime/VoicePlaybackController.ts
- runtime/VoicePresenceEngine.ts
- runtime/useVoicePresence.ts
- profiles/softNeutral.ts
- profiles/warmCalm.ts
- profiles/sleepyQuiet.ts
- governance/voiceSafetyRules.ts
- governance/antiManipulationRules.ts
- accessibility/captionsMode.ts
- accessibility/reducedAudioMode.ts
- components/VoiceToggle.tsx
- components/VoiceCaptionOverlay.tsx
- verification/phase23-checklist.md
- index.ts (barrel)

## FROZEN breath cycle
- Total: 7100ms
- inhale 2800ms · hold 400ms · exhale 3600ms · rest 300ms
- Module-load assertion: durations sum to 7100ms (throws otherwise).
- `getCurrentBreathPhase(elapsedMs)` is pure; modulo cycle; SSR-safe.

## Voice safety floors
- `MAX_VOICE_VOLUME = 0.4` (hard cap; enforced at sink in VoicePlaybackController).
- `MIN_VOICE_RATE = 0.5`, `MAX_VOICE_RATE = 1.5` (clamped at sink).
- `FORBIDDEN_PHRASES` — 23 entries (15 invalidation + 3 coercion + 2 urgency + 3 commercial-upsell), floor guard throws if < 23. Architect-driven hardening (v5.8.60).
- `FORBIDDEN_AUDIO_EFFECTS` — 8 entries, floor guard throws if < 8.

## Anti-manipulation
- 4 categories: romantic_language, possessive_framing, fake_empathy, dependency_creation.
- Floor guard throws if categories < 4.
- `findManipulationHits(text)` returns category + pattern source per match.
- VoicePlaybackController.speak() refuses utterance on any hit (`onError("manipulative-language")`).

## Profiles
- 3 frozen profiles: softNeutral (0.9 / 1.0 / 0.3), warmCalm (0.8 / 0.95 / 0.3), sleepyQuiet (0.7 / 0.9 / 0.2).
- All profiles validated at module load via `validateProfile`. Fails closed.

## Captions
- `CAPTION_LINGER_MS = 1500`. Captions ALWAYS emit, even in reduced-audio mode.
- `useVoicePresence` schedules caption removal CAPTION_LINGER_MS AFTER the speech utterance terminates (`onEnd` OR `onError`). For longer utterances, captions persist through the entire spoken duration and only fade 1500ms after audio ends. When voice is disabled or reduced-audio is on, dismissal is scheduled immediately (no audio to wait for). All timers cleared on unmount. Architect-driven hardening (v5.8.60).

## Reduced-audio
- Honors `prefers-reduced-motion: reduce` automatically.
- User override via `setReducedAudio(true)`.
- When reduced-audio is on, `useVoicePresence.speak()` emits caption only — no audio.

## Opt-in posture
- `VoicePlaybackController.optInGate` defaults `false`.
- Speak refuses with `not-opted-in` until host sets `setOptIn(true)`.
- `useVoicePresence` exposes `enabled` initial state from `hasOptIn()`.
- `VoiceToggle` requires confirmation step before enabling.

## Public barrel trust boundary
- `speak`/`stop`/`setOptIn` from VoicePlaybackController NOT re-exported.
- Public dispatch surface = `useVoicePresence` only.

## Production posture
- ZERO files outside `client/src/lumi-voice/` modified.
- ZERO new npm dependencies.
- ZERO production wiring (no Route, no Header link).
