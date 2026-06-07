import fs from "node:fs";

const appPath = "client/src/App.jsx";
if (!fs.existsSync(appPath)) throw new Error("Missing client/src/App.jsx");

let src = fs.readFileSync(appPath, "utf8");
const original = src;

const discoveryImport = 'import SEOContentDiscoveryRail from "./components/navigation/SEOContentDiscoveryRail.jsx";';

function insertAfterLastImport(text, line) {
  if (text.includes(line)) return text;
  const imports = [...text.matchAll(/^import .*?;$/gm)];
  if (!imports.length) throw new Error("No import block found");
  const last = imports[imports.length - 1];
  const insertAt = last.index + last[0].length;
  return `${text.slice(0, insertAt)}\n${line}${text.slice(insertAt)}`;
}

function insertRouteAfterAnchor(text, route, anchorRoute) {
  if (text.includes(`path="${route}"`) || text.includes(`path='${route}'`)) return text;

  const routeLine = `              <Route path="${route}">{() => <ConfigRoute route="${route}" />}</Route>`;
  const anchorRegex = new RegExp(`^\\s*<Route\\s+path=["']${anchorRoute.replace("/", "\\/")}["'][\\s\\S]*?<\\/Route>\\s*$`, "m");
  const match = text.match(anchorRegex);

  if (match?.index !== undefined) {
    const insertAt = match.index + match[0].length;
    return `${text.slice(0, insertAt)}\n${routeLine}${text.slice(insertAt)}`;
  }

  const allRoutes = [...text.matchAll(/^\s*<Route\s+path=["'][^"']+["'][\s\S]*?<\/Route>\s*$/gm)];
  if (!allRoutes.length) throw new Error(`No Wouter route anchor found for ${route}`);
  const last = allRoutes[allRoutes.length - 1];
  const insertAt = last.index + last[0].length;
  return `${text.slice(0, insertAt)}\n${routeLine}${text.slice(insertAt)}`;
}

function mountRailBeforeFirstRoute(text) {
  if (text.includes("<SEOContentDiscoveryRail />")) return text;

  const firstRoute = text.match(/^\s*<Route\s+path=["'][^"']+["'][\s\S]*?<\/Route>\s*$/m);
  if (!firstRoute || firstRoute.index === undefined) throw new Error("No Wouter route anchor found for discovery rail mount");

  const lineStart = text.lastIndexOf("\n", firstRoute.index) + 1;
  const indent = text.slice(lineStart, firstRoute.index).match(/^\s*/)?.[0] || "";
  return `${text.slice(0, lineStart)}${indent}<SEOContentDiscoveryRail />\n${text.slice(lineStart)}`;
}

src = insertAfterLastImport(src, discoveryImport);
src = insertRouteAfterAnchor(src, "/wellness-glossary", "/glossary");
src = insertRouteAfterAnchor(src, "/research-evidence", "/wellness-glossary");
src = mountRailBeforeFirstRoute(src);

fs.writeFileSync(appPath, src);

const summary = {
  changed: src !== original,
  discoveryImportPresent: src.includes(discoveryImport),
  discoveryMountPresent: src.includes("<SEOContentDiscoveryRail />"),
  glossaryPresent: src.includes('path="/glossary"'),
  wellnessGlossaryPresent: src.includes('path="/wellness-glossary"'),
  researchEvidencePresent: src.includes('path="/research-evidence"'),
  professionalResourcesPresent: src.includes('path="/professional-resources"'),
  howToGuidesPresent: src.includes('path="/how-to-guides"'),
  qaPresent: src.includes('path="/qa"'),
  examplesPresent: src.includes('path="/examples"'),
  healthPresent: src.includes('path="/health"'),
  calmingScenesPresent: src.includes('path="/calming-scenes"'),
};

fs.writeFileSync("diagnostics/phase93e/app-patch-summary.json", JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));

if (!Object.entries(summary).filter(([key]) => key !== "changed").every(([, value]) => value === true)) {
  process.exit(1);
}
