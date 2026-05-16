/**
 * Phase 28 — Placement governance.
 *
 * Forbidden placements + required placements + size governance for
 * Lumi anywhere in the product.
 */

export type PlacementRuleType = "forbidden" | "required" | "guideline";
export type PlacementSeverity = "critical" | "warning" | "info";

export interface PlacementRule {
  readonly id: string;
  readonly rule: string;
  readonly type: PlacementRuleType;
  readonly severity: PlacementSeverity;
  readonly reason: string;
}

export const FORBIDDEN_PLACEMENTS: ReadonlyArray<PlacementRule> = Object.freeze([
  { id: "no-heading-spam", rule: "Lumi never sits inside or directly beside a heading.", type: "forbidden", severity: "critical", reason: "Reading order + screen-reader noise." },
  { id: "no-repeat-per-section", rule: "At most one Lumi per section.", type: "forbidden", severity: "critical", reason: "Repetition turns presence into decoration." },
  { id: "no-decoration-spam", rule: "Lumi must not be used as bullet markers, icon spacers, or visual filler.", type: "forbidden", severity: "critical", reason: "Decoration spam erodes trust." },
  { id: "no-text-overlap", rule: "Lumi must not overlap user-readable text.", type: "forbidden", severity: "critical", reason: "Accessibility + legibility." },
  { id: "no-cta-crowd", rule: "Lumi must not sit within 2rem of a primary CTA.", type: "forbidden", severity: "warning", reason: "Visual competition with action." },
  { id: "no-dense-copy", rule: "Lumi must not appear in dense long-form copy blocks.", type: "forbidden", severity: "warning", reason: "Reading flow disruption." },
  { id: "no-oversized-hero", rule: "Lumi hero size must not exceed variant.sizeLimits.hero.", type: "forbidden", severity: "critical", reason: "Visual dominance ceiling." },
] as const);

export const REQUIRED_PLACEMENTS: ReadonlyArray<PlacementRule> = Object.freeze([
  { id: "breathing-space", rule: "At least 1.5rem padding around any Lumi instance.", type: "required", severity: "warning", reason: "Visual + emotional breathing room." },
  { id: "one-anchor", rule: "Each major surface must have exactly one anchor Lumi (or none).", type: "required", severity: "warning", reason: "Single-point-of-presence cognitive load." },
  { id: "secondary-focus", rule: "Lumi never out-weights the user's primary task focus.", type: "required", severity: "critical", reason: "Lumi supports the user, never centers itself." },
  { id: "preserve-whitespace", rule: "Whitespace around Lumi must not be reduced for layout density.", type: "required", severity: "warning", reason: "Calm presence requires space." },
  { id: "emotionally-intentional", rule: "Every Lumi placement must trace back to an emotional role.", type: "required", severity: "warning", reason: "No decorative Lumi." },
] as const);

export const ALL_PLACEMENT_RULES: ReadonlyArray<PlacementRule> = Object.freeze([
  ...FORBIDDEN_PLACEMENTS,
  ...REQUIRED_PLACEMENTS,
] as const);

export const SIZE_GOVERNANCE = Object.freeze({
  hero: 320,
  card: 150,
  inline: 95,
  background: 240,
  mobileReduction: 0.15,
  maxVisualDominance: 35,
} as const);

export interface PlacementOptions {
  readonly nearHeading?: boolean;
  readonly siblingLumiCount?: number;
  readonly overlapsText?: boolean;
  readonly nearPrimaryCta?: boolean;
  readonly inDenseCopy?: boolean;
  readonly sizePx?: number;
  readonly position?: "hero" | "card" | "inline" | "background";
  readonly hasBreathingSpace?: boolean;
  readonly anchorCountInSection?: number;
  readonly outweightsPrimaryTask?: boolean;
  readonly hasEmotionalRole?: boolean;
}

export interface PlacementValidation {
  readonly valid: boolean;
  readonly violations: ReadonlyArray<{ readonly rule: PlacementRule; readonly note?: string }>;
}

export function validatePlacement(_context: string, options: PlacementOptions): PlacementValidation {
  const violations: { rule: PlacementRule; note?: string }[] = [];
  const push = (id: string, note?: string) => {
    const rule = ALL_PLACEMENT_RULES.find((r) => r.id === id);
    if (rule) violations.push({ rule, note });
  };

  if (options.nearHeading) push("no-heading-spam");
  if ((options.siblingLumiCount ?? 0) > 1) push("no-repeat-per-section", `${options.siblingLumiCount} Lumi found`);
  if (options.overlapsText) push("no-text-overlap");
  if (options.nearPrimaryCta) push("no-cta-crowd");
  if (options.inDenseCopy) push("no-dense-copy");
  if (options.sizePx != null && options.position) {
    const cap = options.position === "hero" ? SIZE_GOVERNANCE.hero : options.position === "card" ? SIZE_GOVERNANCE.card : options.position === "inline" ? SIZE_GOVERNANCE.inline : SIZE_GOVERNANCE.background;
    if (options.sizePx > cap) push("no-oversized-hero", `${options.sizePx}px > ${cap}px`);
  }
  if (options.hasBreathingSpace === false) push("breathing-space");
  if ((options.anchorCountInSection ?? 1) !== 1 && (options.anchorCountInSection ?? 0) > 0) push("one-anchor", `${options.anchorCountInSection} anchors in section`);
  if (options.outweightsPrimaryTask) push("secondary-focus");
  if (options.hasEmotionalRole === false) push("emotionally-intentional");

  return { valid: violations.length === 0, violations };
}

export function getMaxSizeForContext(context: "hero" | "card" | "inline" | "background", isMobile: boolean): number {
  const base = context === "hero" ? SIZE_GOVERNANCE.hero : context === "card" ? SIZE_GOVERNANCE.card : context === "inline" ? SIZE_GOVERNANCE.inline : SIZE_GOVERNANCE.background;
  return isMobile ? Math.round(base * (1 - SIZE_GOVERNANCE.mobileReduction)) : base;
}
