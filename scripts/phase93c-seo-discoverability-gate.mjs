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
const nav = fs.existsSync("client/src/components/navigation/SEOContentDiscoveryRail.jsx")
  ? fs.readFileSync("client/src/components/navigation/SEOContentDiscoveryRail.jsx", "utf8")
  : "";
const css = fs.existsSync("client/src/components/navigation/SEOContentDiscoveryRail.css")
  ? fs.readFileSync("client/src/components/navigation/SEOContentDiscoveryRail.css", "utf8")
  : "";
const sitemap = fs.existsSync("client/public/sitemap.xml") ? fs.readFileSync("client/public/sitemap.xml", "utf8") : "";
const robots = fs.existsSync("client/public/robots.txt") ? fs.readFileSync("client/public/robots.txt", "utf8") : "";

const failures = [];

if (!app.includes('import SEOContentDiscoveryRail from "./components/navigation/SEOContentDiscoveryRail.jsx";')) failures.push("DISCOVERY_RAIL_IMPORT_MISSING");
if (!app.includes("<SEOContentDiscoveryRail />")) failures.push("DISCOVERY_RAIL_NOT_MOUNTED");
if (!nav.includes('aria-label="Wellness learning library"')) failures.push("DISCOVERY_RAIL_ARIA_LABEL_MISSING");
if (!nav.includes('data-phase93="seo-content-discovery"')) failures.push("DISCOVERY_RAIL_PHASE_MARKER_MISSING");
if (!nav.includes("Link")) failures.push("DISCOVERY_RAIL_LINK_MISSING");
if (!css.includes("#4a7e72") && !css.includes("#4A7E72")) failures.push("SERENITY_SAGE_TOKEN_MISSING");
if (!css.includes("255, 212, 107") && !css.includes("#ffd46b") && !css.includes("#FFD46B") && !css.includes("#b8963e") && !css.includes("#B8963E")) failures.push("GOLD_TOKEN_MISSING");
if (!css.includes("@media (prefers-reduced-motion: reduce)")) failures.push("REDUCED_MOTION_RULE_MISSING");
if (!robots.includes("Sitemap:")) failures.push("ROBOTS_SITEMAP_MISSING");

for (const route of requiredRoutes) {
  if (!app.includes(`path="${route}"`) && !app.includes(`path='${route}'`)) failures.push(`APP_ROUTE_MISSING ${route}`);
  if (!nav.includes(`to: "${route}"`) && !nav.includes(`to="${route}"`)) failures.push(`DISCOVERY_LINK_MISSING ${route}`);
  if (!sitemap.includes(route)) failures.push(`SITEMAP_ROUTE_MISSING ${route}`);
}

if (failures.length) {
  console.log("SEO_DISCOVERABILITY_GATE_FAIL");
  for (const failure of failures) console.log(failure);
  process.exit(1);
}

console.log("SEO_DISCOVERABILITY_GATE_PASS");
for (const route of requiredRoutes) console.log(`DISCOVERABLE ${route}`);
