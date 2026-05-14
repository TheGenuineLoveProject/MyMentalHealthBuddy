/**
 * Phase 25 — useConsistencyState
 *
 * SSR-safe React hook that exposes the cross-platform consistency surface:
 *   validateEnforcement / checkTiming / verifyIdentity / checkAdaptation
 */

import { useCallback, useMemo } from "react";
import {
  runEnforcementValidation,
  type PlatformReport,
  type EnforcementReport,
} from "../governance/crossPlatformEnforcementRules";
import {
  runIdentityVerification,
  type IdentityVerificationData,
  type IdentityVerificationReport,
} from "./identityVerificationSystem";
import {
  PRESERVED_PATTERNS,
  checkPatternTiming,
} from "./preservedInteractionPatterns";
import type { LumiInteractionPattern } from "../tokens/lumiConsistencyTokens";
import {
  ADAPTATION_BOUNDARIES,
  getBoundary,
  type Platform,
  type AdaptationBoundary,
} from "../governance/crossPlatformAdaptationBoundaries";

export interface UseConsistencyStateReturn {
  validateEnforcement(report: PlatformReport): EnforcementReport;
  checkTiming(
    key: LumiInteractionPattern,
    durationMs: number,
  ): ReturnType<typeof checkPatternTiming>;
  verifyIdentity(platform: string, data: IdentityVerificationData): IdentityVerificationReport;
  checkAdaptation(boundaryId: string, platform: Platform): AdaptationBoundary<unknown> | undefined;
  readonly preservedPatterns: typeof PRESERVED_PATTERNS;
  readonly adaptationBoundaries: typeof ADAPTATION_BOUNDARIES;
}

export function useConsistencyState(): UseConsistencyStateReturn {
  const validateEnforcement = useCallback(
    (report: PlatformReport) => runEnforcementValidation(report),
    [],
  );

  const checkTiming = useCallback(
    (key: LumiInteractionPattern, durationMs: number) => checkPatternTiming(key, durationMs),
    [],
  );

  const verifyIdentity = useCallback(
    (platform: string, data: IdentityVerificationData) =>
      runIdentityVerification(platform, data),
    [],
  );

  const checkAdaptation = useCallback(
    (boundaryId: string, _platform: Platform) => {
      void _platform; // platform is informational; boundary itself is platform-aware
      return getBoundary(boundaryId);
    },
    [],
  );

  return useMemo(
    () => ({
      validateEnforcement,
      checkTiming,
      verifyIdentity,
      checkAdaptation,
      preservedPatterns: PRESERVED_PATTERNS,
      adaptationBoundaries: ADAPTATION_BOUNDARIES,
    }),
    [validateEnforcement, checkTiming, verifyIdentity, checkAdaptation],
  );
}
