/**
 * Phase 25 — lumiConsistencyTokens
 *
 * 8 FROZEN tokens that must be preserved across every platform Lumi runs on
 * (web, mobile, future surfaces). Any platform-specific adapter must satisfy
 * these tokens or fail consistency verification.
 */

export const LUMI_IDENTITY = Object.freeze({
  name: "Lumi",
  role: "companion",
  pronoun: "it",
  isHuman: false,
  isTherapist: false,
  isRomantic: false,
} as const);

export const LUMI_VISUAL_RGB = Object.freeze({
  primarySage: Object.freeze({ r: 122, g: 153, b: 137 } as const),
  warmCream: Object.freeze({ r: 248, g: 243, b: 232 } as const),
  deepForest: Object.freeze({ r: 22, g: 58, b: 54 } as const),
  eternalGold: Object.freeze({ r: 213, g: 175, b: 95 } as const),
  softBlush: Object.freeze({ r: 233, g: 200, b: 198 } as const),
  mist: Object.freeze({ r: 220, g: 226, b: 222 } as const),
} as const);

export const LUMI_VOICE_CAPS = Object.freeze({
  maxVolume: 0.4,
  minRate: 0.5,
  maxRate: 1.5,
  minPitch: 0.5,
  maxPitch: 1.5,
  autoplayAllowed: false,
} as const);

export const LUMI_TIMING = Object.freeze({
  breathCycleMs: 7100,
  breathInhaleMs: 2800,
  breathHoldMs: 400,
  breathExhaleMs: 3600,
  breathRestMs: 300,
  sceneTransitionMinMs: 1500,
  captionLingerMs: 1500,
  minNudgeSpacingMs: 300_000,
} as const);

export const LUMI_TONE_MARKERS = Object.freeze([
  "soft",
  "gentle",
  "slow",
  "no pressure",
  "you choose",
  "skip",
  "dismiss",
  "nothing to prove",
  "nothing owed",
  "ignore",
  "rest",
  "quiet",
] as const);

export const LUMI_ACCESSIBILITY = Object.freeze({
  wcag: "AA",
  honorReducedMotion: true,
  captionsAlwaysAvailable: true,
  keyboardNavigable: true,
  focusVisible: true,
} as const);

export type LumiEmotionalState =
  | "calmIdle"
  | "comforting"
  | "reflective"
  | "sleepy"
  | "grounding"
  | "joySoft"
  | "concernSoft"
  | "alert";

export const LUMI_EMOTIONAL_STATES: ReadonlyArray<LumiEmotionalState> = Object.freeze([
  "calmIdle",
  "comforting",
  "reflective",
  "sleepy",
  "grounding",
  "joySoft",
  "concernSoft",
  "alert",
]);

if (LUMI_EMOTIONAL_STATES.length !== 8) {
  throw new Error(
    `[lumi-consistency] LUMI_EMOTIONAL_STATES must contain 8 states, found ${LUMI_EMOTIONAL_STATES.length}.`,
  );
}

export type LumiInteractionPattern =
  | "calmCheckIn"
  | "quietNudge"
  | "guidedRitual"
  | "transparencyDisclosure"
  | "boundaryReminder"
  | "crisisRouting"
  | "sceneTransition"
  | "voiceUtterance";

export const LUMI_INTERACTION_PATTERNS: ReadonlyArray<LumiInteractionPattern> = Object.freeze([
  "calmCheckIn",
  "quietNudge",
  "guidedRitual",
  "transparencyDisclosure",
  "boundaryReminder",
  "crisisRouting",
  "sceneTransition",
  "voiceUtterance",
]);

if (LUMI_INTERACTION_PATTERNS.length !== 8) {
  throw new Error(
    `[lumi-consistency] LUMI_INTERACTION_PATTERNS must contain 8 patterns, found ${LUMI_INTERACTION_PATTERNS.length}.`,
  );
}

export const LUMI_CONSISTENCY_TOKENS = Object.freeze({
  identity: LUMI_IDENTITY,
  visualRgb: LUMI_VISUAL_RGB,
  voiceCaps: LUMI_VOICE_CAPS,
  timing: LUMI_TIMING,
  toneMarkers: LUMI_TONE_MARKERS,
  accessibility: LUMI_ACCESSIBILITY,
  emotionalStates: LUMI_EMOTIONAL_STATES,
  interactionPatterns: LUMI_INTERACTION_PATTERNS,
} as const);

if (Object.keys(LUMI_CONSISTENCY_TOKENS).length !== 8) {
  throw new Error(
    `[lumi-consistency] LUMI_CONSISTENCY_TOKENS must contain exactly 8 token groups.`,
  );
}
