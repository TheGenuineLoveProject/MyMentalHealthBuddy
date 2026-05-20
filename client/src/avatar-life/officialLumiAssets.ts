// FILE: client/src/avatar-life/officialLumiAssets.ts

/**
 * Official Lumi avatar registry.
 *
 * RULES:
 * - ONLY transparent PNG/WebP assets allowed.
 * - NO square backgrounds.
 * - NO baked cards.
 * - NO framed screenshots.
 * - ONLY isolated Lumi silhouette.
 *
 * All assets must preserve:
 * - silhouette consistency
 * - emotional softness
 * - Serenity Sage palette
 * - calm nervous-system-safe presentation
 */
/**
 * @deprecated
 * LEGACY AVATAR SYSTEM
 *
 * DO NOT USE FOR NEW SURFACES.
 *
 * Canonical runtime:
 * client/src/avatar-life
 *
 * Scheduled for migration + quarantine.
 */
export const OFFICIAL_LUMI = {
	calm: "/assets/lumi/official/lumi-calm.png",
	breathe: "/assets/lumi/official/lumi-breathe.png",
	heartGlow: "/assets/lumi/official/lumi-heart-glow.png",
	reflective: "/assets/lumi/official/lumi-reflective.png",
	supportive: "/assets/lumi/official/lumi-supportive.png",
	sleepy: "/assets/lumi/official/lumi-sleepy.png",
	encouraging: "/assets/lumi/official/lumi-encouraging.png",
	grounded: "/assets/lumi/official/lumi-grounded.png",
} as const;

export type OfficialLumiState = keyof typeof OFFICIAL_LUMI;

export function getOfficialLumi(
	state: OfficialLumiState = "calm",
): string {
	return OFFICIAL_LUMI[state];
}