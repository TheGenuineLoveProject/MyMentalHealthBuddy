#!/usr/bin/env node
/**
 * generate-sitemap.mjs - Generate sitemap.xml from route registry
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "sitemap.xml");
const REG = path.join(ROOT, "client", "src", "content", "meta", "routeMetaRegistry.ts");
const ROUTES_JS = path.join(ROOT, "client", "src", "content", "routes.js");

function read(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

function extractCanonicalPaths(ts) {
  const re = /canonicalPath\s*:\s*["'`]([^"'`]+)["'`]/g;
  const out = [];
  let m;
  while ((m = re.exec(ts))) out.push(m[1]);
  return out;
}

function extractRoutePaths(js) {
  const re = /path\s*:\s*["'`]([^"'`]+)["'`]/g;
  const out = [];
  let m;
  while ((m = re.exec(js))) out.push(m[1]);
  return out;
}

function unique(arr) {
  return Array.from(new Set(arr.filter(Boolean)));
}

function main() {
  const regText = read(REG);
  const routesText = read(ROUTES_JS);
  
  const canonicalPaths = extractCanonicalPaths(regText);
  const routePaths = extractRoutePaths(routesText);
  
  const allPaths = unique([...canonicalPaths, ...routePaths])
    .filter((p) => p.startsWith("/"))
    .filter((p) => !p.includes(":"))
    .filter((p) => !p.includes("*"))
    .filter((p) => !p.startsWith("/admin"))
    .filter((p) => !p.startsWith("/api"))
    .sort();

  const base = process.env.SITE_ORIGIN || "https://TheGenuineLoveProject.com";

  const urls = allPaths
    .map((p) => `  <url><loc>${base}${p}</loc></url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, xml);
  console.log(`Wrote sitemap -> ${OUT}`);
  console.log(`URLs: ${allPaths.length}`);
}

main();
