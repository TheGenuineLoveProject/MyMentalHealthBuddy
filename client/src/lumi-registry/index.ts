/**
 * Phase 28 + 29 — Lumi Registry · public barrel.
 *
 * Production import:
 *   import {
 *     OfficialLumi,
 *     LumiSceneRenderer,
 *     getVariant,
 *     getSceneAssignment,
 *     getPagePlacement,
 *     runPageMapAudit,
 *   } from "@/lumi-registry";
 *
 * Governance markdown is intentionally NOT exported.
 */

// Phase 30 — opt-in CSS for asset render mode. Importing any registry
// symbol pulls these keyframes in. Vite handles the .css side-effect.
import "./styles/lumiMotion.css";

// Components
export { OfficialLumi } from "./components/OfficialLumi";
export type {
  OfficialLumiProps,
  OfficialLumiPosition,
  OfficialLumiRenderMode,
  OfficialLumiMotion,
} from "./components/OfficialLumi";
export { LumiSceneRenderer } from "./components/LumiSceneRenderer";
export type { LumiSceneRendererProps } from "./components/LumiSceneRenderer";

// Registry — official variants (Phase 28 + Phase 30 asset extensions)
export {
  OFFICIAL_LUMI_REGISTRY,
  ALL_VARIANT_IDS,
  getVariant,
  isCanonicalVariant,
  validateVariantPlacement,
  findVariantForContext,
  getVariantsByRole,
  isCanonicalAssetPath,
  getOfficialAsset,
} from "./registry/officialLumiRegistry";
export type {
  LumiVariantId,
  LumiAssetRole,
  OfficialLumiVariant,
  PlacementValidation as VariantPlacementValidation,
} from "./registry/officialLumiRegistry";

// Phase 30 — central type re-exports
export type { LumiMotionIntensity, ReplacementStatus, ReplacementEntry } from "./types/lumiTypes";

// Phase 31 — page replacement rollout map
export {
  lumiPageReplacements,
  markReplacementDone,
  markReplacementStatus,
  getReplacementStatus,
  getPendingReplacements,
  getDoneReplacements,
  getNextReplacement,
  runReplacementAudit,
  OLD_AVATAR_GREP_PATTERNS,
  getGrepCommand,
} from "./registry/lumiPageReplacementMap";
export type { ReplacementAuditResult } from "./registry/lumiPageReplacementMap";

// Registry — emotional roles
export {
  EMOTIONAL_ROLES,
  getEmotionalRole,
  getPrimaryVariantForContext,
  getContextsForVariant,
  isIntensityAppropriate,
} from "./registry/lumiEmotionalRoles";
export type { EmotionalRole } from "./registry/lumiEmotionalRoles";

// Registry — scene assignments
export {
  SCENE_ASSIGNMENTS,
  getSceneAssignment,
  getVariantForScene,
  getScenesForVariant,
  validateSceneConfig,
  getAllAssignedScenes,
} from "./registry/lumiSceneAssignments";
export type { SceneAssignment, ScenePosition, SceneConfigValidation } from "./registry/lumiSceneAssignments";

// Registry — placement rules
export {
  FORBIDDEN_PLACEMENTS,
  REQUIRED_PLACEMENTS,
  ALL_PLACEMENT_RULES,
  SIZE_GOVERNANCE,
  validatePlacement,
  getMaxSizeForContext,
} from "./registry/lumiPlacementRules";
export type {
  PlacementRule,
  PlacementRuleType,
  PlacementSeverity,
  PlacementOptions,
  PlacementValidation,
} from "./registry/lumiPlacementRules";

// Registry — usage rules
export {
  MOTION_GOVERNANCE,
  ACCESSIBILITY_RULES,
  EMOTIONAL_CONSTRAINTS,
  VISUAL_COHESION_REQUIREMENTS,
  EMOTIONAL_TONE_CHECKLIST,
  validateUsage,
} from "./registry/lumiUsageRules";
export type { UsageRule, UsageCheckInput, UsageValidation } from "./registry/lumiUsageRules";

// Registry — page placement map (Phase 29)
export {
  PAGE_PLACEMENT_MAP,
  getPagePlacement,
  getVariantForPage,
  isPlacementValid,
  isLumiForbidden,
  getPagesForVariant,
  getAllPageIds,
  getRequiredPlacements,
  getForbiddenPlacements,
  verifyImportPath,
  runPageMapAudit,
  canRenderLumi,
} from "./registry/lumiPagePlacementMap";
export type {
  AssignmentType,
  PagePlacement,
  PagePosition,
  ImportPathValidation,
  PageMapAuditResult,
  RenderPolicyDecision,
} from "./registry/lumiPagePlacementMap";
