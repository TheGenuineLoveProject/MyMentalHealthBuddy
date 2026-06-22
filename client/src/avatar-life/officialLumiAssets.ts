// FILE: client/src/avatar-life/officialLumiAssets.ts
// PHASE116T2_AVATAR_LIFE_DISTINCT_SLEEPY_ASSET_PATCH

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
        calm: "/lumi/official/lumi-calm-float.png",
        breathe: "/lumi/official/lumi-meditation.png",
        heartGlow: "/lumi/official/lumi-heart.png",
        reflective: "/lumi/official/lumi-soft-presence.png",
        supportive: "/lumi/official/lumi-companion.png",
        sleepy: "/lumi/official/lumi-float-idle.png",
        encouraging: "/lumi/official/lumi-emotion-orb.png",
        grounded: "/lumi/official/lumi-path.png",
} as const;

export type OfficialLumiState = keyof typeof OFFICIAL_LUMI;

export function getOfficialLumi(
        state: OfficialLumiState = "calm",
): string {
        return OFFICIAL_LUMI[state];
}