export * from "./components/MMHBCard";
export * from "./components/MMHBButton";

export * from "./tokens/colors";
export * from "./tokens/spacing";
export * from "./tokens/radius";
export * from "./tokens/typography";

import { colors } from "./tokens/colors";
import { spacing } from "./tokens/spacing";
import { radius } from "./tokens/radius";
import { typography } from "./tokens/typography";

export const tokens = {
	colors,
	spacing,
	radius,
	typography,
} as const;

export { colors, spacing, radius, typography };

export const semantic = colors.semantic;
export const palette = colors.palette;
export const aura = colors.aura;

export const fonts = typography.fonts;
export const heading = typography.heading;
export const body = typography.body;