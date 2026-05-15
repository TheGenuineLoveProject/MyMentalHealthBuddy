/**
 * MMHB_FLOAT_IDLE_UNIT_v1 — Phase 11 Productionization
 *
 * Types + 8 emotional states + canonical motion constants.
 * Mirrors v5.8.45 (Phase 8 emotional weather) + v5.8.47 (Phase 9 interactions).
 *
 * NON-DRIFT contract: every value here is a static, named constant.
 * Multipliers are NEVER computed at runtime. State changes swap entire
 * presets; they never blend, easing through is the renderer's job.
 */

export type EmotionalState =
  | "calmIdle"
  | "grounding"
  | "reflective"
  | "sleepy"
  | "comforting"
  | "peacefulJoy"
  | "gentleConcern"
  | "welcoming";

export const EMOTIONAL_STATES: readonly EmotionalState[] = [
  "calmIdle",
  "grounding",
  "reflective",
  "sleepy",
  "comforting",
  "peacefulJoy",
  "gentleConcern",
  "welcoming",
] as const;

export type SurfaceContext = "hero" | "chat" | "buddy" | "lab" | "onboarding";

export interface MotionMultiplier {
  /** Torso scale cycle in seconds. */
  breathCycle: number;
  /** Body translateY cycle in seconds. */
  floatCycle: number;
  /** Float displacement multiplier (1.0 = ±10px baseline). */
  floatAmplitude: number;
  /** Glow tint — canonical 8-hex palette only. */
  glowColor: string;
  /** Glow intensity at rest (0..0.18 ambient ceiling). */
  glowOpacity: number;
}

/**
 * EMOTION_MULTIPLIERS — STATIC presets, one per emotional state.
 * 6 of 8 carry user-verified Phase 8 values.
 * gentleConcern + welcoming are TENTATIVE: interpolated within the
 * Phase 8 envelope (cycle 6-12s, amplitude 0.4-1.2x, glow 0.10-0.18)
 * pending final spec. Every preset MUST stay sub-pixel safe.
 */
export const EMOTION_MULTIPLIERS: Readonly<Record<EmotionalState, MotionMultiplier>> = {
  calmIdle: {
    breathCycle: 7.1,
    floatCycle: 9.3,
    floatAmplitude: 1.0,
    glowColor: "#A8C9A0",
    glowOpacity: 0.15,
  },
  grounding: {
    breathCycle: 9.94,
    floatCycle: 12.09,
    floatAmplitude: 0.6,
    glowColor: "#7AA86F",
    glowOpacity: 0.16,
  },
  reflective: {
    breathCycle: 8.52,
    floatCycle: 13.02,
    floatAmplitude: 0.7,
    glowColor: "#74C0FC",
    glowOpacity: 0.14,
  },
  sleepy: {
    breathCycle: 11.36,
    floatCycle: 16.74,
    floatAmplitude: 0.4,
    glowColor: "#A78BFA",
    glowOpacity: 0.12,
  },
  comforting: {
    breathCycle: 7.81,
    floatCycle: 11.16,
    floatAmplitude: 0.8,
    glowColor: "#F8C6C0",
    glowOpacity: 0.16,
  },
  peacefulJoy: {
    breathCycle: 6.39,
    floatCycle: 7.91,
    floatAmplitude: 1.2,
    glowColor: "#F4C95D",
    glowOpacity: 0.18,
  },
  /** TENTATIVE — final values pending from product spec. */
  gentleConcern: {
    breathCycle: 8.6,
    floatCycle: 10.4,
    floatAmplitude: 0.55,
    glowColor: "#A78BFA",
    glowOpacity: 0.14,
  },
  /** TENTATIVE — final values pending from product spec. */
  welcoming: {
    breathCycle: 6.8,
    floatCycle: 8.6,
    floatAmplitude: 1.1,
    glowColor: "#F4C95D",
    glowOpacity: 0.17,
  },
} as const;

/** Phase 9 interaction modulator caps. Sub-percent / sub-pixel only. */
export const INTERACTION_LIMITS = {
  hover: {
    breathMult: 0.93,
    amplitudeMult: 0.95,
    eyeSettleMult: 1.25,
    glowBoost: 0.012,
  },
  proximity: {
    radiusPx: 200,
    buildMs: 4000,
    floatMult: 1.25,
    breathMult: 0.85,
    amplitudeMult: 0.85,
    glowBoost: 0.006,
  },
  click: {
    durationMs: 600,
    glowBoost: 0.05,
    decayMs: 3000,
  },
} as const;

/** Telemetry event taxonomy — exhaustive 14-event union. */
export type AvatarTelemetryEvent =
  | { type: "avatar:mount"; surface: SurfaceContext; state: EmotionalState; ts: number }
  | { type: "avatar:unmount"; surface: SurfaceContext; ts: number }
  | { type: "avatar:state_change"; from: EmotionalState; to: EmotionalState; ts: number }
  | { type: "avatar:hover_start"; surface: SurfaceContext; ts: number }
  | { type: "avatar:hover_end"; surface: SurfaceContext; durationMs: number; ts: number }
  | { type: "avatar:proximity_enter"; surface: SurfaceContext; ts: number }
  | { type: "avatar:proximity_settled"; surface: SurfaceContext; ts: number }
  | { type: "avatar:proximity_leave"; surface: SurfaceContext; ts: number }
  | { type: "avatar:click"; surface: SurfaceContext; ts: number }
  | { type: "avatar:reduced_motion_change"; reduced: boolean; ts: number }
  | { type: "avatar:crisis_engage"; surface: SurfaceContext; ts: number }
  | { type: "avatar:crisis_release"; surface: SurfaceContext; ts: number }
  | { type: "avatar:fps_sample"; fps: number; surface: SurfaceContext; ts: number }
  | { type: "avatar:contract_violation"; rule: string; detail: string; ts: number };

export type TelemetryListener = (event: AvatarTelemetryEvent) => void;

/** React-exposed state cross-section. ONLY these values trigger renders. */
export interface AvatarReactState {
  reducedMotion: boolean;
  currentState: EmotionalState;
  fps: number;
  /** 0..1 — derived from hover/proximity/click stack. */
  interactionIntensity: number;
}

/** Default hero/chat/buddy state assignment per locked rollout plan. */
export const SURFACE_DEFAULT_STATE: Readonly<Record<SurfaceContext, EmotionalState>> = {
  hero: "calmIdle",
  chat: "comforting",
  buddy: "peacefulJoy",
  lab: "calmIdle",
  onboarding: "welcoming",
} as const;

/** Asset ceiling — never exceed 1024×1024 source dimension. */
export const AVATAR_SOURCE_DIMENSION = 1024 as const;

/** Visual ceilings (defense in depth — also enforced by nonDriftRules). */
export const SUB_PIXEL_FLOAT_CEILING_PX = 12 as const;
export const SUB_PERCENT_BREATH_CEILING = 0.03 as const;
export const GLOW_OPACITY_CEILING = 0.18 as const;
