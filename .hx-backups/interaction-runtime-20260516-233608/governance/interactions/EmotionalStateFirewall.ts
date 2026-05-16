export interface EmotionalStateContext {
	isVulnerable?: boolean;
	crisisDetected?: boolean;
	dysregulated?: boolean;
	emotionalIntensity?: number;
}

export class EmotionalStateFirewall {
	static shouldBlockBusinessLogic(
		context: EmotionalStateContext,
	): boolean {
		if (context.crisisDetected) return true;

		if (context.isVulnerable) return true;

		if (context.dysregulated) return true;

		if ((context.emotionalIntensity ?? 0) >= 7) return true;

		return false;
	}

	static validateMonetizationAccess(
		context: EmotionalStateContext,
	): {
		allowed: boolean;
		reason?: string;
	} {
		const blocked =
			EmotionalStateFirewall.shouldBlockBusinessLogic(
				context,
			);

		if (blocked) {
			return {
				allowed: false,
				reason:
					"Business logic blocked by EmotionalStateFirewall",
			};
		}

		return {
			allowed: true,
		};
	}
}