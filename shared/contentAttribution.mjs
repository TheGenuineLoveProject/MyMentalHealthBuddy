export const CONTENT_POLICY = {
	requireAttribution: true,
	allowDirectQuotes: true,
	maxDirectQuoteLength: 120,
	requireCanonicalLinks: true,
	requireAuthorCredit: true,
	requireResearchCitation: true,
	prohibitScrapedContent: true,
	prohibitFullArticleReuse: true,
};

export function attribution({
	title,
	author,
	source,
	url,
	license = "All Rights Reserved",
}) {
	return {
		title,
		author,
		source,
		url,
		license,
		attributed: true,
	};
}