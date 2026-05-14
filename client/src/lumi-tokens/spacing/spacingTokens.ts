/**
 * @fileoverview Spacing Token System
 * @module lumi-tokens/spacing
 * @version 1.0.0
 * @since Phase 41
 */

export const SPACING = {
  base: 8, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, "2xl": 48, "3xl": 64, "4xl": 96, "5xl": 128,
} as const;

export const PX = {
  xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px", "2xl": "48px", "3xl": "64px", "4xl": "96px", "5xl": "128px",
} as const;

export const SECTION = { paddingY: 96, paddingX: 32, maxWidth: 1200, narrowWidth: 720 } as const;
export const CARD = { padding: 48, radius: 20, gap: 32 } as const;
export const GRID = { columns: 12, gap: 32, maxWidth: 1200 } as const;

export function toPixels(token: keyof typeof SPACING): string {
  return `${SPACING[token]}px`;
}
export function toRem(token: keyof typeof SPACING): string {
  return `${SPACING[token] / 16}rem`;
}
