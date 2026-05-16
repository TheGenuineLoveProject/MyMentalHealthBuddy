/**
 * Phase 14 (spec-aligned) — calm-only motion tokens.
 *
 * Spec contracts:
 *   - No bounce, no spring overshoot, no confetti, no dopamine-loop micro-rewards.
 *   - Easing: ease-in-out only (and linear for steady cycles).
 *   - Durations: long, soft, breath-paced.
 *   - All durations expressed in milliseconds.
 *
 * These tokens are local to calm-checkin and do not depend on Phase 12
 * design-system motion tokens, so they can be tuned independently.
 */

export const calmMotion = {
  durations: {
    fadeSoft: 480,         // soft text/card fade
    cardLift: 600,         // first-time card appearance
    breathInhale: 4000,    // 4s inhale per spec
    breathHold: 2000,      // 2s hold per spec
    breathExhale: 6000,    // 6s exhale per spec
    glowPulse: 3000,       // ambient aura — non-attention-grabbing
  },
  easings: {
    soft: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    linearBreath: "linear",
  },
  /** Maximum opacity used by the breath ring — kept low so it cannot pulse aggressively. */
  glow: {
    minOpacity: 0.08,
    maxOpacity: 0.22,
  },
} as const;

export type CalmMotionTokens = typeof calmMotion;
