import fs from "fs";

const input = "registry/discoverability/discoverability-registry.json";
const outputJson = "registry/navigation/navigation-manifest.json";
const outputMd = "docs/reports/PHASE_94_NAVIGATION_MANIFEST.md";

if (!fs.existsSync(input)) {
  console.error("Missing discoverability registry. Run Phase 93 first.");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(input, "utf8"));

const manifest = {
  generatedAt: new Date().toISOString(),
  purpose: "Canonical navigation manifest for route discoverability and user journey governance.",
  primaryNavigation: [
    { label: "Home", route: "/", domain: "public" },
    { label: "Discover Tools", route: "/discover", domain: "discovery" },
    { label: "Wellness Tools", route: "/wellness-tools", domain: "wellness" },
    { label: "Journal", route: "/journal", domain: "wellness" },
    { label: "Mood", route: "/mood", domain: "wellness" },
    { label: "Safety", route: "/safety", domain: "trust" },
    { label: "Privacy", route: "/privacy", domain: "trust" }
  ],
  userJourney: [
    "Arrive",
    "Orient",
    "Discover",
    "Choose Tool",
    "Use Support",
    "Reflect",
    "Return"
  ],
  counts: {
    pages: data.pagesTotal,
    hubs: data.hubs.length,
    tools: data.tools.length,
    dashboards: data.dashboards.length,
    admin: data.admin.length,
    wellness: data.wellness.length
  }
};

fs.writeFileSync(outputJson, JSON.stringify(manifest, null, 2));

let md = "# Phase 94 — Navigation Manifest + User Journey Map\n\n";
md += "## Purpose\nCreate a canonical navigation manifest without changing app code.\n\n";
md += "## Primary Navigation\n";
manifest.primaryNavigation.forEach(item => {
  md += `- ${item.label}: ${item.route} (${item.domain})\n`;
});
md += "\n## User Journey\n";
manifest.userJourney.forEach((step, i) => {
  md += `${i + 1}. ${step}\n`;
});
md += "\n## Registry Counts\n";
Object.entries(manifest.counts).forEach(([k,v]) => {
  md += `- ${k}: ${v}\n`;
});
md += "\n## Safety\n- No source edits\n- No route edits\n- No billing edits\n- No auth edits\n- No crisis edits\n- No database edits\n";

fs.writeFileSync(outputMd, md);

console.log("Navigation manifest audit complete");
console.log(JSON.stringify(manifest.counts, null, 2));
