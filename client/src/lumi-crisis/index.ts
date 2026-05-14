/**
 * Phase 34 — lumi-crisis public barrel.
 *
 * Opt-in standalone module. The crisis surface is a trust boundary —
 * never decorate, never gate, never analyse.
 */

export type { CrisisResource, CrisisResourceDirectory } from "./resources/crisisResources";
export { CRISIS_RESOURCES, getPrimaryUSResource } from "./resources/crisisResources";

export type { CrisisPanelProps } from "./components/CrisisPanel";
export { CrisisPanel } from "./components/CrisisPanel";

export type { CrisisSeverity, CrisisDetectionResult } from "./components/CrisisTriggerDetector";
export { detectCrisisIndicators } from "./components/CrisisTriggerDetector";

export type { CrisisSafetyRule } from "./governance/crisisSafetyRules";
export { CRISIS_SAFETY_RULES } from "./governance/crisisSafetyRules";
