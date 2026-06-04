import blc from "broken-link-checker";

const site = "http://localhost:5000";

const scanner = new blc.SiteChecker(
	{
		excludeExternalLinks: false,
	},
	{
		link(result) {
			if (result.broken) {
				console.log("BROKEN:", result.url.resolved);
			}
		},

		end() {
			console.log("LINK SCAN COMPLETE");
		},
	}
);

scanner.enqueue(site);