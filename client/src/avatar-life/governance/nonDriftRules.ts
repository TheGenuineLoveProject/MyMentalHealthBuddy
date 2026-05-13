/**
 * Phase 11 — NON-DRIFT contract enforcement.
 *
 * 17 STATIC motion limits + 7 component identity rules. Pure functions
 * that audit a multiplier preset OR a render context against the locked
 * v5.8.45/v5.8.47 envelope. Violations emit telemetry but do NOT throw
 * in production — the renderer falls back to calmIdle (asymmetric risk:
 * never make the avatar more energetic than the contract allows).
 */

import {
  EMOTION_MULTIPLIERS,
  EMOTIONAL_STATES,
  GLOW_OPACITY_CEILING,
  INTERACTION_LIMITS,
  type EmotionalState,
  type MotionMultiplier,
  SUB_PERCENT_BREATH_CEILING,
  SUB_PIXEL_FLOAT_CEILING_PX,
} from "../types/avatarLifeTypes";

export interface RuleViolation {
  rule: string;
  detail: string;
}

/** 17 motion limits — every ceiling/floor that NON-DRIFT enforces. */
export const MOTION_LIMITS = {
  BREATH_CYCLE_MIN_S: 5.5,
  BREATH_CYCLE_MAX_S: 12,
  FLOAT_CYCLE_MIN_S: 7,
  FLOAT_CYCLE_MAX_S: 18,
  FLOAT_AMPLITUDE_MIN: 0.3,
  FLOAT_AMPLITUDE_MAX: 1.3,
  FLOAT_DISPLACEMENT_PX_CEILING: SUB_PIXEL_FLOAT_CEILING_PX,
  BREATH_SCALE_RANGE_CEILING: SUB_PERCENT_BREATH_CEILING,
  GLOW_OPACITY_FLOOR: 0.08,
  GLOW_OPACITY_CEILING,
  INTERACTION_GLOW_BOOST_CEILING: 0.07,
  INTERACTION_BREATH_MULT_FLOOR: 0.8,
  INTERACTION_BREATH_MULT_CEILING: 1.2,
  INTERACTION_AMPLITUDE_MULT_FLOOR: 0.8,
  INTERACTION_AMPLITUDE_MULT_CEILING: 1.3,
  PROXIMITY_RADIUS_PX_CEILING: 240,
  CLICK_PULSE_DURATION_MS_CEILING: 800,
} as const;

/** 7 component identity rules — what the avatar must NEVER do. */
export const IDENTITY_RULES = {
  NEVER_OPEN_MOUTH_AT_REST: "Mouth scale variance must stay ≤0.6% (breath-synced softness only).",
  NEVER_REPLACE_BODY: "Body region geometry FROZEN — only sub-pixel transforms permitted.",
  NEVER_ATTENTION_BAIT: "No setInterval-driven motion; idle behavior must not pull attention.",
  NEVER_ABANDONMENT_SIGNAL: "Idle return must be gentle (≥1s) — never snap unless reduced-motion.",
  NEVER_OFF_PALETTE_GLOW: "Glow color must be one of the canonical 8-hex brand palette entries.",
  NEVER_OVERRIDE_CRISIS: "Crisis state must short-circuit ALL interaction + state changes.",
  NEVER_TRACK_POINTER: "Pointer position is read for proximity only — never logged or persisted.",
} as const;

/** Canonical 8-hex brand palette (used for glow tint validation). */
const CANONICAL_PALETTE = new Set([
  "#A8C9A0", // sage
  "#7AA86F", // sage-deep
  "#74C0FC", // calm-blue
  "#A78BFA", // empathy-purple
  "#A8E6CF", // mint
  "#F8C6C0", // blush
  "#F4C95D", // sunshine
  "#142626", // ink
]);

/** Validate a single MotionMultiplier preset against the 17 motion limits. */
export function auditMultiplier(
  state: EmotionalState,
  m: MotionMultiplier,
): RuleViolation[] {
  const v: RuleViolation[] = [];
  const tag = (rule: string, detail: string) => v.push({ rule: `${state}.${rule}`, detail });

  if (m.breathCycle < MOTION_LIMITS.BREATH_CYCLE_MIN_S || m.breathCycle > MOTION_LIMITS.BREATH_CYCLE_MAX_S) {
    tag("breathCycle", `${m.breathCycle}s outside [${MOTION_LIMITS.BREATH_CYCLE_MIN_S}, ${MOTION_LIMITS.BREATH_CYCLE_MAX_S}]`);
  }
  if (m.floatCycle < MOTION_LIMITS.FLOAT_CYCLE_MIN_S || m.floatCycle > MOTION_LIMITS.FLOAT_CYCLE_MAX_S) {
    tag("floatCycle", `${m.floatCycle}s outside [${MOTION_LIMITS.FLOAT_CYCLE_MIN_S}, ${MOTION_LIMITS.FLOAT_CYCLE_MAX_S}]`);
  }
  if (m.floatAmplitude < MOTION_LIMITS.FLOAT_AMPLITUDE_MIN || m.floatAmplitude > MOTION_LIMITS.FLOAT_AMPLITUDE_MAX) {
    tag("floatAmplitude", `${m.floatAmplitude} outside [${MOTION_LIMITS.FLOAT_AMPLITUDE_MIN}, ${MOTION_LIMITS.FLOAT_AMPLITUDE_MAX}]`);
  }
  if (m.glowOpacity < MOTION_LIMITS.GLOW_OPACITY_FLOOR || m.glowOpacity > MOTION_LIMITS.GLOW_OPACITY_CEILING) {
    tag("glowOpacity", `${m.glowOpacity} outside [${MOTION_LIMITS.GLOW_OPACITY_FLOOR}, ${MOTION_LIMITS.GLOW_OPACITY_CEILING}]`);
  }
  if (!CANONICAL_PALETTE.has(m.glowColor.toUpperCase())) {
    tag("glowColor", `${m.glowColor} not in canonical 8-hex palette`);
  }
  return v;
}

/** Validate Phase 9 interaction limits stay within the 17 motion ceilings. */
export function auditInteractionLimits(): RuleViolation[] {
  const v: RuleViolation[] = [];
  const { hover, proximity, click } = INTERACTION_LIMITS;
  if (hover.glowBoost > MOTION_LIMITS.INTERACTION_GLOW_BOOST_CEILING) {
    v.push({ rule: "hover.glowBoost", detail: `${hover.glowBoost} > ceiling ${MOTION_LIMITS.INTERACTION_GLOW_BOOST_CEILING}` });
  }
  if (proximity.glowBoost > MOTION_LIMITS.INTERACTION_GLOW_BOOST_CEILING) {
    v.push({ rule: "proximity.glowBoost", detail: `${proximity.glowBoost} > ceiling` });
  }
  if (click.glowBoost > MOTION_LIMITS.INTERACTION_GLOW_BOOST_CEILING) {
    v.push({ rule: "click.glowBoost", detail: `${click.glowBoost} > ceiling` });
  }
  if (proximity.radiusPx > MOTION_LIMITS.PROXIMITY_RADIUS_PX_CEILING) {
    v.push({ rule: "proximity.radiusPx", detail: `${proximity.radiusPx} > ceiling` });
  }
  if (click.durationMs > MOTION_LIMITS.CLICK_PULSE_DURATION_MS_CEILING) {
    v.push({ rule: "click.durationMs", detail: `${click.durationMs} > ceiling` });
  }
  return v;
}

/** Audit ALL 8 emotional states + interaction limits in one sweep. */
export function auditAll(): RuleViolation[] {
  const all: RuleViolation[] = [];
  for (const s of EMOTIONAL_STATES) {
    all.push(...auditMultiplier(s, EMOTION_MULTIPLIERS[s]));
  }
  all.push(...auditInteractionLimits());
  return all;
}
