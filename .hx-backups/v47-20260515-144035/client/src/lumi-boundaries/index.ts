/**
 * Phase 24 — Lumi Boundaries
 * Public barrel.
 */

export { BoundaryCard } from "./components/BoundaryCard";
export type { BoundaryCardProps } from "./components/BoundaryCard";
export { TransparencyDrawer } from "./components/TransparencyDrawer";
export type { TransparencyDrawerProps } from "./components/TransparencyDrawer";

export { useBoundaryState } from "./runtime/useBoundaryState";
export type { UseBoundaryStateReturn } from "./runtime/useBoundaryState";

export {
  BOUNDARY_SPECS,
  listBoundaries,
  checkBoundaries,
} from "./runtime/BoundaryEngine";
export type {
  BoundaryType,
  BoundarySpec,
  BoundaryViolation,
} from "./runtime/BoundaryEngine";

export { BOUNDARY_COPY, listBoundaryCopy } from "./content/boundaryCopy";
export type { BoundaryCopyCard } from "./content/boundaryCopy";

export {
  DISPLAY_RULES,
  FORBIDDEN_BOUNDARY_PHRASES,
  containsForbiddenBoundaryPhrase,
} from "./governance/boundaryEnforcementRules";
export type { DisplayRule } from "./governance/boundaryEnforcementRules";
