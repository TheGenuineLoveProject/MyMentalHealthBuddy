/**
 * Phase 28 — Emotional role → variant mapping.
 *
 * Resolves a free-form context string to the canonical Lumi variant
 * whose emotional role best matches. Used when a scene isn't explicitly
 * registered in `lumiSceneAssignments` but a host needs a sensible
 * default.
 */

import type { LumiVariantId } from "./officialLumiRegistry";

export interface EmotionalRole {
  readonly context: string;
  readonly primary: LumiVariantId;
  readonly secondary?: LumiVariantId;
  readonly reasoning: string;
  /** 1 (lowest) – 10 (highest). */
  readonly intensity: number;
}

export const EMOTIONAL_ROLES: ReadonlyArray<EmotionalRole> = Object.freeze([
  { context: "idle", primary: "LUMI_CALM_FLOAT", reasoning: "Ambient calm anchor", intensity: 2 },
  { context: "grounding", primary: "LUMI_MEDITATION", secondary: "LUMI_CALM_FLOAT", reasoning: "Stillness for somatic grounding", intensity: 3 },
  { context: "waiting", primary: "LUMI_SOFT_PRESENCE", reasoning: "Quiet companionship", intensity: 2 },
  { context: "quiet", primary: "LUMI_SOFT_PRESENCE", reasoning: "Silent presence without prompting", intensity: 1 },
  { context: "welcome", primary: "LUMI_HEART", secondary: "LUMI_SOFT_PRESENCE", reasoning: "Warm reassurance on arrival", intensity: 4 },
  { context: "comfort", primary: "LUMI_HEART", reasoning: "Compassionate warmth in hard moments", intensity: 5 },
  { context: "encouragement", primary: "LUMI_HEART", reasoning: "Gentle reassurance, no pressure", intensity: 4 },
  { context: "success", primary: "LUMI_HEART", reasoning: "Soft heart glow, no celebration noise", intensity: 3 },
  { context: "journal", primary: "LUMI_COMPANION", reasoning: "Listening companion for written reflection", intensity: 3 },
  { context: "listening", primary: "LUMI_COMPANION", reasoning: "Quiet attentive presence", intensity: 3 },
  { context: "reflection", primary: "LUMI_COMPANION", secondary: "LUMI_MEDITATION", reasoning: "Halo glow for inward attention", intensity: 3 },
  { context: "check-in", primary: "LUMI_EMOTION_ORB", secondary: "LUMI_COMPANION", reasoning: "Emotional literacy via orb metaphor", intensity: 4 },
  { context: "education", primary: "LUMI_EMOTION_ORB", reasoning: "Teaching emotional vocabulary gently", intensity: 4 },
  { context: "exploration", primary: "LUMI_EMOTION_ORB", reasoning: "Soft curiosity for self-discovery", intensity: 4 },
  { context: "onboarding", primary: "LUMI_PATH", reasoning: "Walking-with metaphor for first steps", intensity: 5 },
  { context: "transition", primary: "LUMI_PATH", reasoning: "Movement between contexts", intensity: 4 },
  { context: "progress", primary: "LUMI_PATH", reasoning: "Forward motion without gamification", intensity: 4 },
  { context: "ritual", primary: "LUMI_MEDITATION", reasoning: "Stillness for guided practice", intensity: 4 },
  { context: "breathing", primary: "LUMI_MEDITATION", reasoning: "Aura ring tied to breath cycle", intensity: 5 },
  { context: "meditation", primary: "LUMI_MEDITATION", reasoning: "Native meditation surface", intensity: 6 },
  { context: "trust", primary: "LUMI_HEART", reasoning: "Heart glow signals safety", intensity: 4 },
  { context: "privacy", primary: "LUMI_HEART", reasoning: "Compassionate framing for sensitive content", intensity: 4 },
  { context: "boundaries", primary: "LUMI_HEART", reasoning: "Care without intrusion", intensity: 4 },
  { context: "homepage", primary: "LUMI_SOFT_PRESENCE", secondary: "LUMI_PATH", reasoning: "Quiet hero anchor", intensity: 3 },
  { context: "ambient", primary: "LUMI_CALM_FLOAT", reasoning: "Background presence without focus", intensity: 1 },
] as const);

export function getEmotionalRole(context: string): EmotionalRole | undefined {
  const ctx = (context || "").toLowerCase();
  return EMOTIONAL_ROLES.find((r) => r.context === ctx);
}

export function getPrimaryVariantForContext(context: string): LumiVariantId | null {
  return getEmotionalRole(context)?.primary ?? null;
}

export function getContextsForVariant(variantId: LumiVariantId): ReadonlyArray<string> {
  return EMOTIONAL_ROLES.filter((r) => r.primary === variantId || r.secondary === variantId).map((r) => r.context);
}

export function isIntensityAppropriate(context: string, maxIntensity: number): boolean {
  const role = getEmotionalRole(context);
  if (!role) return true;
  return role.intensity <= maxIntensity;
}
