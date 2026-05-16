/**
 * Phase 25 — identityVerificationSystem
 *
 * 7-check verification engine. `runIdentityVerification(platform, data)`
 * returns a full report with a 0-100 compliance score.
 */

import {
  LUMI_IDENTITY,
  LUMI_VOICE_CAPS,
  LUMI_TIMING,
  LUMI_EMOTIONAL_STATES,
  LUMI_INTERACTION_PATTERNS,
} from "../tokens/lumiConsistencyTokens";

export interface IdentityVerificationData {
  readonly identityName?: string;
  readonly identityRole?: string;
  readonly maxVolume?: number;
  readonly autoplayAllowed?: boolean;
  readonly breathCycleMs?: number;
  readonly emotionalStateCount?: number;
  readonly interactionPatternCount?: number;
  readonly captionsAvailable?: boolean;
  readonly crisisRouteAvailable?: boolean;
}

export interface CheckResult {
  readonly id: string;
  readonly description: string;
  readonly passed: boolean;
  readonly detail: string;
}

export interface IdentityVerificationReport {
  readonly platform: string;
  readonly checks: ReadonlyArray<CheckResult>;
  readonly passedCount: number;
  readonly totalCount: number;
  /** 0..100, integer. */
  readonly complianceScore: number;
  readonly passed: boolean;
}

const TOTAL_CHECKS = 7;

export function runIdentityVerification(
  platform: string,
  data: IdentityVerificationData,
): IdentityVerificationReport {
  const checks: CheckResult[] = [
    {
      id: "name",
      description: "Companion name matches LUMI_IDENTITY.name",
      passed: data.identityName === LUMI_IDENTITY.name,
      detail: `expected "${LUMI_IDENTITY.name}", got "${data.identityName ?? ""}"`,
    },
    {
      id: "role",
      description: "Companion role matches LUMI_IDENTITY.role",
      passed: data.identityRole === LUMI_IDENTITY.role,
      detail: `expected "${LUMI_IDENTITY.role}", got "${data.identityRole ?? ""}"`,
    },
    {
      id: "volume-cap",
      description: "Voice volume cap respected",
      passed:
        typeof data.maxVolume === "number" && data.maxVolume <= LUMI_VOICE_CAPS.maxVolume,
      detail: `cap ${LUMI_VOICE_CAPS.maxVolume}, got ${data.maxVolume ?? "n/a"}`,
    },
    {
      id: "no-autoplay",
      description: "Autoplay disabled",
      passed: data.autoplayAllowed === false,
      detail: `autoplayAllowed=${data.autoplayAllowed}`,
    },
    {
      id: "breath-cycle",
      description: "Breath cycle equals LUMI_TIMING.breathCycleMs",
      passed: data.breathCycleMs === LUMI_TIMING.breathCycleMs,
      detail: `expected ${LUMI_TIMING.breathCycleMs}ms, got ${data.breathCycleMs ?? "n/a"}ms`,
    },
    {
      id: "emotional-states",
      description: `All ${LUMI_EMOTIONAL_STATES.length} emotional states present`,
      passed: data.emotionalStateCount === LUMI_EMOTIONAL_STATES.length,
      detail: `expected ${LUMI_EMOTIONAL_STATES.length}, got ${data.emotionalStateCount ?? 0}`,
    },
    {
      id: "interaction-patterns",
      description: `All ${LUMI_INTERACTION_PATTERNS.length} interaction patterns present`,
      passed: data.interactionPatternCount === LUMI_INTERACTION_PATTERNS.length,
      detail: `expected ${LUMI_INTERACTION_PATTERNS.length}, got ${data.interactionPatternCount ?? 0}`,
    },
  ];

  if (checks.length !== TOTAL_CHECKS) {
    throw new Error(
      `[lumi-consistency] identityVerificationSystem expected ${TOTAL_CHECKS} checks, ran ${checks.length}.`,
    );
  }

  const passedCount = checks.filter((c) => c.passed).length;
  const complianceScore = Math.round((passedCount / TOTAL_CHECKS) * 100);

  return {
    platform,
    checks,
    passedCount,
    totalCount: TOTAL_CHECKS,
    complianceScore,
    passed: passedCount === TOTAL_CHECKS,
  };
}
