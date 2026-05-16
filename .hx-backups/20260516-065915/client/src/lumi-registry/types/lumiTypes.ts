/**
 * Phase 30 — Central type re-exports for the Lumi registry.
 *
 * This module is the canonical import surface for type-only consumers
 * (e.g. host modules that don't need the runtime registry). It avoids
 * deep imports into `registry/`, so internal restructuring stays free.
 */

export type {
  LumiVariantId,
  LumiAssetRole,
  OfficialLumiVariant,
  PlacementValidation,
} from "../registry/officialLumiRegistry";

export type {
  AssignmentType,
  PagePlacement,
  PagePosition,
  ImportPathValidation,
  PageMapAuditResult,
  RenderPolicyDecision,
} from "../registry/lumiPagePlacementMap";

export type { SceneAssignment, ScenePosition, SceneConfigValidation } from "../registry/lumiSceneAssignments";
export type { EmotionalRole } from "../registry/lumiEmotionalRoles";
export type {
  PlacementRule,
  PlacementRuleType,
  PlacementSeverity,
  PlacementOptions,
} from "../registry/lumiPlacementRules";

/** Phase 30 — motion intensity for `<OfficialLumi renderMode="asset">`. */
export type LumiMotionIntensity = "soft" | "reduced" | "none";

/** Phase 31 — replacement workflow status. */
export type ReplacementStatus = "pending" | "in-progress" | "blocked" | "done";

/** Phase 31 — single replacement entry tracked by the rollout system. */
export interface ReplacementEntry {
  readonly section: string;
  readonly oldAsset: string;
  readonly newComponent: string;
  readonly newVariant: import("../registry/officialLumiRegistry").LumiVariantId;
  readonly position: "hero" | "inline" | "background" | "card";
  readonly maxWidthPx: number;
  readonly status: ReplacementStatus;
  readonly notes?: string;
}
