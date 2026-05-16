/**
 * @fileoverview Component Token System
 * @module lumi-tokens/components
 * @version 1.0.0
 * @since Phase 41
 */

import { COLORS } from "../colors/colorTokens";
import { SHADOWS, GLOWS } from "../shadows/shadowTokens";

export const CARD_TOKENS = {
  background: "rgba(255, 255, 255, 0.78)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.4)",
  boxShadow: SHADOWS.subtle,
  borderRadius: "20px",
  padding: "48px",
  hoverShadow: SHADOWS.soft,
  transition: "box-shadow 0.4s ease, transform 0.4s ease",
  hoverTransform: "translateY(-2px)",
} as const;

export const BUTTON_TOKENS = {
  primaryBackground: `linear-gradient(135deg, ${COLORS.serenitySage} 0%, ${COLORS.deepTeal} 100%)`,
  primaryText: "#FFFFFF",
  primaryHoverGlow: GLOWS.gold,
  primaryHoverTransform: "translateY(-1px)",
  borderRadius: "12px",
  padding: "12px 28px",
  fontWeight: 500,
  transition: "all 0.3s ease",
  disabledOpacity: 0.5,
  disabledCursor: "not-allowed",
  secondaryBackground: "transparent",
  secondaryBorder: `1.5px solid ${COLORS.deepTeal}`,
  secondaryText: COLORS.deepTeal,
  ghostBackground: "transparent",
  ghostText: COLORS.charcoalDeep,
  ghostHoverBackground: "rgba(143, 191, 159, 0.08)",
} as const;

export const INPUT_TOKENS = {
  background: COLORS.ivoryLight,
  border: "1px solid rgba(22, 58, 54, 0.12)",
  borderRadius: "12px",
  padding: "12px 16px",
  focusBorder: `1.5px solid ${COLORS.serenitySage}`,
  focusShadow: "0 0 0 3px rgba(143, 191, 159, 0.2)",
  placeholderColor: "rgba(58, 58, 58, 0.4)",
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
} as const;

export const MOTION_TOKENS = {
  defaultDuration: "0.4s",
  fastDuration: "0.2s",
  slowDuration: "0.6s",
  defaultEasing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  gentleEasing: "cubic-bezier(0.4, 0, 0.2, 1)",
  maxActiveElements: 3,
  reducedMotion: "prefer-reduced-motion",
} as const;

export const CONTAINER_TOKENS = {
  maxWidth: "1200px", narrowWidth: "720px", pagePadding: "32px",
  sectionPaddingY: "96px", largeRadius: "24px", smallRadius: "16px",
} as const;

export const DIVIDER_TOKENS = {
  default: "1px solid rgba(22, 58, 54, 0.08)",
  accent: `1px solid ${COLORS.serenitySage}`,
  marginY: "48px",
} as const;
