import fs from "fs";

const appPath = "client/src/App.jsx";
const outPath = "docs/route-ownership-manifest.md";

const src = fs.readFileSync(appPath, "utf8");
const routeRegex = /<Route\s+path="([^"]+)"([\s\S]*?)(?:\/>|<\/Route>)/g;

const routes = new Map();
let match;

while ((match = routeRegex.exec(src)) !== null) {
  const path = match[1];
  const block = match[0];

  if (!routes.has(path)) routes.set(path, []);
  routes.get(path).push({
    protected: block.includes("ProtectedRoute"),
    wellness: block.includes("WellnessRoute"),
    configRoute: block.includes("ConfigRoute"),
    redirect: block.includes("Redirect"),
    component: (block.match(/component=\{([^}]+)\}/) || [])[1] || "inline/children",
  });
}

function classify(path, entries) {
  if (entries.length >= 3) return "CRITICAL_CONFLICT";
  if (["/about", "/features", "/healing", "/wellbeing"].includes(path)) return "SAFE_ALIAS";
  return "REVIEW_REQUIRED";
}

const duplicateRows = [...routes.entries()]
  .filter(([, entries]) => entries.length > 1)
  .sort(([a], [b]) => a.localeCompare(b));

const lines = [];
lines.push("# Route Ownership Manifest");
lines.push("");
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push("");
lines.push("## Duplicate Route Groups");
lines.push("");
lines.push("| Route | Count | Classification | Protected | Wellness | ConfigRoute | Redirect | Components |");
lines.push("|---|---:|---|---|---|---|---|---|");

for (const [path, entries] of duplicateRows) {
  const protectedFlag = entries.some(e => e.protected) ? "yes" : "no";
  const wellnessFlag = entries.some(e => e.wellness) ? "yes" : "no";
  const configFlag = entries.some(e => e.configRoute) ? "yes" : "no";
  const redirectFlag = entries.some(e => e.redirect) ? "yes" : "no";
  const components = [...new Set(entries.map(e => e.component))].join(", ");
  lines.push(`| ${path} | ${entries.length} | ${classify(path, entries)} | ${protectedFlag} | ${wellnessFlag} | ${configFlag} | ${redirectFlag} | ${components} |`);
}

lines.push("");
lines.push("## Governance Rules");
lines.push("");
lines.push("- This manifest is observational only.");
lines.push("- Do not delete duplicate routes without confirming wrapper ownership.");
lines.push("- ProtectedRoute and WellnessRoute must be preserved.");
lines.push("- ConfigRoute delegation must not be removed unless the replacement page preserves body behavior.");
lines.push("- SEO canonical pages should remain thin wrappers around existing body components.");
lines.push("- Future cleanup must resolve CRITICAL_CONFLICT first, then REVIEW_REQUIRED groups one route at a time.");
lines.push("");

fs.writeFileSync(outPath, lines.join("\n"));

console.log("PASS detailed route governance manifest exported");
console.log(outPath);
