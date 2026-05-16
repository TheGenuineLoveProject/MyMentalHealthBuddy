/**
 * @fileoverview Typography Token System
 * @module lumi-tokens/typography
 * @version 1.0.0
 * @since Phase 41
 */

export const FONTS = {
  heading: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
  body: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
  mono: '"SF Mono", "Fira Code", monospace',
} as const;

export const TYPE_SCALE = {
  display: { size: "3rem", lineHeight: 1.1, weight: 400, letterSpacing: "-0.02em" },
  h1: { size: "2.25rem", lineHeight: 1.2, weight: 400, letterSpacing: "-0.01em" },
  h2: { size: "1.75rem", lineHeight: 1.25, weight: 400, letterSpacing: "-0.01em" },
  h3: { size: "1.375rem", lineHeight: 1.3, weight: 500, letterSpacing: "0" },
  h4: { size: "1.125rem", lineHeight: 1.4, weight: 500, letterSpacing: "0" },
  small: { size: "0.875rem", lineHeight: 1.5, weight: 400, letterSpacing: "0.01em" },
  body: { size: "1rem", lineHeight: 1.65, weight: 400, letterSpacing: "0" },
  bodyLarge: { size: "1.125rem", lineHeight: 1.6, weight: 400, letterSpacing: "0" },
} as const;

export const FORBIDDEN_TYPOGRAPHY = [
  "Multiple serif systems on one page",
  "Harsh geometric fonts (Futura, Impact)",
  "Condensed fonts",
  "Aggressive bold weights (800, 900)",
  "Startup-style typography",
  "All-caps body text",
  "Under 12px font size",
  "Line height below 1.5 for body",
] as const;

export const READABILITY = {
  targetFleschScore: 65,
  maxWordsPerSentence: 15,
  maxSentencesPerParagraph: 4,
} as const;

export const CONTRAST = { body: 4.5, large: 3, enhanced: 7 } as const;
export const FONT_LOADING = { display: "swap", preloadHeading: true, preloadBody: true } as const;
