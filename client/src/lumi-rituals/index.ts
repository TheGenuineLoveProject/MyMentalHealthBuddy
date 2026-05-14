/**
 * Phase 20 — Guided Presence Rituals · Public barrel
 *
 * Production import:
 *   import {
 *     GuidedPresenceRitual,
 *     RitualStepCard,
 *     useRitual,
 *     resolveRitual,
 *     listRituals,
 *     RITUAL_REGISTRY,
 *     RITUAL_KEYS,
 *     auditPreset,
 *     containsForbiddenPhrase,
 *   } from "@/lumi-rituals";
 *
 * NOT exported (intentionally — bypass prevention):
 *   - The reducer's internal `_state` shape mutators
 *   - Direct preset objects (use `resolveRitual(key)` so frozen registry path is honored)
 */

export { GuidedPresenceRitual } from "./components/GuidedPresenceRitual";
export type { GuidedPresenceRitualProps } from "./components/GuidedPresenceRitual";
export { RitualStepCard } from "./components/RitualStepCard";
export type { RitualStepCardProps } from "./components/RitualStepCard";

export { useRitual } from "./runtime/useRitual";
export type { UseRitualReturn } from "./runtime/useRitual";

export {
  RITUAL_KEYS,
  isTerminalStatus,
  shouldNotifyTerminal,
  ritualReducer,
  INITIAL_STATE,
} from "./runtime/RitualEngine";
export type {
  RitualKey,
  RitualPreset,
  RitualStep,
  RitualState,
  RitualStatus,
  RitualAction,
  BreathCadence,
} from "./runtime/RitualEngine";

export {
  RITUAL_REGISTRY,
  resolveRitual,
  listRituals,
} from "./runtime/ritualRegistry";

export {
  FORBIDDEN_PHRASES,
  REQUIRED_TONE_MARKERS,
  MAX_STEP_DURATION_MS,
  MAX_RITUAL_DURATION_MS,
  MAX_STEPS_PER_RITUAL,
  MIN_STEPS_PER_RITUAL,
  MAX_STEP_COPY_CHARS,
  MAX_FRAME_COPY_CHARS,
  containsForbiddenPhrase,
  auditPreset,
  auditStepCopy,
  assertPresetCompliant,
} from "./governance/ritualSafetyRules";
export type { AuditFinding } from "./governance/ritualSafetyRules";
