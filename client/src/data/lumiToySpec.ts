/**
 * lumiToySpec — Physical Toy Hardware Specification (V7).
 *
 * Mirrors the on-screen V7 avatar's expression / posture / heart-rate
 * system into the physical companion toy's LED + servo + sensor layout.
 *
 * The on-screen CSS animation system is the authoritative reference for
 * what the physical toy must reproduce — every CSS keyframe maps to an
 * LED brightness pattern, every emotion-derived heart period maps to a
 * heart-LED pulse rate, and every posture state maps to a body-zone RGB
 * pattern. This file is the bridge contract between the React component
 * and the toy firmware.
 *
 * Pure data — no React, no DOM. Safe to import server-side or in tests.
 */

export interface LedMatrixSpec {
  /** Display matrix size, e.g. "8x8". */
  size: string;
  /** Number of matrices (e.g. 2 for left + right eyes). */
  count: number;
  /** Hardware type label for firmware/BOM consumers. */
  type: string;
}

export interface LedStripSpec {
  leds: number;
  type: string;
}

export interface HeartLedSpec {
  type: string;
  /** Always amber (#E8913A) per V7 brand spec; brightness varies. */
  color: string;
}

export interface BodyZoneSpec {
  count: number;
  type: string;
}

export interface ServoSpec {
  count: number;
  /** Range of motion, e.g. "±15deg". */
  range: string;
}

export interface BatterySpec {
  type: string;
  lifeHours: number;
}

export interface ChargingSpec {
  type: string;
  timeHours: number;
}

export interface MaterialsSpec {
  body: string;
  dimensions: string;
  weight: string;
  /** Required regulatory certifications for safe shipment as a soft toy. */
  certifications: ReadonlyArray<string>;
}

export interface ToyLedSpec {
  eyeMatrix: LedMatrixSpec;
  mouthStrip: LedStripSpec;
  heartLed: HeartLedSpec;
  bodyZones: BodyZoneSpec;
  eyebrowServos: ServoSpec;
  battery: BatterySpec;
  charging: ChargingSpec;
  materials: MaterialsSpec;
}

export const TOY_LED_SPEC: ToyLedSpec = {
  eyeMatrix: { size: "8x8", count: 2, type: "dot-matrix" },
  mouthStrip: { leds: 12, type: "curved-strip" },
  heartLed: { type: "rgb-capacitive-touch", color: "#E8913A" },
  bodyZones: { count: 7, type: "rgb-per-zone" },
  eyebrowServos: { count: 2, range: "\u00B115deg" },
  battery: { type: "li-ion", lifeHours: 8 },
  charging: { type: "usb-c", timeHours: 2 },
  materials: {
    body: "food-grade-silicone-shore-a-5-10",
    dimensions: "85mm x 75mm",
    weight: "90g",
    certifications: ["CE", "FCC", "ASTM", "EN71", "CPSIA"],
  },
} as const;

/**
 * Per-emotion firmware seed. Mirrors the on-screen LumiV6 V7 derivation
 * table so the toy's eye-matrix pattern, mouth-strip brightness, body-zone
 * RGB tint, and heart-LED pulse rate stay in lockstep with the avatar.
 *
 * heartHz is the canonical pulse frequency (Hz). Firmware should compute
 * pulse period as `1000 / heartHz` (ms).
 */
export interface ToyEmotionSeed {
  /** Eye dot-matrix pattern key (firmware looks this up in its pattern table). */
  eyePattern: "default" | "wide" | "soft" | "happy" | "closed";
  /** Mouth-strip pattern key. Mirrors the runtime CSS modifier names in
   *  LumiV6.tsx so the firmware lookup table stays 1:1 with the avatar. */
  mouthPattern:
    | "joy"
    | "love"
    | "greeting"
    | "empathy"
    | "sleepy"
    | "surprise"
    | "worried"
    | "excited"
    | "loving"
    | "focused"
    | "breathing"
    | "neutral";
  /** Posture servo / body-flex preset key. */
  posture: "upright" | "curious" | "leaning" | "relaxed" | "bouncy";
  /** Heart-LED pulse frequency in Hz. */
  heartHz: number;
}

/**
 * Mirrors `EMOTION_DERIVATION` in `client/src/components/lumi/LumiV6.tsx`
 * (including the runtime backward-compat overrides: sleepy → closed eye,
 * calm with no override → no mouth at all on screen, which the firmware
 * represents as the "breathing" pattern at minimum brightness). Update
 * BOTH tables together when emotion mapping changes.
 */
export const TOY_EMOTION_SEED: Record<string, ToyEmotionSeed> = {
  greeting: { eyePattern: "default", mouthPattern: "greeting",  posture: "upright",  heartHz: 0.5   },
  joy:      { eyePattern: "happy",   mouthPattern: "excited",   posture: "bouncy",   heartHz: 1.0   },
  love:     { eyePattern: "soft",    mouthPattern: "loving",    posture: "relaxed",  heartHz: 0.5   },
  calm:     { eyePattern: "soft",    mouthPattern: "breathing", posture: "relaxed",  heartHz: 0.25  },
  empathy:  { eyePattern: "soft",    mouthPattern: "worried",   posture: "leaning",  heartHz: 0.35  },
  sleepy:   { eyePattern: "closed",  mouthPattern: "sleepy",    posture: "relaxed",  heartHz: 0.125 },
  surprise: { eyePattern: "wide",    mouthPattern: "surprise",  posture: "curious",  heartHz: 1.5   },
} as const;
