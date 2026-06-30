/**
 * Phase 29 — Page Placement Map (the core of the registry).
 *
 * Maps every product page to protected Lumi variants; showcase surfaces use the 7 distinct display companions
 * (or `null` for forbidden surfaces like crisis support). This is the
 * authoritative table that placement audits resolve against.
 */

import type { LumiVariantId } from "./officialLumiRegistry";
import { ALL_VARIANT_IDS } from "./officialLumiRegistry";

export type AssignmentType = "required" | "optional" | "forbidden";
export type PagePosition = "hero" | "inline" | "background" | "card" | "none";

export interface PagePlacement {
  readonly pageId: string;
  readonly pageName: string;
  readonly variant: LumiVariantId | null;
  readonly assignment: AssignmentType;
  readonly position: PagePosition;
  readonly maxWidthPx: number;
  readonly tone?: string;
  readonly reasoning?: string;
  readonly specialRules?: ReadonlyArray<string>;
}

export const PAGE_PLACEMENT_MAP: ReadonlyArray<PagePlacement> = Object.freeze([
  {
    pageId: "home-hero",
    pageName: "Home Hero",
    variant: "LUMI_SOFT_PRESENCE",
    assignment: "required",
    position: "hero",
    maxWidthPx: 320,
    tone: "Ambient calm, silent companionship",
    reasoning: "Folded-hands Lumi establishes gentle homepage presence",
    specialRules: Object.freeze(["NO heading text beside Lumi", "NO CTA crowding within 2rem", "Background: warm cream"]),
  },
  {
    pageId: "landing-canva",
    pageName: "Landing (Canva) — route /",
    variant: "LUMI_SOFT_PRESENCE",
    assignment: "optional",
    position: "hero",
    maxWidthPx: 320,
    tone: "Ambient calm, opt-in floating presence",
    reasoning: "CanvaLanding.jsx mounted at /; opt-in entry unblocks OfficialLumi migration from legacy LumiMascot without forcing render. Position 'hero' chosen as closest legal value to user-requested 'floating' (PagePosition type does not include 'floating').",
    specialRules: Object.freeze(["NO heading text beside Lumi", "NO CTA crowding within 2rem", "Default: opt-in only — CanvaLanding renders OfficialLumi when ready", "Crisis routing (/crisis + 988 + 741741) must remain in footer regardless"]),
  },
  {
    pageId: "home-first-gentle-step",
    pageName: "Home First Gentle Step",
    variant: "LUMI_PATH",
    assignment: "required",
    position: "inline",
    maxWidthPx: 140,
    tone: "Gentle invitation, no pressure",
    reasoning: "Walking Lumi = beginning the journey",
    specialRules: Object.freeze(["Max 1 Path Lumi", "NO countdown timers"]),
  },
  {
    pageId: "calm-check-in",
    pageName: "Calm Check-In",
    variant: "LUMI_MEDITATION",
    assignment: "required",
    position: "hero",
    maxWidthPx: 280,
    tone: "Grounded, calm, ritual-ready",
  },
  {
    pageId: "breath-space",
    pageName: "Breath Space",
    variant: "LUMI_MEDITATION",
    assignment: "required",
    position: "hero",
    maxWidthPx: 300,
    tone: "Stillness, breath synchronization",
    specialRules: Object.freeze(["Breath cycle MUST be 7100ms", "Scale 1.0-1.018 only"]),
  },
  {
    pageId: "mood-space",
    pageName: "Mood Space",
    variant: "LUMI_EMOTION_ORB",
    assignment: "required",
    position: "hero",
    maxWidthPx: 280,
  },
  {
    pageId: "journal-sanctuary",
    pageName: "Journal Sanctuary",
    variant: "LUMI_COMPANION",
    assignment: "required",
    position: "hero",
    maxWidthPx: 260,
  },
  {
    pageId: "growth-journey",
    pageName: "Growth Journey",
    variant: "LUMI_PATH",
    assignment: "required",
    position: "inline",
    maxWidthPx: 160,
    specialRules: Object.freeze(["NO streak counters", "NO percentage bars", "Celebrate with subtle heart glow only"]),
  },
  {
    pageId: "sleep-space",
    pageName: "Sleep Space",
    variant: "LUMI_CALM_FLOAT",
    assignment: "required",
    position: "hero",
    maxWidthPx: 280,
    specialRules: Object.freeze(["Float speed 50%", "Glow: lavender tint", "NO blue light nearby"]),
  },
  {
    pageId: "privacy-safety",
    pageName: "Privacy / Safety",
    variant: "LUMI_HEART",
    assignment: "required",
    position: "hero",
    maxWidthPx: 260,
  },
  {
    pageId: "research-evidence",
    pageName: "Research / Evidence",
    variant: "LUMI_SOFT_PRESENCE",
    assignment: "optional",
    position: "background",
    maxWidthPx: 120,
    specialRules: Object.freeze(["Opacity 0.6", "Omit if dense content"]),
  },
  {
    pageId: "crisis-support",
    pageName: "Crisis Support",
    variant: null,
    assignment: "forbidden",
    position: "none",
    maxWidthPx: 0,
    tone: "Calm, clear, professional",
    reasoning: "ZERO decorative elements on crisis pages",
    specialRules: Object.freeze(["NO Lumi. PERIOD.", "Crisis resources above fold", "NO animations"]),
  },
  {
    pageId: "pricing-pro",
    pageName: "Pricing / Pro",
    variant: "LUMI_HEART",
    assignment: "optional",
    position: "inline",
    maxWidthPx: 120,
    specialRules: Object.freeze(["Default: NO Lumi", "REMOVE if urgency language present", "REMOVE if countdown timers", "Max 120px if present"]),
  },
  {
    pageId: "email-stay-connected",
    pageName: "Email / Stay Connected",
    variant: "LUMI_SOFT_PRESENCE",
    assignment: "optional",
    position: "inline",
    maxWidthPx: 100,
    specialRules: Object.freeze(["Default: NO Lumi", "If present: aria-hidden", "NO Lumi beside input field"]),
  },
  {
    pageId: "empty-state",
    pageName: "Empty States",
    variant: "LUMI_CALM_FLOAT",
    assignment: "required",
    position: "hero",
    maxWidthPx: 220,
    specialRules: Object.freeze(["NO apologetic language", "Use warm invitation language"]),
  },
  {
    pageId: "success-state",
    pageName: "Success States",
    variant: "LUMI_HEART",
    assignment: "required",
    position: "inline",
    maxWidthPx: 140,
    specialRules: Object.freeze(["NO confetti", "NO bouncing", "NO \"Congratulations!!!\"", "Heart glow opacity 0.08-0.15"]),
  },
  {
    pageId: "loading-state",
    pageName: "Loading States",
    variant: "LUMI_CALM_FLOAT",
    assignment: "optional",
    position: "inline",
    maxWidthPx: 90,
  },
  {
    pageId: "error-state",
    pageName: "Error States",
    variant: "LUMI_HEART",
    assignment: "optional",
    position: "inline",
    maxWidthPx: 100,
    specialRules: Object.freeze(["NO sad/crying Lumi", "Clear recovery action"]),
  },
  // v5.8.73 — enroll the 6 pages introduced by the v5.8.72 OfficialLumi
  // rollout into the strict policy gate. Brief proposed `route` / `notes` /
  // `secondaryVariant` fields; the actual `PagePlacement` interface has none
  // of those, so each entry maps `required: false` → `assignment: "optional"`,
  // drops route (not in schema), and folds the brief's notes into `reasoning`.
  // CanvaLanding's footer LUMI_FLOAT_IDLE is intentionally NOT enrolled as a
  // secondary variant — `LUMI_FLOAT_IDLE` lives in `RUNTIME_ONLY_VARIANTS`
  // (L314-316), the canonical exemption path for runtime float anchors. The
  // footer call site keeps `pageId` omitted (silent gate).
  {
    pageId: "breathing-exercises",
    pageName: "Breathing Exercises — route /breathe",
    variant: "LUMI_MEDITATION",
    assignment: "optional",
    position: "card",
    maxWidthPx: 120,
    reasoning: "v5.8.72 — canonical Lumi rollout. Decorative meditation Lumi above H1.",
  },
  {
    pageId: "journal",
    pageName: "Journal — route /journal",
    variant: "LUMI_SOFT_PRESENCE",
    assignment: "optional",
    position: "card",
    maxWidthPx: 100,
    reasoning: "v5.8.72 — canonical Lumi rollout. Quiet presence in journal header row.",
  },
  {
    pageId: "habits-hub",
    pageName: "Habits Hub — route /habits",
    variant: "LUMI_PATH",
    assignment: "optional",
    position: "card",
    maxWidthPx: 100,
    reasoning: "v5.8.72 — canonical Lumi rollout. Walking-path Lumi above resource grid.",
  },
  {
    pageId: "saved-library",
    pageName: "Saved Library — route /library",
    variant: "LUMI_EMOTION_ORB",
    assignment: "optional",
    position: "card",
    maxWidthPx: 100,
    reasoning: "v5.8.72 — canonical Lumi rollout. Emotion-orb Lumi above saved-list.",
  },
  {
    pageId: "settings",
    pageName: "Settings — route /settings",
    variant: "LUMI_COMPANION",
    assignment: "optional",
    position: "inline",
    maxWidthPx: 60,
    reasoning: "v5.8.72 — canonical Lumi rollout. Small companion accent in header.",
  },
  {
    pageId: "ai-chat",
    pageName: "AI Chat — route /chat",
    variant: "LUMI_HEART",
    assignment: "optional",
    position: "inline",
    maxWidthPx: 48,
    reasoning: "v5.8.72 — canonical Lumi rollout. Small heart-glow header above chat panel.",
  },
] as const);

if (PAGE_PLACEMENT_MAP.length !== 24) {
  throw new Error(`[lumi-registry] PAGE_PLACEMENT_MAP floor violated: expected 24 pages, got ${PAGE_PLACEMENT_MAP.length}.`);
}

export function getPagePlacement(pageId: string): PagePlacement | undefined {
  return PAGE_PLACEMENT_MAP.find((p) => p.pageId === pageId);
}

export function getVariantForPage(pageId: string): LumiVariantId | null {
  return getPagePlacement(pageId)?.variant ?? null;
}

export function isPlacementValid(pageId: string, variantId: LumiVariantId | null): boolean {
  const placement = getPagePlacement(pageId);
  if (!placement) return false;
  if (placement.assignment === "forbidden") return variantId === null;
  if (placement.assignment === "optional") {
    // Optional placements default to NO Lumi — null is always valid; if a
    // variant is supplied it must match the canonical assignment.
    if (variantId === null) return true;
    return placement.variant === variantId;
  }
  // assignment === "required": variant must match exactly.
  return placement.variant === variantId;
}

/**
 * Runtime policy gate for Lumi rendering on a known page surface.
 *
 * `canRenderLumi({pageId, variant})` is the single trust boundary that
 * crisis-support and other forbidden surfaces resolve through. Both
 * `OfficialLumi` and `LumiSceneRenderer` consult it when a `pageId` is
 * provided, refusing to render Lumi on `assignment: "forbidden"` pages
 * regardless of host intent.
 */
export interface RenderPolicyDecision {
  readonly allowed: boolean;
  readonly reason?: string;
}

export function canRenderLumi(input: { readonly pageId?: string; readonly variant: LumiVariantId | null }): RenderPolicyDecision {
  const { pageId, variant } = input;
  // No pageId opt-in — gate is silent (host did not enroll into policy
  // enforcement). Hosts that want strict enforcement must pass pageId.
  if (!pageId) return { allowed: true };
  const placement = getPagePlacement(pageId);
  // Fail-closed: if a host opted into the policy gate by passing pageId,
  // an unknown pageId means we cannot prove safety — refuse rather than
  // silently render (architect 2nd-pass finding). Crisis surfaces with a
  // typo in pageId no longer slip past.
  if (!placement) {
    return { allowed: false, reason: `unknown pageId "${pageId}" — policy gate fails closed; register the page in PAGE_PLACEMENT_MAP` };
  }
  if (placement.assignment === "forbidden") {
    return { allowed: false, reason: `page "${pageId}" forbids Lumi (${placement.reasoning ?? "no Lumi policy"})` };
  }
  if (placement.assignment === "required" && variant !== placement.variant) {
    return { allowed: false, reason: `page "${pageId}" requires variant "${placement.variant}", got "${variant}"` };
  }
  if (placement.assignment === "optional" && variant !== null && variant !== placement.variant) {
    return { allowed: false, reason: `page "${pageId}" optional variant must be "${placement.variant}", got "${variant}"` };
  }
  return { allowed: true };
}

export function isLumiForbidden(pageId: string): boolean {
  return getPagePlacement(pageId)?.assignment === "forbidden";
}

export function getPagesForVariant(variantId: LumiVariantId): ReadonlyArray<string> {
  return PAGE_PLACEMENT_MAP.filter((p) => p.variant === variantId).map((p) => p.pageId);
}

export function getAllPageIds(): ReadonlyArray<string> {
  return PAGE_PLACEMENT_MAP.map((p) => p.pageId);
}

export function getRequiredPlacements(): ReadonlyArray<PagePlacement> {
  return PAGE_PLACEMENT_MAP.filter((p) => p.assignment === "required");
}

export function getForbiddenPlacements(): ReadonlyArray<PagePlacement> {
  return PAGE_PLACEMENT_MAP.filter((p) => p.assignment === "forbidden");
}

const FORBIDDEN_IMPORT_PATTERNS: ReadonlyArray<string> = Object.freeze([
  "mascot",
  "buddy-old",
  "avatar-legacy",
  "hero-bear",
  "green-bear",
] as const);

export interface ImportPathValidation {
  readonly valid: boolean;
  readonly issue?: string;
}

export function verifyImportPath(importPath: string): ImportPathValidation {
  const lower = (importPath || "").toLowerCase();
  if (/\.(png|svg|jpe?g|gif|webp)$/.test(lower)) {
    return { valid: false, issue: `direct image import "${importPath}" — Lumi must come through the registry component` };
  }
  for (const pattern of FORBIDDEN_IMPORT_PATTERNS) {
    if (lower.includes(pattern)) {
      return { valid: false, issue: `forbidden legacy avatar reference "${pattern}" in import path "${importPath}"` };
    }
  }
  return { valid: true };
}

/**
 * Phase 30 — variants that intentionally have no page-placement entry
 * because they're driven by the MMHB runtime avatar provider (header
 * float, ambient calm anchor, etc.) rather than placed on a specific
 * page surface. The audit doesn't flag missing coverage for these.
 */
export const RUNTIME_ONLY_VARIANTS: ReadonlySet<LumiVariantId> = new Set<LumiVariantId>([
  "LUMI_FLOAT_IDLE",
]);

export interface PageMapAuditResult {
  readonly totalPages: number;
  readonly requiredCount: number;
  readonly optionalCount: number;
  readonly forbiddenCount: number;
  readonly variantCoverage: Readonly<Record<LumiVariantId, number>>;
  readonly issues: ReadonlyArray<string>;
}

export function runPageMapAudit(): PageMapAuditResult {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const p of PAGE_PLACEMENT_MAP) {
    if (seen.has(p.pageId)) issues.push(`duplicate pageId "${p.pageId}"`);
    seen.add(p.pageId);
  }
  const variantCoverage = ALL_VARIANT_IDS.reduce<Record<LumiVariantId, number>>((acc, id) => {
    acc[id] = PAGE_PLACEMENT_MAP.filter((p) => p.variant === id).length;
    return acc;
  }, {} as Record<LumiVariantId, number>);
  for (const id of ALL_VARIANT_IDS) {
    // Phase 30 — `RUNTIME_ONLY_VARIANTS` are intentionally absent from the
    // page-placement map (they're driven by the runtime avatar provider,
    // not page-level placement). Don't flag them as audit issues.
    if (variantCoverage[id] === 0 && !RUNTIME_ONLY_VARIANTS.has(id)) {
      issues.push(`variant "${id}" is not used in any page placement`);
    }
  }
  const crisis = getPagePlacement("crisis-support");
  if (!crisis) issues.push("crisis-support page is missing from PAGE_PLACEMENT_MAP");
  else if (crisis.variant !== null) issues.push("crisis-support must have variant: null");
  else if (crisis.assignment !== "forbidden") issues.push("crisis-support must have assignment: forbidden");
  const requiredCount = PAGE_PLACEMENT_MAP.filter((p) => p.assignment === "required").length;
  const optionalCount = PAGE_PLACEMENT_MAP.filter((p) => p.assignment === "optional").length;
  const forbiddenCount = PAGE_PLACEMENT_MAP.filter((p) => p.assignment === "forbidden").length;
  return Object.freeze({
    totalPages: PAGE_PLACEMENT_MAP.length,
    requiredCount,
    optionalCount,
    forbiddenCount,
    variantCoverage: Object.freeze(variantCoverage),
    issues: Object.freeze(issues),
  });
}
