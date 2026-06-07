import fs from "node:fs";

const requiredRoutes = [
  "/glossary",
  "/wellness-glossary",
  "/research-evidence",
  "/professional-resources",
  "/how-to-guides",
  "/qa",
  "/examples",
  "/health",
  "/calming-scenes",
];

const app = fs.existsSync("client/src/App.jsx") ? fs.readFileSync("client/src/App.jsx", "utf8") : "";
const navPath = "client/src/components/navigation/SEOContentDiscoveryRail.jsx";
const cssPath = "client/src/components/navigation/SEOContentDiscoveryRail.css";
const nav = fs.existsSync(navPath) ? fs.readFileSync(navPath, "utf8") : "";
const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf8") : "";

const failures = [];

if (!app.includes("SEOContentDiscoveryRail")) failures.push("DISCOVERY_RAIL_NOT_IMPORTED_OR_MOUNTED");
if (!nav.includes('aria-label="Wellness learning library"')) failures.push("DISCOVERY_RAIL_ARIA_LABEL_MISSING");
if (!nav.includes('data-phase93="seo-content-discovery"')) failures.push("DISCOVERY_RAIL_PHASE_MARKER_MISSING");
if (!nav.includes("Link")) failures.push("DISCOVERY_RAIL_REACT_ROUTER_LINK_MISSING");
if (!css.includes("#4a7e72") && !css.includes("#4A7E72")) failures.push("SERENITY_SAGE_TOKEN_MISSING");
if (!css.includes("#ffd46b") && !css.includes("#FFD46B") && !css.includes("#b8963e") && !css.includes("#B8963E")) failures.push("GOLD_TOKEN_MISSING");
if (!css.includes("@media (prefers-reduced-motion: reduce)")) failures.push("REDUCED_MOTION_RULE_MISSING");

for (const route of requiredRoutes) {
  if (!app.includes(`path="${route}"`) && !app.includes(`path='${route}'`)) failures.push(`APP_ROUTE_MISSING ${route}`);
  if (!nav.includes(`to: "${route}"`) && !nav.includes(`to="${route}"`)) failures.push(`DISCOVERY_LINK_MISSING ${route}`);
}

if (failures.length) {
  console.log("SEO_DISCOVERABILITY_GATE_FAIL");
  for (const failure of failures) console.log(failure);
  process.exit(1);
}

console.log("SEO_DISCOVERABILITY_GATE_PASS");
for (const route of requiredRoutes) console.log(`DISCOVERABLE ${route}`);
