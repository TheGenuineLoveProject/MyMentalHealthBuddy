/**
 * Phase 12 — Platform Safety Architecture v1
 * Canonical color palette (6 palette colors + semantic + aura).
 *
 * RULE: Every color in the design system comes from this file.
 * Components MUST NOT use hex literals.
 *
 * Locked 2026-05-13. Expansion requires governance approval.
 */

export const palette = {
  primarySage: "#7BA483",
  deepForest: "#163A36",
  warmCream: "#F6F1E8",
  eternalGold: "#D4B06A",
  softBlush: "#E5B8AE",
  mist: "#F8F8F4",
} as const;

export type PaletteToken = keyof typeof palette;

/** Semantic mappings — components use these, not raw palette names. */
export const semantic = {
  // Backgrounds
  bgPage: palette.mist,
  bgHero: palette.warmCream,
  bgCard: "rgba(255, 255, 255, 0.78)",
  bgCardElevated: "rgba(255, 255, 255, 0.92)",
  bgOverlay: "rgba(22, 58, 54, 0.42)",

  // Foreground / text
  fgHeading: palette.deepForest,
  fgBody: "#2A3F3D",
  fgMuted: "rgba(22, 58, 54, 0.62)",
  fgInverse: palette.warmCream,

  // Accent / brand
  accentPrimary: palette.eternalGold,
  accentSecondary: palette.primarySage,
  accentTertiary: palette.softBlush,

  // Borders
  borderSubtle: "rgba(22, 58, 54, 0.08)",
  borderStrong: "rgba(22, 58, 54, 0.18)",
  borderFocus: palette.primarySage,

  // States
  stateHoverWash: "rgba(123, 164, 131, 0.08)",
  stateActiveWash: "rgba(123, 164, 131, 0.14)",
  stateDisabledWash: "rgba(248, 248, 244, 0.6)",

  // Status (calm-by-default)
  statusInfo: palette.primarySage,
  statusSuccess: palette.primarySage,
  statusWarning: palette.eternalGold,
  statusCare: palette.softBlush,
} as const;

export type SemanticToken = keyof typeof semantic;

/** Aura / glow colors — used by MMHBFloatAvatar emotional states. */
export const aura = {
  calm: "rgba(123, 164, 131, 0.18)",
  warmth: "rgba(212, 176, 106, 0.16)",
  care: "rgba(229, 184, 174, 0.18)",
  ground: "rgba(22, 58, 54, 0.10)",
} as const;

export type AuraToken = keyof typeof aura;

export const colors = { palette, semantic, aura } as const;
