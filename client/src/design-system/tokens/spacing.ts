/**
 * Phase 12 — Spacing tokens
 * Canonical governed spacing scale
 */

export const baseUnit = 8;

const u = (n: number) => `${n * baseUnit}px`;

export const spacing = {
  xxs: "4px",

  xs: u(1),     // 8px
  sm: u(2),     // 16px
  md: u(3),     // 24px
  lg: u(4),     // 32px
  xl: u(6),     // 48px
  xxl: u(8),    // 64px
  xxxl: u(12),  // 96px
  xxxxl: u(16), // 128px
} as const;

export type SpacingToken = keyof typeof spacing;

export const section = {
  paddingX: spacing.xl,
  paddingY: spacing.xxxl,
  gap: spacing.xxl,
} as const;

export const card = {
  padding: spacing.xl,
  gap: spacing.lg,
} as const;

export const responsive = {
  mobile: {
    sectionPaddingX: spacing.md,
    sectionPaddingY: spacing.xxl,
    sectionGap: spacing.lg,
    cardPadding: spacing.md,
  },

  tablet: {
    sectionPaddingX: spacing.lg,
    sectionPaddingY: spacing.xxxl,
    sectionGap: spacing.xl,
    cardPadding: spacing.lg,
  },

  desktop: {
    sectionPaddingX: section.paddingX,
    sectionPaddingY: section.paddingY,
    sectionGap: section.gap,
    cardPadding: card.padding,
  },
} as const;

export type ResponsiveBreakpoint = keyof typeof responsive;