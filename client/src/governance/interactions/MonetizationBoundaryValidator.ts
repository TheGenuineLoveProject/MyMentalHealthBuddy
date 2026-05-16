import { EmotionalStateFirewall } from "./EmotionalStateFirewall";
import { isRegulatedAtlasRoute } from "./AtlasRoutingGovernance";

export interface BoundaryValidationInput {
	route: string;
	action: string;
	emotionalState?: {
		isVulnerable?: boolean;
		crisisDetected?: boolean;
		dysregulated?: boolean;
		emotionalIntensity?: number;
	};
}

export class MonetizationBoundaryValidator {
	static validate(
		input: BoundaryValidationInput,
	): {
		allowed: boolean;
		reason?: string;
	} {
		const regulated =
			isRegulatedAtlasRoute(input.route);

		if (!regulated) {
			return { allowed: true };
		}

		const emotionalCheck =
			EmotionalStateFirewall.validateMonetizationAccess(
				input.emotionalState ?? {},
			);

		if (!emotionalCheck.allowed) {
			return {
				allowed: false,
				reason: emotionalCheck.reason,
			};
		}

		return {
			allowed: false,
			reason:
				"Business actions prohibited inside regulated healing flows",
		};
	}
}