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

const app = fs.readFileSync("client/src/App.jsx", "utf8");
const nav = fs.readFileSync("client/src/components/navigation/SEOContentDiscoveryRail.jsx", "utf8");
const css = fs.readFileSync("client/src/components/navigation/SEOContentDiscoveryRail.css", "utf8");
const sitemap = fs.readFileSync("client/public/sitemap.xml", "utf8");
const robots = fs.readFileSync("client/public/robots.txt", "utf8");
const registry = fs.readFileSync("docs/architecture/CANONICAL_PAGE_REGISTRY.md", "utf8");

const failures = [];

if (!app.includes('import SEOContentDiscoveryRail from "./components/navigation/SEOContentDiscoveryRail.jsx";')) failures.push("DISCOVERY_RAIL_IMPORT_MISSING");
if (!app.includes("<SEOContentDiscoveryRail />")) failures.push("DISCOVERY_RAIL_NOT_MOUNTED");
if (!nav.includes('aria-label="Wellness learning library"')) failures.push("ARIA_LABEL_MISSING");
if (!nav.includes('data-phase93="seo-content-discovery"')) failures.push("PHASE_MARKER_MISSING");
if (!nav.includes("href={item.to}")) failures.push("ANCHOR_LINK_BINDING_MISSING");
if (!css.includes("#4a7e72") && !css.includes("#4A7E72")) failures.push("SERENITY_SAGE_MISSING");
if (!css.includes("255, 212, 107") && !css.includes("#ffd46b") && !css.includes("#FFD46B") && !css.includes("#b8963e") && !css.includes("#B8963E")) failures.push("GOLD_ACCENT_MISSING");
if (!css.includes("@media (prefers-reduced-motion: reduce)")) failures.push("REDUCED_MOTION_MISSING");
if (!robots.includes("Sitemap:")) failures.push("ROBOTS_SITEMAP_MISSING");

for (const route of requiredRoutes) {
  if (!app.includes(`path="${route}"`) && !app.includes(`path='${route}'`)) failures.push(`APP_ROUTE_MISSING ${route}`);
  if (!nav.includes(`to: "${route}"`)) failures.push(`DISCOVERY_RAIL_LINK_MISSING ${route}`);
  if (!sitemap.includes(route)) failures.push(`SITEMAP_ROUTE_MISSING ${route}`);
  if (!registry.includes(route)) failures.push(`REGISTRY_ROUTE_MISSING ${route}`);
}

if (failures.length) {
  console.log("PHASE93E_COMPLETION_GATE_FAIL");
  for (const failure of failures) console.log(failure);
  process.exit(1);
}

console.log("PHASE93E_COMPLETION_GATE_PASS");
for (const route of requiredRoutes) console.log(`COMPLETE ${route}`);
