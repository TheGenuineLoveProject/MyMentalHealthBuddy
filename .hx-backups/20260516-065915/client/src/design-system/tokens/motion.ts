/**
 * Phase 12 — Motion tokens (8 durations + 8 easings + 9 presets).
 *
 * ALL motion respects prefers-reduced-motion at the component layer.
 */

export const duration = {
  instant: "0ms",
  xfast: "120ms",
  fast: "200ms",
  medium: "500ms",
  gentle: "800ms",
  slow: "1200ms",
  breath: "3000ms",
  ambient: "7100ms",
} as const;

export type DurationToken = keyof typeof duration;

export const easing = {
  linear: "linear",
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  emphasized: "cubic-bezier(0.2, 0, 0, 1)",
  decelerate: "cubic-bezier(0, 0, 0.2, 1)",
  accelerate: "cubic-bezier(0.4, 0, 1, 1)",
  gentleIn: "cubic-bezier(0.32, 0, 0.67, 0)",
  gentleOut: "cubic-bezier(0.33, 1, 0.68, 1)",
  gentleInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
} as const;

export type EasingToken = keyof typeof easing;

/** Curated transition presets. */
export const transition = {
  hover: `all ${duration.fast} ${easing.standard}`,
  press: `all ${duration.xfast} ${easing.accelerate}`,
  appear: `opacity ${duration.medium} ${easing.gentleOut}, transform ${duration.medium} ${easing.gentleOut}`,
  cardLift: `box-shadow ${duration.medium} ${easing.gentleInOut}, transform ${duration.medium} ${easing.gentleInOut}`,
  colorWash: `background-color ${duration.fast} ${easing.standard}, color ${duration.fast} ${easing.standard}`,
  focusRing: `box-shadow ${duration.fast} ${easing.standard}`,
  panelOpen: `opacity ${duration.gentle} ${easing.gentleOut}, transform ${duration.gentle} ${easing.gentleOut}`,
  modalEnter: `opacity ${duration.gentle} ${easing.emphasized}, transform ${duration.gentle} ${easing.emphasized}`,
  ambientGlow: `opacity ${duration.ambient} ${easing.gentleInOut}`,
} as const;

export type TransitionPreset = keyof typeof transition;

export const motion = { duration, easing, transition } as const;
