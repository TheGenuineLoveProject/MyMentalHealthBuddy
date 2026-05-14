/**
 * Phase 25 — crossPlatformEnforcementRules
 *
 * 10 rules — 6 critical, 4 warning. Critical failures block ship; warnings
 * surface for review but do not block. Each rule provides a `check` that
 * runs against a platform implementation report.
 */

export type EnforcementSeverity = "critical" | "warning";

export interface PlatformReport {
  readonly platform: string;
  readonly identityName?: string;
  readonly identityRole?: string;
  readonly autoplayAllowed?: boolean;
  readonly maxVolume?: number;
  readonly captionsAvailable?: boolean;
  readonly honorsReducedMotion?: boolean;
  readonly emotionalStateCount?: number;
  readonly interactionPatternCount?: number;
  readonly crisisRouteAvailable?: boolean;
  readonly anyOptInDefaultsOn?: boolean;
  readonly anyForbiddenPhraseInCopy?: boolean;
  readonly toneMarkerCoverage?: number; // 0..1
}

export interface EnforcementRule {
  readonly id: string;
  readonly description: string;
  readonly severity: EnforcementSeverity;
  check(report: PlatformReport): boolean;
}

export const ENFORCEMENT_RULES: ReadonlyArray<EnforcementRule> = Object.freeze([
  {
    id: "identity-name",
    description: "Companion name must be 'Lumi' on every platform.",
    severity: "critical",
    check: (r) => r.identityName === "Lumi",
  },
  {
    id: "identity-role",
    description: "Companion role must be 'companion' on every platform.",
    severity: "critical",
    check: (r) => r.identityRole === "companion",
  },
  {
    id: "no-autoplay",
    description: "Voice must never autoplay on any platform.",
    severity: "critical",
    check: (r) => r.autoplayAllowed === false,
  },
  {
    id: "volume-cap",
    description: "Maximum voice volume must not exceed 0.4.",
    severity: "critical",
    check: (r) => typeof r.maxVolume === "number" && r.maxVolume <= 0.4,
  },
  {
    id: "captions-available",
    description: "Captions must be available on every platform that supports voice.",
    severity: "critical",
    check: (r) => r.captionsAvailable === true,
  },
  {
    id: "crisis-route",
    description: "/crisis route must be reachable from every Lumi surface.",
    severity: "critical",
    check: (r) => r.crisisRouteAvailable === true,
  },
  {
    id: "honors-reduced-motion",
    description: "Platform should honor prefers-reduced-motion.",
    severity: "warning",
    check: (r) => r.honorsReducedMotion === true,
  },
  {
    id: "all-emotional-states",
    description: "Platform should expose all 8 emotional states.",
    severity: "warning",
    check: (r) => r.emotionalStateCount === 8,
  },
  {
    id: "all-interaction-patterns",
    description: "Platform should support all 8 interaction patterns.",
    severity: "warning",
    check: (r) => r.interactionPatternCount === 8,
  },
  {
    id: "tone-marker-coverage",
    description: "Tone marker coverage across surfaces should be ≥ 0.6.",
    severity: "warning",
    check: (r) => typeof r.toneMarkerCoverage === "number" && r.toneMarkerCoverage >= 0.6,
  },
]);

if (ENFORCEMENT_RULES.length !== 10) {
  throw new Error(
    `[lumi-consistency] ENFORCEMENT_RULES must contain exactly 10 rules, found ${ENFORCEMENT_RULES.length}.`,
  );
}

const criticalCount = ENFORCEMENT_RULES.filter((r) => r.severity === "critical").length;
const warningCount = ENFORCEMENT_RULES.filter((r) => r.severity === "warning").length;
if (criticalCount !== 6 || warningCount !== 4) {
  throw new Error(
    `[lumi-consistency] ENFORCEMENT_RULES severity split must be 6 critical / 4 warning (got ${criticalCount}/${warningCount}).`,
  );
}

export interface RuleResult {
  readonly id: string;
  readonly severity: EnforcementSeverity;
  readonly passed: boolean;
  readonly description: string;
}

export interface EnforcementReport {
  readonly platform: string;
  readonly results: ReadonlyArray<RuleResult>;
  readonly criticalFailures: number;
  readonly warningFailures: number;
  readonly passed: boolean;
}

export function runEnforcementValidation(report: PlatformReport): EnforcementReport {
  const results: RuleResult[] = ENFORCEMENT_RULES.map((rule) => ({
    id: rule.id,
    severity: rule.severity,
    description: rule.description,
    passed: !!rule.check(report),
  }));
  const criticalFailures = results.filter((r) => r.severity === "critical" && !r.passed).length;
  const warningFailures = results.filter((r) => r.severity === "warning" && !r.passed).length;
  return {
    platform: report.platform,
    results,
    criticalFailures,
    warningFailures,
    passed: criticalFailures === 0,
  };
}
