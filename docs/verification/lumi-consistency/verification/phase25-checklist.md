# Phase 25 — Lumi Cross-Platform Consistency — Verification Checklist

## Module location
- `client/src/lumi-consistency/` — standalone, opt-in, zero production wiring.

## File inventory (8 spec files + barrel)
- tokens/lumiConsistencyTokens.ts
- identity/sharedCompanionPrinciples.ts
- governance/crossPlatformEnforcementRules.ts
- governance/crossPlatformAdaptationBoundaries.ts
- runtime/preservedInteractionPatterns.ts
- runtime/identityVerificationSystem.ts
- runtime/useConsistencyState.ts
- verification/phase25-checklist.md
- index.ts (barrel)

## FROZEN tokens (8 groups)
- identity · visualRgb · voiceCaps · timing · toneMarkers · accessibility · emotionalStates (8) · interactionPatterns (8)
- Module-load assertion: 8 token groups; 8 emotional states; 8 interaction patterns.

## Companion principles
- 4 principles: emotional-safety, consistent-identity, transparent-boundaries, accessibility-for-all.
- Each principle has regex violation patterns + `validate(text)` returning matched pattern sources.
- `validateAllPrinciples(text)` returns per-principle pass/fail.

## Enforcement rules
- 10 rules total. Module-load assertion: exactly 6 critical / 4 warning.
- `runEnforcementValidation(report)` returns per-rule results, critical/warning failure counts, overall pass (criticalFailures === 0).

## Adaptation boundaries
- 7 boundaries: size, animation, voice, input, display, haptic, battery.
- Each carries per-platform (web/mobile) hard limits.
- Voice cap = 0.4 on every platform; autoplay = false on every platform.

## Preserved interaction patterns
- 8 patterns with timing budgets and finite state machines.
- `checkPatternTiming(key, durationMs)` returns whether duration is within spec.

## Identity verification
- 7 checks; module-load assertion that exactly 7 ran.
- `complianceScore` is `round((passed / 7) * 100)`, integer 0..100.
- `passed === true` only when all 7 checks pass.

## Hook
- `useConsistencyState()` exposes validateEnforcement, checkTiming, verifyIdentity, checkAdaptation, plus the registries.
- SSR-safe (no window access in body).

## Production posture
- ZERO files outside `client/src/lumi-consistency/` modified.
- ZERO new npm dependencies.
- ZERO production wiring.
