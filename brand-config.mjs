// scripts/brand-config.mjs
export const BRAND = {
  name: "MyMentalHealthBuddy",
  byline: "by The Genuine Love Project",
  fullName: "MyMentalHealthBuddy by The Genuine Love Project",
  tagline: "Mental Health from A to Z",
  palette: {
    serenitySage: "#6D9B8D",
    softSage: "#A4C3B2",
    blushSand: "#EAC3B5",
    ivory: "var(--glp-paper)",
    ink: "var(--glp-ink)",
    eternalGold: "var(--glp-gold)",
  },
};

// Hex allowlist used by scan scripts (normalize to lowercase).
export const BRAND_HEX_ALLOWLIST = new Set(
  Object.values(BRAND.palette).map((h) => h.toLowerCase())
);

// Common “legacy”/non-brand colors to hunt for (add as you find them).
export const LEGACY_HEX_DENYLIST = new Set(
  [
    "#ffffff",
    "#f5f5f5",
    "#eeeeee",
    "#cccccc",
    "#000000",
    "#2563eb", // common blue
  ].map((h) => h.toLowerCase())
);

// Legacy names we want to eliminate from text/docs
export const LEGACY_NAMES = [
  "GenuineLoveProject",
  "genuineloveproject",
];