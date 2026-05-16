/**
 * @fileoverview Shadow Token System
 * @module lumi-tokens/shadows
 * @version 1.0.0
 * @since Phase 41
 */

const SHADOW_HUE = "22, 58, 54";

export const SHADOWS = {
  subtle: `0 4px 24px rgba(${SHADOW_HUE}, 0.08)`,
  soft: `0 8px 32px rgba(${SHADOW_HUE}, 0.12)`,
  medium: `0 12px 48px rgba(${SHADOW_HUE}, 0.16)`,
  focus: `0 0 0 3px rgba(143, 191, 159, 0.4)`,
  inset: `inset 0 2px 8px rgba(${SHADOW_HUE}, 0.06)`,
  none: "none",
} as const;

export const GLOWS = {
  gold: `0 0 20px rgba(212, 175, 55, 0.2)`,
  sage: `0 0 20px rgba(143, 191, 159, 0.25)`,
  warm: `0 0 20px rgba(229, 184, 174, 0.2)`,
} as const;

export const Z_INDEX = {
  base: 0, elevated: 10, sticky: 50, dropdown: 100, modal: 200, crisis: 9999,
} as const;
