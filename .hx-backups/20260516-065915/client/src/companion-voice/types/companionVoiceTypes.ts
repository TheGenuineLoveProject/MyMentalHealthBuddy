/**
 * Phase 15 — Gentle Companion Conversation Layer.
 * Type contracts for Lumi's reflection engine.
 */

/** Coarse emotional category inferred from user input. Keep small + auditable. */
export type EmotionCategory =
  | "tired"
  | "anxious"
  | "sad"
  | "angry"
  | "lonely"
  | "overwhelmed"
  | "calm"
  | "grateful"
  | "hopeful"
  | "neutral"
  | "ambivalent";

/** OARS technique used in the response (Motivational Interviewing). */
export type OarsTechnique =
  | "open-question"
  | "affirmation"
  | "reflection"
  | "summary"
  | "permission";

/** Response intent. Crisis ALWAYS overrides everything else. */
export type ResponseIntent =
  | "crisis"
  | "reflect"
  | "affirm"
  | "invite"
  | "rest";

export type CompanionInput = {
  text: string;
  /** Optional prior turn count — used to gently keep things short. */
  turnIndex?: number;
};

export type CompanionResponse = {
  /** The exact text Lumi will say. Always short (≤ 220 chars). */
  message: string;
  intent: ResponseIntent;
  technique: OarsTechnique | null;
  /** True iff this response is a crisis-routed safety card, NOT conversation. */
  isCrisis: boolean;
  /** Always rendered alongside the message — opt-out reminder. */
  optOut: string;
  /** Always rendered — `/crisis` is non-negotiable. */
  crisisLine: string;
  /** Detected category, for analytics — never persisted with PII. */
  detected: EmotionCategory;
};

export type ResponseBank = {
  category: EmotionCategory;
  reflections: string[];
  affirmations: string[];
  invitations: string[];
};

export type CrisisDetectionResult = {
  isCrisis: boolean;
  matchedSignal: string | null;
};
