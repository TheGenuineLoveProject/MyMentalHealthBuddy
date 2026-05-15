/**
 * Phase 14 (spec-aligned) — public barrel.
 *
 * External code should ONLY import from "@/calm-checkin".
 * The internal store, governance, and content paths are blocked by the
 * module-boundary scanner test.
 */

export { CalmCheckinEntry } from "./components/CalmCheckinEntry";
export type { CalmCheckinEntryProps } from "./components/CalmCheckinEntry";
export type { CalmContinueOptionId } from "./components/CalmContinueOptions";

// Read-only helpers (no store handle exported).
export {
  isOptionalSignupAllowed,
  REQUIRE_EXERCISE_BEFORE_CONTINUE,
} from "./state/calmCheckinState";
export type {
  CalmCheckinStep,
  CalmExerciseKind,
  CalmCheckinState,
} from "./state/calmCheckinState";

export { auditCalmFlow, auditCalmContent } from "./governance/calmCheckinRules";
export type { CalmRuleResult } from "./governance/calmCheckinRules";
