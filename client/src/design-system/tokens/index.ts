/**
 * Phase 12 — Design tokens barrel export.
 *
 * Usage:
 *   import { colors, spacing, typography, radius, shadows, motion } from '@/design-system/tokens';
 */

export * from "./colors";
export * from "./spacing";
export * from "./typography";
export * from "./radius";
export * from "./shadows";
export * from "./motion";
export * from "./legacyMap";

export { colors } from "./colors";
export { spacing, section, card, responsive, baseUnit } from "./spacing";
export { typography, fonts, heading, body } from "./typography";
export { radius, radiusFor } from "./radius";
export { shadows, shadowFor } from "./shadows";
export { motion, duration, easing, transition } from "./motion";
