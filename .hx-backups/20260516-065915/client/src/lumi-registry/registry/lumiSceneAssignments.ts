/**
 * Phase 28 — Scene → variant authoritative assignments.
 *
 * Each surface ("scene") in the product gets exactly one canonical
 * variant assignment, with an optional fallback if context shifts.
 * This is the single source of truth for "which Lumi shows up here".
 */

import type { LumiVariantId } from "./officialLumiRegistry";
import { OFFICIAL_LUMI_REGISTRY } from "./officialLumiRegistry";

export type ScenePosition = "hero" | "inline" | "background" | "card";

export interface SceneAssignment {
  readonly scene: string;
  readonly variant: LumiVariantId;
  readonly fallback?: LumiVariantId;
  readonly position: ScenePosition;
  readonly maxSizePx: number;
  readonly notes: string;
}

export const SCENE_ASSIGNMENTS: ReadonlyArray<SceneAssignment> = Object.freeze([
  { scene: "homepage-hero", variant: "LUMI_SOFT_PRESENCE", fallback: "LUMI_PATH", position: "hero", maxSizePx: 320, notes: "Folded-hands homepage anchor" },
  { scene: "homepage-background", variant: "LUMI_CALM_FLOAT", position: "background", maxSizePx: 220, notes: "Ambient calm behind content" },
  { scene: "onboarding-entry", variant: "LUMI_PATH", position: "hero", maxSizePx: 260, notes: "Walking with the user from step 1" },
  { scene: "onboarding-progress", variant: "LUMI_PATH", position: "inline", maxSizePx: 140, notes: "Quiet companion across steps" },
  { scene: "check-in-entry", variant: "LUMI_EMOTION_ORB", position: "hero", maxSizePx: 280, notes: "Orb metaphor for naming feelings" },
  { scene: "check-in-emotion-selection", variant: "LUMI_EMOTION_ORB", position: "inline", maxSizePx: 140, notes: "Holds the emotion being named" },
  { scene: "journal-entry", variant: "LUMI_COMPANION", position: "hero", maxSizePx: 260, notes: "Listening companion" },
  { scene: "journal-listening", variant: "LUMI_COMPANION", position: "inline", maxSizePx: 130, notes: "Halo presence while user writes" },
  { scene: "ritual-breathing", variant: "LUMI_MEDITATION", position: "hero", maxSizePx: 300, notes: "Aura tied to 7100ms breath cycle" },
  { scene: "ritual-grounding", variant: "LUMI_MEDITATION", position: "hero", maxSizePx: 280, notes: "Stillness for somatic grounding" },
  { scene: "ritual-mindfulness", variant: "LUMI_MEDITATION", position: "hero", maxSizePx: 300, notes: "Native meditation surface" },
  { scene: "trust-page", variant: "LUMI_HEART", position: "hero", maxSizePx: 260, notes: "Heart glow signals safety" },
  { scene: "privacy-page", variant: "LUMI_HEART", position: "hero", maxSizePx: 260, notes: "Compassionate framing for sensitive content" },
  { scene: "boundaries-page", variant: "LUMI_HEART", position: "hero", maxSizePx: 260, notes: "Care without intrusion" },
  { scene: "success-subtle", variant: "LUMI_HEART", position: "inline", maxSizePx: 140, notes: "Soft glow only — no confetti" },
  { scene: "empty-state", variant: "LUMI_CALM_FLOAT", position: "hero", maxSizePx: 220, notes: "Warm invitation, not apology" },
  { scene: "loading-state", variant: "LUMI_CALM_FLOAT", position: "inline", maxSizePx: 90, notes: "Ambient calm during waits" },
  { scene: "welcome-return", variant: "LUMI_HEART", fallback: "LUMI_SOFT_PRESENCE", position: "hero", maxSizePx: 260, notes: "Heart glow for returning users" },
] as const);

if (SCENE_ASSIGNMENTS.length !== 18) {
  throw new Error(`[lumi-registry] SCENE_ASSIGNMENTS floor violated: expected 18, got ${SCENE_ASSIGNMENTS.length}.`);
}

export function getSceneAssignment(scene: string): SceneAssignment | undefined {
  return SCENE_ASSIGNMENTS.find((s) => s.scene === scene);
}

export function getVariantForScene(scene: string): LumiVariantId | null {
  return getSceneAssignment(scene)?.variant ?? null;
}

export function getScenesForVariant(variantId: LumiVariantId): ReadonlyArray<string> {
  return SCENE_ASSIGNMENTS.filter((s) => s.variant === variantId || s.fallback === variantId).map((s) => s.scene);
}

export interface SceneConfigValidation {
  readonly valid: boolean;
  readonly issues: ReadonlyArray<string>;
}

export function validateSceneConfig(scene: string, variantId: LumiVariantId, sizePx: number): SceneConfigValidation {
  const issues: string[] = [];
  const assignment = getSceneAssignment(scene);
  if (!assignment) {
    issues.push(`scene "${scene}" is not registered in SCENE_ASSIGNMENTS`);
    return { valid: false, issues };
  }
  if (variantId !== assignment.variant && variantId !== assignment.fallback) {
    issues.push(
      `scene "${scene}" expects variant "${assignment.variant}"${assignment.fallback ? ` (fallback "${assignment.fallback}")` : ""}, got "${variantId}"`,
    );
  }
  if (sizePx > assignment.maxSizePx) {
    issues.push(`scene "${scene}" max size ${assignment.maxSizePx}px exceeded (got ${sizePx}px)`);
  }
  const variant = OFFICIAL_LUMI_REGISTRY[variantId];
  if (variant) {
    const cap = variant.sizeLimits[assignment.position === "background" ? "hero" : assignment.position === "card" ? "card" : assignment.position === "inline" ? "inline" : "hero"];
    if (sizePx > cap) {
      issues.push(`variant "${variantId}" ${assignment.position} cap ${cap}px exceeded (got ${sizePx}px)`);
    }
  }
  return { valid: issues.length === 0, issues };
}

export function getAllAssignedScenes(): ReadonlyArray<string> {
  return SCENE_ASSIGNMENTS.map((s) => s.scene);
}
