/**
 * Phase 12 — Platform Safety Architecture v1
 * Top-level barrel for the canonical MMHB design system.
 *
 * Usage:
 *   import { MMHBButton, MMHBCard, colors, spacing } from '@/design-system';
 *
 * Status: opt-in. Existing surfaces are not migrated by this PR.
 * Governance: docs/governance/PLATFORMSAFETYARCHITECTURE.md
 */

// Tokens
export * from "./tokens";

// Components
export { MMHBButton } from "./components/MMHBButton";
export type {
  MMHBButtonVariant,
  MMHBButtonSize,
} from "./components/MMHBButton";
export { MMHBCard } from "./components/MMHBCard";
export type { MMHBCardElevation } from "./components/MMHBCard";
