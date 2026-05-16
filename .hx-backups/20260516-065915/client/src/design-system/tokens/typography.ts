/**
 * Phase 12 — Typography. ONE serif (headings) + ONE sans-serif (body).
 *
 * FORBIDDEN: Mixing two serifs (Fraunces + Cormorant), Inter + DM Sans,
 * serif for body, sans-serif for headings.
 */

export const fonts = {
  heading:
    `'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif`,
  body:
    `'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif`,
} as const;

export type FontFamilyToken = keyof typeof fonts;

/** Heading scale — Cormorant Garamond. */
export const heading = {
  display: { size: "64px", lineHeight: "1.08", weight: 500, letterSpacing: "-0.02em" },
  h1: { size: "48px", lineHeight: "1.12", weight: 500, letterSpacing: "-0.015em" },
  h2: { size: "36px", lineHeight: "1.18", weight: 500, letterSpacing: "-0.01em" },
  h3: { size: "28px", lineHeight: "1.22", weight: 500, letterSpacing: "-0.005em" },
  h4: { size: "22px", lineHeight: "1.28", weight: 500, letterSpacing: "0" },
} as const;

export type HeadingToken = keyof typeof heading;

/** Body scale — DM Sans. */
export const body = {
  lg: { size: "18px", lineHeight: "1.6", weight: 400, letterSpacing: "0" },
  md: { size: "16px", lineHeight: "1.6", weight: 400, letterSpacing: "0" },
  sm: { size: "14px", lineHeight: "1.55", weight: 400, letterSpacing: "0.005em" },
  xs: { size: "12px", lineHeight: "1.5", weight: 500, letterSpacing: "0.02em" },
} as const;

export type BodyToken = keyof typeof body;

export const typography = { fonts, heading, body } as const;
