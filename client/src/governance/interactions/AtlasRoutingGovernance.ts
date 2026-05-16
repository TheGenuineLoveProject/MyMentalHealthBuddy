export interface AtlasRouteDefinition {
	route: string;
	domain:
		| "HEALING_DOMAIN"
		| "BUSINESS_DOMAIN"
		| "PLATFORM_DOMAIN"
		| "CROSS_DOMAIN";
	regulated: boolean;
}

export const ATLAS_ROUTE_GOVERNANCE: AtlasRouteDefinition[] = [
	{
		route: "/journal",
		domain: "HEALING_DOMAIN",
		regulated: true,
	},

	{
		route: "/mood",
		domain: "HEALING_DOMAIN",
		regulated: true,
	},

	{
		route: "/ritual",
		domain: "HEALING_DOMAIN",
		regulated: true,
	},

	{
		route: "/wisdom-practices",
		domain: "HEALING_DOMAIN",
		regulated: true,
	},

	{
		route: "/atlas",
		domain: "CROSS_DOMAIN",
		regulated: true,
	},

	{
		route: "/analytics",
		domain: "BUSINESS_DOMAIN",
		regulated: false,
	},

	{
		route: "/pricing",
		domain: "BUSINESS_DOMAIN",
		regulated: false,
	},
];

export function isRegulatedAtlasRoute(
	route: string,
): boolean {
	return (
		ATLAS_ROUTE_GOVERNANCE.find(
			(r) => r.route === route,
		)?.regulated ?? false
	);
}