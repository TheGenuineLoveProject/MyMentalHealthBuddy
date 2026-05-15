/**
 * Phase 19 — Emotional Scene Presets
 *
 * Public barrel. External callers consume:
 *   - `SceneTransitionController` (renders scene around children)
 *   - `useScenePreset` (programmatic scene changes)
 *   - `resolvePreset` / `listPresets` (read-only inspection)
 *   - `SceneState` / `ScenePreset` types
 *   - Governance constants (MAX_LIGHTING etc.) for host-side audits
 *
 * Production import:
 *   import {
 *     SceneTransitionController,
 *     useScenePreset,
 *     resolvePreset,
 *   } from "@/lumi-scenes";
 *
 *   const { currentPreset, isTransitioning, setSceneState } = useScenePreset("calm");
 *   setSceneState("comforting"); // → Gentle Lantern
 *
 * NOTE: scene names are INTERNAL ONLY. Do not surface `internalName` in
 * user-facing UI ("select a mood" is a forbidden interaction pattern).
 */

// Engine + types (read-only)
export {
  resolvePreset,
  listPresets,
  SCENE_STATES,
  SCENE_REGISTRY,
} from "./runtime/ScenePresetEngine";
export type {
  SceneState,
  ScenePreset,
  ParticleConfig,
  FogConfig,
  AudioConfig,
} from "./runtime/ScenePresetEngine";

// Hook (programmatic scene changes)
export { useScenePreset } from "./runtime/useScenePreset";
export type { UseScenePresetReturn } from "./runtime/useScenePreset";

// Controller (renders scene around children)
export { SceneTransitionController } from "./transitions/SceneTransitionController";
export type { SceneTransitionControllerProps } from "./transitions/SceneTransitionController";

// Governance (read-only constants + audit helpers)
export {
  MAX_LIGHTING,
  MAX_PARTICLE_COUNT,
  MAX_PARTICLE_SPEED,
  MAX_FOG_OPACITY,
  MAX_AUDIO_VOLUME,
  MIN_TRANSITION_MS,
  FORBIDDEN_EFFECTS,
  containsForbiddenEffect,
  auditPreset,
  assertPresetCompliant,
  sanitizeAudioForPlayback,
} from "./governance/presetSafetyRules";
export type { AuditFinding } from "./governance/presetSafetyRules";
