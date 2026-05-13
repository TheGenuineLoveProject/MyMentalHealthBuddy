/**
 * Phase 12 — Spacing tokens. 8px base unit.
 *
 * RULE: Section padding Y MUST exceed gap.
 * Gaps MUST come from the scale below — no arbitrary px values in components.
 */

export const baseUnit = 8;

const u = (n: number) => `${n * baseUnit}px`;

export const spacing = {
  /** 4px — only for icon nudge / hairline alignment */
  xxs: "4px",
  /** 8px */
  xs: u(1),
  /** 16px */
  sm: u(2),
  /** 24px */
  md: u(3),
  /** 32px */
  lg: u(4),
  /** 48px */
  xl: u(6),
  /** 64px */
  xxl: u(8),
  /** 96px */
  xxxl: u(12),
  /** 128px */
  xxxxl: u(16),
} as const;

export type SpacingToken = keyof typeof spacing;

/** Section-level rhythm — locked per Phase 12 governance. */
export const section = {
  paddingX: spacing.xl, // 48px
  paddingY: spacing.xxxl, // 96px (breathing room)
  gap: spacing.xxl, // 64px
} as const;

/** Card-level rhythm. */
export const card = {
  padding: spacing.xl, // 48px
  gap: spacing.lg, // 32px
} as const;

/** Responsive overrides — mobile / tablet / desktop. */
export const responsive = {
  mobile: {
    sectionPaddingX: spacing.md, // 24px
    sectionPaddingY: spacing.xxl, // 64px
    sectionGap: spacing.lg, // 32px
    cardPadding: spacing.md, // 24px
  },
  tablet: {
    sectionPaddingX: spacing.lg, // 32px
    sectionPaddingY: spacing.xxxl, // 96px
    sectionGap: spacing.xl, // 48px
    cardPadding: spacing.lg, // 32px
  },
  desktop: {
    sectionPaddingX: section.paddingX,
    sectionPaddingY: section.paddingY,
    sectionGap: section.gap,
    cardPadding: card.padding,
  },
} as const;

export type ResponsiveBreakpoint = keyof typeof responsive;
