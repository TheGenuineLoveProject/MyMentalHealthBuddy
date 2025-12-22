/**
 * The Genuine Love Project
 * Brand Source of Truth
 * ----------------------------------
 * This file is intentionally strict.
 * All scanners, UI, and enforcement tools
 * must reference THIS file only.
 */

export const BRAND = {
  name: "The Genuine Love Project",
  tagline: "Live in Genuine Love",
  mission:
    "Helping people heal, grow, and align through everyday self-love and consciousness.",

  colors: {
    /* Core Identity */
    primary: "#8FBF9F",        // Serenity Sage
    secondary: "#F5C5C5",      // Soft Rose
    accent: "#D4AF37",         // Eternal Gold
    gold: "#D4AF37",

    /* Neutrals */
    background: "#FAF9F7",
    paper: "#FAF9F7",
    text: "#2D3748",
    ink: "#2D3748",

    /* Sage System */
    sage: "#8FBF9F",
    sageDark: "#5A9A6E",
    mist: "#F8FAFC",

    /* UI States */
    border: "#E5E7EB",
    muted: "#6B7280",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
  },

  seo: {
    title: "The Genuine Love Project – Live in Genuine Love",
    description:
      "AI-powered mental wellness platform for self-love, healing, and emotional growth — private, compassionate, and available 24/7.",
  },
} as const;

/**
 * BRAND_HEX_ALLOWLIST
 * -------------------
 * Used by:
 * - brand-guard
 * - color scanners
 * - cleanup scripts
 * - enforcement pipelines
 *
 * If a hex is not here, it is considered NON-BRAND.
 */
export const BRAND_HEX_ALLOWLIST: readonly string[] = [
  "#8FBF9F",
  "#F5C5C5",
  "#D4AF37",
  "#FAF9F7",
  "#2D3748",
  "#5A9A6E",
  "#F8FAFC",
  "#E5E7EB",
  "#6B7280",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
] as const;

/**
 * Type helpers
 */
export type BrandColor = keyof typeof BRAND.colors;
export type BrandHex = (typeof BRAND_HEX_ALLOWLIST)[number];