/**
 * Phase 12 — Shadow presets (9 values + component mapping).
 *
 * Calm-by-default: long, soft, low-opacity. Never harsh.
 */

export const shadows = {
  none: "none",
  xs: "0 1px 2px rgba(22, 58, 54, 0.04)",
  sm: "0 2px 6px rgba(22, 58, 54, 0.06)",
  md: "0 6px 16px rgba(22, 58, 54, 0.08)",
  lg: "0 12px 28px rgba(22, 58, 54, 0.10)",
  xl: "0 20px 44px rgba(22, 58, 54, 0.12)",
  hover: "0 8px 20px rgba(22, 58, 54, 0.10)",
  focusRing: "0 0 0 3px rgba(123, 164, 131, 0.45)",
  inset: "inset 0 1px 2px rgba(22, 58, 54, 0.06)",
} as const;

export type ShadowToken = keyof typeof shadows;

export const shadowFor = {
  buttonResting: shadows.xs,
  buttonHover: shadows.sm,
  cardResting: shadows.sm,
  cardElevated: shadows.md,
  cardFloating: shadows.lg,
  modal: shadows.xl,
  focus: shadows.focusRing,
} as const;

export type ShadowForKey = keyof typeof shadowFor;
