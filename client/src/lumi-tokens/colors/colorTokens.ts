/**
 * @fileoverview Color Token System
 * @module lumi-tokens/colors
 */

export const COLORS = {
	serenitySage: "#8FBF9F",
	primarySage: "#7BA483",

	deepTeal: "#2F5D50",
	deepForest: "#163A36",

	eternalGold: "#D4AF37",

	warmCream: "#F6F1E8",
	ivoryLight: "#FAF9F7",

	softBlush: "#E5B8AE",
	mist: "#F8F8F4",

	charcoalDeep: "#3A3A3A",
} as const;

export const SEMANTIC_COLORS = {
	background: COLORS.warmCream,

	surface: COLORS.ivoryLight,

	surfaceSubtle: COLORS.mist,

	text: COLORS.charcoalDeep,

	textMuted: "#6B6B6B",

	primary: COLORS.serenitySage,

	primaryHover: COLORS.primarySage,

	secondary: COLORS.deepTeal,

	accent: COLORS.eternalGold,

	compassion: COLORS.softBlush,

	border: "rgba(22,58,54,0.08)",

	success: COLORS.primarySage,

	error: "#C4787A",

	warning: "#D4A76A",
} as const;

export const LUMI_COLORS = {
	body: "#FFF5F0",

	belly: COLORS.serenitySage,

	sprout: COLORS.primarySage,

	eyes: COLORS.deepForest,

	cheeks: "rgba(229,184,174,0.4)",

	shadow: "rgba(47,93,93,0.12)",
} as const;

export const GRADIENTS = {
	primaryButton: `linear-gradient(
		135deg,
		${COLORS.serenitySage} 0%,
		${COLORS.deepTeal} 100%
	)`,

	heroBackground: `linear-gradient(
		180deg,
		${COLORS.warmCream} 0%,
		${COLORS.mist} 100%
	)`,

	calmDepth: `linear-gradient(
		180deg,
		${COLORS.deepTeal} 0%,
		${COLORS.deepForest} 100%
	)`,

	softGlow:
		"radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
} as const;

export const OPACITY = {
	full: 1,
	high: 0.78,
	medium: 0.5,
	low: 0.25,
	subtle: 0.08,
	ghost: 0.04,
} as const;

export const FORBIDDEN_COLORS = [
	"#000000",
	"#FF0000",
	"#FF6B6B",
	"#00FF00",
	"#0000FF",
	"#FF00FF",
	"#00FFFF",
	"#FFA500",
	"#FFFFFF",
] as const;

export function isForbiddenColor(hex: string): boolean {
	return FORBIDDEN_COLORS.includes(
		hex.toUpperCase() as (typeof FORBIDDEN_COLORS)[number]
	);
}

export function getColor(
	token: keyof typeof COLORS
): string {
	return COLORS[token];
}

export function alpha(
	hex: string,
	opacity: number
): string {
	const clean = hex.replace("#", "");

	return `rgba(
		${parseInt(clean.slice(0, 2), 16)},
		${parseInt(clean.slice(2, 4), 16)},
		${parseInt(clean.slice(4, 6), 16)},
		${opacity}
	)`;
}