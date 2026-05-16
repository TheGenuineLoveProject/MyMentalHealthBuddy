/**
 * Phase 15 (spec-aligned) — calm motion tokens.
 *
 * Note: filename matches the spec ("motion/calmCheckinMotion.ts") for
 * cross-spec consistency; the contents are scoped to the conversation
 * panel, not the calm-checkin module.
 *
 * Contract: no bounce, no spring overshoot, no dopamine flourishes. Only
 * gentle ease-in-out fades and the slow ambient aura already established
 * by Phase 14.
 */

export const conversationMotion = {
  durations: {
    bubbleFade: 320,
    bubbleStagger: 80,
    cardLift: 480,
    inputFocus: 200,
    auraPulse: 3000,
  },
  easings: {
    soft: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    linear: "linear",
  },
  glow: {
    minOpacity: 0.06,
    maxOpacity: 0.18,
  },
} as const;

export type ConversationMotionTokens = typeof conversationMotion;
