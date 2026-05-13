/**
 * Phase 11 — Single import point for the production avatar runtime.
 *
 * Hero usage:
 *   import { MMHBFloatAvatar, MMHBAvatarRuntimeProvider } from "@/avatar-life";
 *
 *   <MMHBAvatarRuntimeProvider surfaceContext="hero" defaultState="calmIdle">
 *     <MMHBFloatAvatar
 *       imageSrc="/avatar-core/master/MMHB_FLOAT_IDLE_UNIT_v1_clean_master.png"
 *       state="calmIdle"
 *       size={400}
 *       interactive
 *     />
 *   </MMHBAvatarRuntimeProvider>
 */

export {
  MMHBFloatAvatar,
} from "./components/MMHBFloatAvatar";
export {
  MMHBAvatarRuntimeProvider,
  useAvatarRuntimeContext,
} from "./components/MMHBAvatarRuntimeProvider";
export { AvatarWithReactState } from "./components/AvatarWithReactState";

export {
  useAvatarLifeStore,
  useAvatarStoreApi,
  createAvatarLifeStore,
  selectInteractionIntensity,
  selectReactBridge,
} from "./state/useAvatarLifeStore";
export type { AvatarLifeState, AvatarLifeStoreApi } from "./state/useAvatarLifeStore";
export { useAvatarPresenceRuntime } from "./hooks/useAvatarPresenceRuntime";
export { useReducedMotionSafe } from "./hooks/useReducedMotionSafe";

export {
  onAvatarTelemetry,
  emitAvatarTelemetry,
  reportContractViolation,
} from "./observability/avatarRuntimeTelemetry";

export {
  auditMultiplier,
  auditInteractionLimits,
  auditAll,
  MOTION_LIMITS,
  IDENTITY_RULES,
} from "./governance/nonDriftRules";

export {
  EMOTIONAL_STATES,
  EMOTION_MULTIPLIERS,
  INTERACTION_LIMITS,
  SURFACE_DEFAULT_STATE,
  AVATAR_SOURCE_DIMENSION,
  SUB_PIXEL_FLOAT_CEILING_PX,
  SUB_PERCENT_BREATH_CEILING,
  GLOW_OPACITY_CEILING,
} from "./types/avatarLifeTypes";

export type {
  EmotionalState,
  SurfaceContext,
  MotionMultiplier,
  AvatarTelemetryEvent,
  TelemetryListener,
  AvatarReactState,
} from "./types/avatarLifeTypes";
export type { RuleViolation } from "./governance/nonDriftRules";
