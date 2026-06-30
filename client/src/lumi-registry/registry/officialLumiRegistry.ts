/**
 * Phase 28 — Official Lumi Variant Registry (canonical, frozen)
 *
 * The 8 protected Lumi registry variants. Product showcase placement resolves
 * to 7 distinct display companions; LUMI_FLOAT_IDLE is reserved for runtime idle use — never strings, never ad-hoc avatars.
 *
 * Trust boundary: this file is the source of truth. All scene → variant
 * mappings, emotional-role assignments, and placement audits MUST go
 * through `OFFICIAL_LUMI_REGISTRY` and the helpers below — host code
 * should never construct a variant object inline.
 */

export type LumiVariantId =
  | "LUMI_CALM_FLOAT"
  | "LUMI_HEART"
  | "LUMI_MEDITATION"
  | "LUMI_COMPANION"
  | "LUMI_PATH"
  | "LUMI_EMOTION_ORB"
  | "LUMI_SOFT_PRESENCE"
  | "LUMI_FLOAT_IDLE";

/**
 * MMHB avatar runtime state ids that map onto each variant. These match
 * the existing `MMHBAvatarRuntimeProvider` state machine (calmIdle,
 * peacefulJoy, gentleConcern, welcoming, comforting, grounding,
 * reflective, growthPath, sleepy).
 */
export type LumiAssetRole =
  | "calmIdle"
  | "welcoming"
  | "comforting"
  | "grounding"
  | "reflective"
  | "growthPath"
  | "sleepy";

export interface OfficialLumiVariant {
  readonly id: LumiVariantId;
  readonly name: string;
  /** Phase 30 short label (used by `<OfficialLumi renderMode="asset">`). */
  readonly label: string;
  readonly description: string;
  readonly emotionalRole: string;
  /** Phase 30 — runtime state id this variant fulfils. */
  readonly assetRole: LumiAssetRole;
  /** Phase 30 — canonical PNG path under `/lumi/official/`. */
  readonly src: string;
  /** Phase 30 — accessible label for asset render mode. */
  readonly alt: string;
  /** Phase 30 — non-negotiable protected-identity flag (always true). */
  readonly protectedIdentity: true;
  readonly useWhen: ReadonlyArray<string>;
  readonly neverUseWhen: ReadonlyArray<string>;
  readonly motionProfile: string;
  readonly sizeLimits: { readonly hero: number; readonly card: number; readonly inline: number };
  readonly maxVisualDominance: number;
  readonly glowColor: string;
  readonly priority: number;
}

export const OFFICIAL_LUMI_REGISTRY: Readonly<Record<LumiVariantId, OfficialLumiVariant>> = Object.freeze({
  LUMI_CALM_FLOAT: Object.freeze({
    id: "LUMI_CALM_FLOAT",
    name: "Calm Float Lumi",
    label: "Calm floating Lumi",
    description: "Floating egg-shaped Lumi",
    emotionalRole: "Ambient calm, grounding, idle presence",
    assetRole: "sleepy",
    src: "/lumi/official/lumi-calm-float.png",
    alt: "Lumi floating peacefully",
    protectedIdentity: true,
    useWhen: Object.freeze(["idle empty states", "ambient background", "loading"]),
    neverUseWhen: Object.freeze(["high-energy", "celebration", "urgent"]),
    motionProfile: "float+breathe+sparkle",
    sizeLimits: Object.freeze({ hero: 280, card: 140, inline: 90 }),
    maxVisualDominance: 30,
    glowColor: "rgba(168,184,154,0.15)",
    priority: 1,
  }),
  LUMI_HEART: Object.freeze({
    id: "LUMI_HEART",
    name: "Heart Lumi",
    label: "Heart Lumi",
    description: "Lumi with gentle heart glow",
    emotionalRole: "Reassurance, compassion, warmth",
    assetRole: "comforting",
    src: "/lumi/official/lumi-heart.png",
    alt: "Lumi holding a gentle glowing heart",
    protectedIdentity: true,
    useWhen: Object.freeze(["privacy", "welcome", "success", "encouragement"]),
    neverUseWhen: Object.freeze(["error", "clinical", "urgent", "celebration"]),
    motionProfile: "heart-glow-pulse+breathe",
    sizeLimits: Object.freeze({ hero: 260, card: 130, inline: 85 }),
    maxVisualDominance: 25,
    glowColor: "rgba(246,201,184,0.18)",
    priority: 2,
  }),
  LUMI_MEDITATION: Object.freeze({
    id: "LUMI_MEDITATION",
    name: "Meditation Lumi",
    label: "Meditation Lumi",
    description: "Seated orbit Lumi",
    emotionalRole: "Breathing, mindfulness, rituals",
    assetRole: "grounding",
    src: "/lumi/official/lumi-meditation.png",
    alt: "Lumi calmly guiding a grounding moment",
    protectedIdentity: true,
    useWhen: Object.freeze(["breathing exercises", "rituals", "grounding"]),
    neverUseWhen: Object.freeze(["high-energy", "urgent", "onboarding"]),
    motionProfile: "aura-ring+slow-breathe+stillness",
    sizeLimits: Object.freeze({ hero: 300, card: 150, inline: 95 }),
    maxVisualDominance: 35,
    glowColor: "rgba(168,184,154,0.12)",
    priority: 3,
  }),
  LUMI_COMPANION: Object.freeze({
    id: "LUMI_COMPANION",
    name: "Companion Lumi",
    label: "Companion Lumi",
    description: "Seated halo Lumi",
    emotionalRole: "Listening, reflection, companionship",
    assetRole: "welcoming",
    src: "/lumi/official/lumi-companion.png",
    alt: "Lumi sitting calmly as a gentle companion",
    protectedIdentity: true,
    useWhen: Object.freeze(["journal", "check-in", "emotional support"]),
    neverUseWhen: Object.freeze(["playful", "gamification", "urgent"]),
    motionProfile: "halo-glow+minimal-breathe+stillness",
    sizeLimits: Object.freeze({ hero: 280, card: 140, inline: 90 }),
    maxVisualDominance: 30,
    glowColor: "rgba(217,204,244,0.14)",
    priority: 4,
  }),
  LUMI_PATH: Object.freeze({
    id: "LUMI_PATH",
    name: "Path Lumi",
    label: "Path Lumi",
    description: "Walking-path Lumi",
    emotionalRole: "Onboarding, journey, forward movement",
    assetRole: "growthPath",
    src: "/lumi/official/lumi-path.png",
    alt: "Lumi walking gently along a sunlit path, taking the next step",
    protectedIdentity: true,
    useWhen: Object.freeze(["onboarding", "progress", "next steps"]),
    neverUseWhen: Object.freeze(["static content", "error", "crisis"]),
    motionProfile: "walking+breathe+path-sparkle",
    sizeLimits: Object.freeze({ hero: 260, card: 130, inline: 85 }),
    maxVisualDominance: 28,
    glowColor: "rgba(243,217,138,0.12)",
    priority: 5,
  }),
  LUMI_EMOTION_ORB: Object.freeze({
    id: "LUMI_EMOTION_ORB",
    name: "Emotion Orb Lumi",
    label: "Emotion orb Lumi",
    description: "Lumi holding emotion orb",
    emotionalRole: "Emotional awareness, literacy",
    assetRole: "reflective",
    src: "/lumi/official/lumi-emotion-orb.png",
    alt: "Lumi holding a soft emotional reflection orb",
    protectedIdentity: true,
    useWhen: Object.freeze(["emotional education", "mood check-ins"]),
    neverUseWhen: Object.freeze(["clinical", "crisis"]),
    motionProfile: "slow-orb-glow+hold-pose",
    sizeLimits: Object.freeze({ hero: 280, card: 140, inline: 90 }),
    maxVisualDominance: 30,
    glowColor: "rgba(185,221,242,0.16)",
    priority: 6,
  }),
  LUMI_SOFT_PRESENCE: Object.freeze({
    id: "LUMI_SOFT_PRESENCE",
    name: "Soft Presence Lumi",
    label: "Soft presence Lumi",
    description: "Folded-hands Lumi",
    emotionalRole: "Ambient support, silent companionship",
    assetRole: "welcoming",
    src: "/lumi/official/lumi-soft-presence.png",
    alt: "Lumi softly present and welcoming",
    protectedIdentity: true,
    useWhen: Object.freeze(["homepage hero", "empty states", "quiet waiting"]),
    neverUseWhen: Object.freeze(["active conversation", "ritual guidance"]),
    motionProfile: "ultra-minimal-breathe+soft-glow",
    sizeLimits: Object.freeze({ hero: 320, card: 140, inline: 90 }),
    maxVisualDominance: 35,
    glowColor: "rgba(168,184,154,0.12)",
    priority: 7,
  }),
  LUMI_FLOAT_IDLE: Object.freeze({
    id: "LUMI_FLOAT_IDLE",
    name: "Float Idle Lumi",
    label: "Floating calm Lumi",
    description: "Floating idle Lumi with closed eyes — the runtime calmIdle anchor",
    emotionalRole: "Default ambient idle presence",
    assetRole: "calmIdle",
    src: "/lumi/official/lumi-float-idle.png",
    alt: "Lumi floating calmly with closed eyes",
    protectedIdentity: true,
    useWhen: Object.freeze(["default idle", "calm anchor", "header float"]),
    neverUseWhen: Object.freeze(["high-energy", "celebration", "urgent", "crisis"]),
    motionProfile: "soft-breathe-7100ms",
    sizeLimits: Object.freeze({ hero: 280, card: 140, inline: 90 }),
    maxVisualDominance: 30,
    glowColor: "rgba(168,184,154,0.12)",
    priority: 8,
  }),
} as const);

export const ALL_VARIANT_IDS: ReadonlyArray<LumiVariantId> = Object.freeze([
  "LUMI_CALM_FLOAT",
  "LUMI_HEART",
  "LUMI_MEDITATION",
  "LUMI_COMPANION",
  "LUMI_PATH",
  "LUMI_EMOTION_ORB",
  "LUMI_SOFT_PRESENCE",
  "LUMI_FLOAT_IDLE",
] as const);

if (ALL_VARIANT_IDS.length !== 8) {
  throw new Error(`[lumi-registry] ALL_VARIANT_IDS floor violated: expected 8, got ${ALL_VARIANT_IDS.length}.`);
}

/** Phase 30 — assert every variant carries `protectedIdentity: true`. */
for (const id of ALL_VARIANT_IDS) {
  const v = OFFICIAL_LUMI_REGISTRY[id];
  if (v.protectedIdentity !== true) {
    throw new Error(`[lumi-registry] protectedIdentity floor violated for "${id}".`);
  }
  if (!v.src.startsWith("/lumi/official/")) {
    throw new Error(`[lumi-registry] non-canonical asset path for "${id}": ${v.src}`);
  }
}

/** Phase 30 helper — return all variants whose `assetRole` matches the given runtime state. */
export function getVariantsByRole(role: LumiAssetRole): ReadonlyArray<LumiVariantId> {
  return ALL_VARIANT_IDS.filter((id) => OFFICIAL_LUMI_REGISTRY[id].assetRole === role);
}

/** Phase 30 helper — return true iff the given import path is a canonical asset src. */
export function isCanonicalAssetPath(src: string): boolean {
  if (!src) return false;
  for (const id of ALL_VARIANT_IDS) {
    if (OFFICIAL_LUMI_REGISTRY[id].src === src) return true;
  }
  return false;
}

/** Phase 30 helper — return the asset record for a given variant id. */
export function getOfficialAsset(id: LumiVariantId): { readonly src: string; readonly alt: string; readonly label: string; readonly protectedIdentity: true } {
  const v = getVariant(id);
  return Object.freeze({ src: v.src, alt: v.alt, label: v.label, protectedIdentity: true as const });
}

export function getVariant(id: LumiVariantId): OfficialLumiVariant {
  const v = OFFICIAL_LUMI_REGISTRY[id];
  if (!v) {
    throw new Error(`[lumi-registry] Unknown variant id "${id}". Valid: ${ALL_VARIANT_IDS.join(", ")}.`);
  }
  return v;
}

export function isCanonicalVariant(id: string): id is LumiVariantId {
  return (ALL_VARIANT_IDS as ReadonlyArray<string>).includes(id);
}

export interface PlacementValidation {
  readonly valid: boolean;
  readonly variant: LumiVariantId;
  readonly context: string;
  readonly issues: ReadonlyArray<string>;
}

export function validateVariantPlacement(variantId: LumiVariantId, context: string): PlacementValidation {
  const issues: string[] = [];
  if (!isCanonicalVariant(variantId)) {
    issues.push(`variant "${variantId}" is not canonical`);
    return { valid: false, variant: variantId, context, issues };
  }
  const v = getVariant(variantId);
  const ctx = (context || "").toLowerCase();
  for (const forbidden of v.neverUseWhen) {
    if (ctx.includes(forbidden.toLowerCase())) {
      issues.push(`variant "${v.id}" must not be used in "${forbidden}" contexts (matched against "${context}")`);
    }
  }
  return { valid: issues.length === 0, variant: variantId, context, issues };
}

export function findVariantForContext(context: string): LumiVariantId | null {
  const ctx = (context || "").toLowerCase();
  if (!ctx) return null;
  let best: { id: LumiVariantId; score: number } | null = null;
  for (const id of ALL_VARIANT_IDS) {
    const v = OFFICIAL_LUMI_REGISTRY[id];
    let score = 0;
    for (const cue of v.useWhen) if (ctx.includes(cue.toLowerCase())) score += 2;
    for (const cue of v.neverUseWhen) if (ctx.includes(cue.toLowerCase())) score -= 5;
    if (score > 0 && (best === null || score > best.score)) best = { id, score };
  }
  return best?.id ?? null;
}
