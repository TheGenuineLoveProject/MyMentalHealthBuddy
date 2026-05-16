/**
 * Phase 23 — Lumi Voice Presence
 * Public barrel. Single hardened import surface.
 *
 * Status: opt-in. Zero production wiring. No autoplay. Volume hard-capped at 0.4.
 */

// Components
export { VoiceToggle } from "./components/VoiceToggle";
export type { VoiceToggleProps } from "./components/VoiceToggle";
export { VoiceCaptionOverlay } from "./components/VoiceCaptionOverlay";
export type { VoiceCaptionOverlayProps } from "./components/VoiceCaptionOverlay";

// Runtime
export { useVoicePresence } from "./runtime/useVoicePresence";
export type { UseVoicePresenceReturn } from "./runtime/useVoicePresence";
export {
  VOICE_PROFILES,
  DEFAULT_VOICE_PROFILE,
  resolveProfile,
  listProfiles,
  validateProfile,
} from "./runtime/VoicePresenceEngine";
export type { VoiceProfile, VoiceProfileKey } from "./runtime/VoicePresenceEngine";
export {
  BREATH_CYCLE_MS,
  BREATH_INHALE_MS,
  BREATH_HOLD_MS,
  BREATH_EXHALE_MS,
  BREATH_REST_MS,
  getCurrentBreathPhase,
} from "./runtime/BreathPacingEngine";
export type { BreathPhase, BreathState } from "./runtime/BreathPacingEngine";

// Accessibility
export {
  CAPTION_LINGER_MS,
  makeCaption,
  isCaptionExpired,
} from "./accessibility/captionsMode";
export type { Caption } from "./accessibility/captionsMode";
export {
  setReducedAudio,
  isReducedAudioPreferred,
  shouldSuppressVoice,
} from "./accessibility/reducedAudioMode";

// Governance
export {
  MAX_VOICE_VOLUME,
  MIN_VOICE_RATE,
  MAX_VOICE_RATE,
  FORBIDDEN_PHRASES,
  FORBIDDEN_AUDIO_EFFECTS,
  containsForbiddenPhrase,
  containsForbiddenAudioEffect,
} from "./governance/voiceSafetyRules";
export {
  MANIPULATION_CATEGORIES,
  findManipulationHits,
  containsManipulativeLanguage,
} from "./governance/antiManipulationRules";
export type { ManipulationCategory, ManipulationHit } from "./governance/antiManipulationRules";

// Note: VoicePlaybackController.speak/stop/setOptIn are intentionally NOT
// re-exported. The public dispatch surface is `useVoicePresence`, which
// gates speak() through the opt-in flag and governance audits. Tests
// import the controller directly from its module path if needed.
