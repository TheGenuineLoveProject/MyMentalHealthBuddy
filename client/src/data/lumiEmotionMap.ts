/**
 * lumiEmotionMap — canonical emotion → presentation map for Lumi.
 *
 * Two layers, both pure-data (no React, no DOM, safe to import server-side):
 *   1. EMOTION_TO_COLOR        — emotion → LumiV6 color theme   (legacy, used today)
 *   2. EMOTION_STATES          — emotion → full V24 coordination state
 *      + regulateNervousSystem — anxiety-driven state damping helper
 *
 * Layer 2 (added v5.8.10) is the canonical V24 OMEGA "Soul Architecture"
 * coordination contract: every emotion resolves to a complete tuple of
 * pose + eyeType + mouthType + armPose + legPose + bodyPosture + blushLevel
 * + glowColor + glowIntensity + breathSpeed. The render layer chooses
 * which fields to honor — LumiV6 (single PNG body, FROZEN per V21) honors
 * eye/mouth/posture/blush/glow only; arm/leg pose intent is reserved for
 * surfaces that swap pose PNGs (`/brand/lumi-body-{celebrating,hugging,
 * meditating}.png`) or render the multi-sprite LumiMascot arm/leg classes
 * (.lumi-mascot__arm--*).
 *
 * Source of truth for color modes is `LumiV6ColorMode` in
 * `client/src/components/lumi/LumiV6.tsx`. Importing the type here keeps
 * this map in lockstep with the component's allowed values — adding a new
 * color mode there will surface a type error here until the map is updated.
 */
import type { LumiV6ColorMode } from "@/components/lumi/LumiV6";

export const EMOTION_TO_COLOR: Record<string, LumiV6ColorMode> = {
  greeting: "default",
  listening: "purple",
  thinking: "blue",
  happy: "yellow",
  sad: "purple",
  anxious: "blue",
  calm: "blue",
  surprised: "orange",
  confused: "purple",
  celebrating: "yellow",
  curious: "orange",
  compassionate: "pink",
  focused: "blue",
  sleepy: "sleep",
  excited: "yellow",
  grateful: "pink",
  encouraging: "pink",
  mindful: "blue",
};

export function getColorMode(emotion: string): LumiV6ColorMode {
  return EMOTION_TO_COLOR[emotion] || "default";
}

/* ======================================================================
 * V24 OMEGA — Canonical Lumi Emotion State (added v5.8.10)
 *
 * The complete coordination contract per V24 §8. All 7 canonical
 * emotions resolve to a full tuple. Glow colors are drawn exclusively
 * from the canonical 8-hex brand palette (sage / sunshine / blush /
 * calm-blue / empathy-purple / mint / warmth-orange / heart-amber).
 *
 * SAFETY: This is data only. Crisis surfaces ALWAYS bypass this map
 * (they pin to greeting + animated=false per the existing crisis
 * stillness contract in LumiV6.tsx).
 * ==================================================================== */

export type LumiPose       = "floating" | "meditating" | "empathy" | "halo" | "walking";
export type LumiEyeType    = "default" | "wide" | "soft" | "happy";
export type LumiMouthType  = "happy" | "calm" | "surprise" | "sleepy" | "worried" | "excited" | "loving";
export type LumiArmPose    = "rest" | "wave" | "hug" | "point" | "heart-hold" | "present";
export type LumiLegPose    = "rest" | "sit" | "walk" | "bounce" | "tuck";
export type LumiBodyPose   = "upright" | "curious" | "leaning" | "relaxed" | "bouncy";
export type LumiBlushLevel = 0 | 1 | 2 | 3;

export interface LumiEmotionState {
  pose: LumiPose;
  eyeType: LumiEyeType;
  mouthType: LumiMouthType;
  armPose: LumiArmPose;
  legPose: LumiLegPose;
  bodyPosture: LumiBodyPose;
  blushLevel: LumiBlushLevel;
  /** Hex from the canonical 8-color palette. */
  glowColor: string;
  /** 0..1 — driven by anxiety inverse + emotion default. */
  glowIntensity: number;
  /** Multiplier on the base breath cycle (1.0 = standard 4s cycle). */
  breathSpeed: number;
}

export const EMOTION_STATES: Record<string, LumiEmotionState> = {
  greeting: {
    pose: "floating", eyeType: "default", mouthType: "happy",
    armPose: "rest", legPose: "tuck", bodyPosture: "upright",
    blushLevel: 1, glowColor: "#A8C9A0", glowIntensity: 0.5, breathSpeed: 0.8,
  },
  calm: {
    pose: "meditating", eyeType: "soft", mouthType: "calm",
    armPose: "rest", legPose: "sit", bodyPosture: "relaxed",
    blushLevel: 0, glowColor: "#74C0FC", glowIntensity: 0.4, breathSpeed: 1,
  },
  empathy: {
    pose: "empathy", eyeType: "soft", mouthType: "worried",
    armPose: "hug", legPose: "sit", bodyPosture: "leaning",
    blushLevel: 0, glowColor: "#C8B6FF", glowIntensity: 0.6, breathSpeed: 0.7,
  },
  support: {
    pose: "halo", eyeType: "default", mouthType: "loving",
    armPose: "heart-hold", legPose: "sit", bodyPosture: "upright",
    blushLevel: 2, glowColor: "#FF9A8B", glowIntensity: 0.7, breathSpeed: 0.9,
  },
  joy: {
    pose: "floating", eyeType: "happy", mouthType: "excited",
    armPose: "present", legPose: "bounce", bodyPosture: "bouncy",
    blushLevel: 2, glowColor: "#FFD93D", glowIntensity: 0.8, breathSpeed: 1.2,
  },
  surprise: {
    pose: "floating", eyeType: "wide", mouthType: "surprise",
    armPose: "rest", legPose: "rest", bodyPosture: "curious",
    blushLevel: 1, glowColor: "#FFB88C", glowIntensity: 0.7, breathSpeed: 1.5,
  },
  sleepy: {
    pose: "meditating", eyeType: "soft", mouthType: "sleepy",
    armPose: "rest", legPose: "sit", bodyPosture: "relaxed",
    blushLevel: 0, glowColor: "#A8D5BA", glowIntensity: 0.3, breathSpeed: 0.5,
  },
};

/** Resolves a coarse emotion label to its canonical V24 state, falling back
 *  to `greeting` for unknown labels so consumers never get `undefined`. */
export function getEmotionState(emotion: string | null | undefined): LumiEmotionState {
  if (!emotion) return EMOTION_STATES.greeting;
  return EMOTION_STATES[emotion.toLowerCase().trim()] || EMOTION_STATES.greeting;
}

/* ======================================================================
 * V24 §9 — Nervous System Regulation
 *
 * Co-regulation helper: as user anxiety rises (0..1), the avatar's
 * breath slows, glow softens, eyes default to soft, posture relaxes.
 * Pure function — returns a Partial that consumers can spread over a
 * base state. Never overrides crisis stillness (crisis bypasses this).
 * ==================================================================== */
export function regulateNervousSystem(userAnxietyLevel: number): Partial<LumiEmotionState> {
  const a = Math.max(0, Math.min(1, Number(userAnxietyLevel) || 0));
  return {
    breathSpeed:    Math.max(0.3, 1 - a * 0.7),
    glowIntensity:  Math.max(0.2, 0.5 - a * 0.3),
    eyeType:        a > 0.7 ? "soft"     : "default",
    bodyPosture:    a > 0.8 ? "relaxed"  : "upright",
  };
}
