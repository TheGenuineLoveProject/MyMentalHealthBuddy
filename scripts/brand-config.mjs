// scripts/brand-config.mjs
// Brand + system color allowlist + mappings used by scan/cleanup scripts.
// Edit these ONCE, then keep your repo consistent.

export const BRAND = {
  // Genuine Love Project core palette
  sage: "#A4C3B2",
  sageDeep: "#6D9B8D",
  blush: "#EAC3B5",
  eternalGold: "#EAC33B",
  ink: "#1C1C1C",
  paper: "#F6F7F8",
};

export const SYSTEM = {
  // Allowed neutral + semantic colors (for alerts, badges, charts, etc.)
  white: "#FFFFFF",
  black: "#000000",

  danger: "#EF4444",
  warning: "#F59E0B",
  success: "#10B981",
  info: "#2563EB",

  textStrong: "#111827",
  border: "#D1D5DB",
  bgSoft: "#F9FAFB",
};

// Legacy colors we *convert* to brand/system tokens (hex and rgb-derived).
export const HEX_REMAP = {
  // Legacy/old greens -> brand
  "#2F5D5D": "var(--glp-sage-deep)",
  "#8FBF9F": "var(--glp-sage)",

  // Legacy blush/paper/gold variants -> brand
  "#F4C7C3": "var(--glp-blush)",
  "#FAF9F7": "var(--glp-paper)",
  "#D4AF37": "var(--glp-gold)",

  // Common neutrals -> tokens
  "#3A3A3A": "var(--glp-ink)",
  "#1C1C1C": "var(--glp-ink)",
  "#F6F7F8": "var(--glp-paper)",
};

// Legacy rgba tokens we saw in your scan output
export const RGBA_REMAP = {
  "rgba(47, 93, 93, 0.25)": "rgba(var(--glp-sage-deep-rgb), 0.25)",
  "rgba(47, 93, 93, 0.35)": "rgba(var(--glp-sage-deep-rgb), 0.35)",
  "rgba(47, 93, 93, 0.12)": "rgba(var(--glp-sage-deep-rgb), 0.12)",
  "rgba(47, 93, 93, 0.10)": "rgba(var(--glp-sage-deep-rgb), 0.10)",
  "rgba(47, 93, 93, 0.08)": "rgba(var(--glp-sage-deep-rgb), 0.08)",
  "rgba(47, 93, 93, 0.06)": "rgba(var(--glp-sage-deep-rgb), 0.06)",

  "rgba(143, 191, 159, 0.30)": "rgba(var(--glp-sage-rgb), 0.30)",
  "rgba(143, 191, 159, 0.22)": "rgba(var(--glp-sage-rgb), 0.22)",
  "rgba(143, 191, 159, 0.15)": "rgba(var(--glp-sage-rgb), 0.15)",
  "rgba(143, 191, 159, 0.10)": "rgba(var(--glp-sage-rgb), 0.10)",
  "rgba(143, 191, 159, 0.95)": "rgba(var(--glp-sage-rgb), 0.95)",

  "rgba(244, 199, 195, 0.18)": "rgba(var(--glp-blush-rgb), 0.18)",
  "rgba(244, 199, 195, 0.30)": "rgba(var(--glp-blush-rgb), 0.30)",
  "rgba(250, 249, 247, 0.92)": "rgba(var(--glp-paper-rgb), 0.92)",
};

// Allowlist for the scanner: anything here should NOT fail scan.
export const ALLOWED_HEX = new Set([
  ...Object.values(BRAND).map((v) => v.toUpperCase()),
  ...Object.values(SYSTEM).map((v) => v.toUpperCase()),
]);