export const officialLumiAssets = {
	LogoMark: "/lumi/official/lumi-float-idle.png",

	idle: "/lumi/official/lumi-float-idle.png",
	heart: "/lumi/official/lumi-heart.png",
	meditation: "/lumi/official/lumi-meditation.png",

	fallback: "/lumi/official/lumi-float-idle.png",
} as const;

export type OfficialLumiAssetKey =
	keyof typeof officialLumiAssets;