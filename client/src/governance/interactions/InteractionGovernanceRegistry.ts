export type InteractionDomain =
	| "HEALING_DOMAIN"
	| "BUSINESS_DOMAIN"
	| "PLATFORM_DOMAIN"
	| "SAFETY_DOMAIN"
	| "CROSS_DOMAIN";

export interface InteractionDefinition {
	id: string;
	domain: InteractionDomain;
	regulated: boolean;
	businessAllowed: boolean;
	crisisSensitive?: boolean;
}

export const INTERACTION_GOVERNANCE_REGISTRY: Record<
	string,
	InteractionDefinition
> = {
	navigation: {
		id: "navigation",
		domain: "PLATFORM_DOMAIN",
		regulated: false,
		businessAllowed: true,
	},

	reflection: {
		id: "reflection",
		domain: "HEALING_DOMAIN",
		regulated: true,
		businessAllowed: false,
	},

	meditation: {
		id: "meditation",
		domain: "HEALING_DOMAIN",
		regulated: true,
		businessAllowed: false,
	},

	journaling: {
		id: "journaling",
		domain: "HEALING_DOMAIN",
		regulated: true,
		businessAllowed: false,
		crisisSensitive: true,
	},

	mood_tracking: {
		id: "mood_tracking",
		domain: "HEALING_DOMAIN",
		regulated: true,
		businessAllowed: false,
		crisisSensitive: true,
	},

	cognitive_analysis: {
		id: "cognitive_analysis",
		domain: "CROSS_DOMAIN",
		regulated: true,
		businessAllowed: false,
	},

	atlas_routing: {
		id: "atlas_routing",
		domain: "CROSS_DOMAIN",
		regulated: true,
		businessAllowed: false,
	},

	analytics: {
		id: "analytics",
		domain: "BUSINESS_DOMAIN",
		regulated: false,
		businessAllowed: true,
	},

	paywall_tracking: {
		id: "paywall_tracking",
		domain: "BUSINESS_DOMAIN",
		regulated: false,
		businessAllowed: true,
	},

	crisis_links: {
		id: "crisis_links",
		domain: "SAFETY_DOMAIN",
		regulated: true,
		businessAllowed: false,
		crisisSensitive: true,
	},
};