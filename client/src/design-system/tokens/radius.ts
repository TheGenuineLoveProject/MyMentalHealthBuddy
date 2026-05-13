/**
 * Phase 12 — Border radius tokens (6 values + component mapping).
 */

export const radius = {
  none: "0px",
  xs: "4px",
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  pill: "9999px",
} as const;

export type RadiusToken = keyof typeof radius;

/** Component-level mapping — locked. */
export const radiusFor = {
  button: radius.md, // 8px
  input: radius.md, // 8px
  card: radius.xl, // 16px
  modal: radius.xl, // 16px
  pill: radius.pill,
  avatar: radius.pill,
} as const;

export type RadiusForKey = keyof typeof radiusFor;
