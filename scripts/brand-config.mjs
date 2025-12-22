// scripts/brand-config.mjs
// Brand + system color allowlist + mappings used by scan/cleanup scripts.
// Keep this file JS. Keep package.json JSON-only.

export const BRAND = {
  // Genuine Love Project core palette
  sage: "#A4C3B2",
  sageDeep: "#6D9B8D",
  blush: "#EAC3B5",
  eternalGold: "#EAC33B",
  ink: "var(--glp-ink)",
  paper: "var(--glp-paper)"
};

export const SYSTEM = {
  // Allowed neutral + semantic colors (alerts, badges, charts, etc.)
  white: "#FFFFFF",
  black: "#000000",

  danger: "#EF4444",
  warning: "#F59E0B",
  success: "#10B981",
  info: "#2563EB",

  textStrong: "#111827",
  border: "#D1D5DB",
  bgSoft: "#F9FAFB"
};

// Legacy hex colors -> brand CSS variables
export const HEX_REMAP = {
  // Legacy/old greens -> brand
  "var(--glp-sage-deep)": "var(--glp-sage-deep)",
  "var(--glp-sage)": "var(--glp-sage)",

  // Legacy blush/paper/gold variants -> brand
  "var(--glp-blush)": "var(--glp-blush)",
  "var(--glp-paper)": "var(--glp-paper)",
  "var(--glp-gold)": "var(--glp-gold)",

  // Common neutrals -> tokens
  "var(--glp-ink)": "var(--glp-ink)",
  "var(--glp-ink)": "var(--glp-ink)",
  "var(--glp-paper)": "var(--glp-paper)"
};

// Legacy rgba tokens we saw in your scan output
export const RGBA_REMAP = {
  "rgba(var(--glp-sage-deep-rgb), 0.25)": "rgba(var(--glp-sage-deep-rgb), 0.25)",
  "rgba(var(--glp-sage-deep-rgb), 0.35)": "rgba(var(--glp-sage-deep-rgb), 0.35)",
  "rgba(var(--glp-sage-deep-rgb), 0.12)": "rgba(var(--glp-sage-deep-rgb), 0.12)",
  "rgba(var(--glp-sage-deep-rgb), 0.10)": "rgba(var(--glp-sage-deep-rgb), 0.10)",
  "rgba(var(--glp-sage-deep-rgb), 0.08)": "rgba(var(--glp-sage-deep-rgb), 0.08)",
  "rgba(var(--glp-sage-deep-rgb), 0.06)": "rgba(var(--glp-sage-deep-rgb), 0.06)",

  "rgba(var(--glp-sage-rgb), 0.30)": "rgba(var(--glp-sage-rgb), 0.30)",
  "rgba(var(--glp-sage-rgb), 0.22)": "rgba(var(--glp-sage-rgb), 0.22)",
  "rgba(var(--glp-sage-rgb), 0.15)": "rgba(var(--glp-sage-rgb), 0.15)",
  "rgba(var(--glp-sage-rgb), 0.10)": "rgba(var(--glp-sage-rgb), 0.10)",
  "rgba(var(--glp-sage-rgb), 0.95)": "rgba(var(--glp-sage-rgb), 0.95)",

  "rgba(var(--glp-blush-rgb), 0.18)": "rgba(var(--glp-blush-rgb), 0.18)",
  "rgba(var(--glp-blush-rgb), 0.30)": "rgba(var(--glp-blush-rgb), 0.30)",
  "rgba(var(--glp-paper-rgb), 0.92)": "rgba(var(--glp-paper-rgb), 0.92)"
};

// Allowlist for scanner: anything here should NOT fail scan.
export const ALLOWED_HEX = new Set([
  ...Object.values(BRAND).map((v) => v.toUpperCase()),
  ...Object.values(SYSTEM).map((v) => v.toUpperCase())
]);