/**
 * Phase 28 — Cross-cutting usage governance for Lumi.
 *
 * Motion + accessibility + emotional + visual cohesion + tone checks
 * that apply on top of variant + placement rules.
 */

export interface UsageRule {
  readonly id: string;
  readonly rule: string;
  readonly severity: "critical" | "warning";
}

export const MOTION_GOVERNANCE: ReadonlyArray<UsageRule> = Object.freeze([
  { id: "motion-breath-cycle-7100", rule: "Breath cycle MUST be 7100ms total (inhale 2800 + hold 400 + exhale 3600 + rest 300).", severity: "critical" },
  { id: "motion-scale-cap-1018", rule: "Scale max 1.018 — no further.", severity: "critical" },
  { id: "motion-rotation-cap-04", rule: "Rotation max ±0.4deg.", severity: "critical" },
  { id: "motion-translate-cap-4px", rule: "Translate max ±4px.", severity: "critical" },
  { id: "motion-blink-3000-7000", rule: "Blink interval randomly 3000-7000ms.", severity: "warning" },
  { id: "motion-no-bounce", rule: "No bounce, spring, or overshoot.", severity: "critical" },
  { id: "motion-no-confetti", rule: "No confetti, sparkles, or burst effects.", severity: "critical" },
  { id: "motion-respects-reduced-motion", rule: "All motion suppressed under prefers-reduced-motion.", severity: "critical" },
  { id: "motion-no-shake", rule: "No shake, vibrate, or jitter.", severity: "critical" },
  { id: "motion-no-strobe", rule: "No strobe, flash, or rapid color shifts.", severity: "critical" },
  { id: "motion-glow-opacity-band", rule: "Glow opacity band 0.08-0.18.", severity: "warning" },
  { id: "motion-easing-soft", rule: "Easing must be soft (cubic-bezier within calm range).", severity: "warning" },
  { id: "motion-no-attention-pulse", rule: "No attention-grabbing pulse animations.", severity: "critical" },
] as const);

export const ACCESSIBILITY_RULES: ReadonlyArray<UsageRule> = Object.freeze([
  { id: "a11y-aria-hidden-decorative", rule: "Decorative Lumi MUST have aria-hidden=\"true\".", severity: "critical" },
  { id: "a11y-aria-label-meaningful", rule: "Meaningful Lumi MUST have a descriptive aria-label.", severity: "critical" },
  { id: "a11y-role-img-when-meaningful", rule: "Meaningful Lumi MUST have role=\"img\".", severity: "critical" },
  { id: "a11y-keyboard-not-focusable-decorative", rule: "Decorative Lumi MUST NOT be focusable.", severity: "warning" },
  { id: "a11y-touch-target-44", rule: "Interactive Lumi MUST meet a 44x44 touch target.", severity: "critical" },
  { id: "a11y-prefers-reduced-motion", rule: "All animation MUST honor prefers-reduced-motion.", severity: "critical" },
  { id: "a11y-color-contrast-na-decorative", rule: "Decorative Lumi has no contrast contract; never gate content on its visibility.", severity: "warning" },
] as const);

export const EMOTIONAL_CONSTRAINTS: ReadonlyArray<UsageRule> = Object.freeze([
  { id: "emo-no-sad-lumi", rule: "No sad, crying, or distressed Lumi expressions.", severity: "critical" },
  { id: "emo-no-angry-lumi", rule: "No angry or frustrated Lumi.", severity: "critical" },
  { id: "emo-no-overexcited", rule: "No over-excited or hyper Lumi.", severity: "critical" },
  { id: "emo-no-celebration-noise", rule: "No celebration noise (confetti, fireworks, balloons).", severity: "critical" },
  { id: "emo-no-dependency-cues", rule: "No \"miss you\" / \"come back\" / dependency-creating expressions.", severity: "critical" },
  { id: "emo-no-romantic-cues", rule: "No romantic, possessive, or intimate expressions.", severity: "critical" },
  { id: "emo-no-clinical-coldness", rule: "Lumi must not appear clinical or cold.", severity: "warning" },
  { id: "emo-no-judgmental", rule: "No judgmental expressions (frowning, eye-roll).", severity: "critical" },
  { id: "emo-no-urgent-prompting", rule: "Lumi must not visually convey urgency.", severity: "critical" },
  { id: "emo-respects-user-pace", rule: "Lumi never pressures pace or completion.", severity: "critical" },
] as const);

export const VISUAL_COHESION_REQUIREMENTS: ReadonlyArray<UsageRule> = Object.freeze([
  { id: "cohesion-canonical-only", rule: "Only the 7 canonical variants may appear.", severity: "critical" },
  { id: "cohesion-no-legacy-imports", rule: "No legacy avatar imports (mascot, buddy-old, hero-bear, green-bear).", severity: "critical" },
  { id: "cohesion-no-inline-svg-redefinition", rule: "Lumi SVG must not be hand-redefined per page.", severity: "warning" },
  { id: "cohesion-canonical-color-tokens", rule: "Lumi colors must use canonical body/belly/sprout tokens.", severity: "critical" },
  { id: "cohesion-canonical-glow-tokens", rule: "Glow color must come from variant.glowColor.", severity: "warning" },
  { id: "cohesion-canonical-motion-profile", rule: "Motion must use the variant's declared motionProfile.", severity: "critical" },
  { id: "cohesion-no-mixed-art-styles", rule: "No mixing flat + 3D + photographic Lumi.", severity: "critical" },
  { id: "cohesion-no-third-party-overlays", rule: "No third-party badges, stickers, or props on Lumi.", severity: "critical" },
  { id: "cohesion-consistent-eye-style", rule: "Eye style must remain consistent across variants.", severity: "warning" },
  { id: "cohesion-consistent-sprout", rule: "Sprout-on-head must be present on every variant.", severity: "critical" },
] as const);

export const EMOTIONAL_TONE_CHECKLIST: ReadonlyArray<UsageRule> = Object.freeze([
  { id: "tone-gentle", rule: "Tone reads gentle.", severity: "warning" },
  { id: "tone-warm", rule: "Tone reads warm.", severity: "warning" },
  { id: "tone-calm", rule: "Tone reads calm.", severity: "warning" },
  { id: "tone-non-judgmental", rule: "Tone is non-judgmental.", severity: "critical" },
  { id: "tone-non-clinical", rule: "Tone is non-clinical.", severity: "warning" },
  { id: "tone-non-urgent", rule: "Tone is non-urgent.", severity: "critical" },
  { id: "tone-honest", rule: "Tone is honest about Lumi being software.", severity: "critical" },
  { id: "tone-non-manipulative", rule: "Tone is non-manipulative.", severity: "critical" },
  { id: "tone-respects-consent", rule: "Tone respects opt-in consent.", severity: "critical" },
  { id: "tone-supports-not-leads", rule: "Tone supports the user, doesn't lead them.", severity: "warning" },
] as const);

export interface UsageCheckInput {
  readonly id: string;
  readonly passed: boolean;
}

export interface UsageValidation {
  readonly valid: boolean;
  readonly passed: ReadonlyArray<string>;
  readonly failed: ReadonlyArray<{ readonly id: string; readonly rule: string; readonly severity: "critical" | "warning" }>;
}

const ALL_USAGE_RULES: ReadonlyArray<UsageRule> = Object.freeze([
  ...MOTION_GOVERNANCE,
  ...ACCESSIBILITY_RULES,
  ...EMOTIONAL_CONSTRAINTS,
  ...VISUAL_COHESION_REQUIREMENTS,
  ...EMOTIONAL_TONE_CHECKLIST,
] as const);

export function validateUsage(checks: ReadonlyArray<UsageCheckInput>): UsageValidation {
  const passed: string[] = [];
  const failed: { id: string; rule: string; severity: "critical" | "warning" }[] = [];
  for (const c of checks) {
    const rule = ALL_USAGE_RULES.find((r) => r.id === c.id);
    if (!rule) continue;
    if (c.passed) passed.push(c.id);
    else failed.push({ id: c.id, rule: rule.rule, severity: rule.severity });
  }
  const criticalFails = failed.filter((f) => f.severity === "critical").length;
  return { valid: criticalFails === 0, passed, failed };
}
