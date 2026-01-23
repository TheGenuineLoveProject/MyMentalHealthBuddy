// /tools/generate_pages_from_routes.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getAllRouteEntries } from "../content/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const PAGES_DIR = path.resolve(ROOT, "pages");

const FORCE = process.argv.includes("--force");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function routeToFile(route) {
  // normalize
  if (route === "/") return path.join(PAGES_DIR, "index.jsx");
  if (route === "/*") return path.join(PAGES_DIR, "404.jsx");

  const clean = route.startsWith("/") ? route.slice(1) : route;

  // convert dynamic segments :slug -> [slug]
  const segments = clean.split("/").map((seg) => {
    if (seg.startsWith(":")) return `[${seg.slice(1)}]`;
    return seg;
  });

  const filePath = path.join(PAGES_DIR, ...segments) + ".jsx";
  return filePath;
}

function pageSource(route) {
  return `// AUTO-GENERATED from /content/routes.js
import React from "react";
import AutopilotPage from "../_autopilot.jsx";

export default function Page() {
  return <AutopilotPage routeOverride="${route}" />;
}
`;
}

function main() {
  ensureDir(PAGES_DIR);

  const entries = getAllRouteEntries();

  let created = 0;
  let skipped = 0;

  for (const r of entries) {
    const filePath = routeToFile(r.route);

    // ensure parent dir exists
    ensureDir(path.dirname(filePath));

    if (fs.existsSync(filePath) && !FORCE) {
      skipped += 1;
      continue;
    }

    // Special-case: avoid overwriting existing handcrafted pages unless --force
    fs.writeFileSync(filePath, pageSource(r.route), "utf8");
    created += 1;
  }

  console.log(`✅ Generated pages from routes.js`);
  console.log(`Created: ${created}`);
  console.log(`Skipped (already existed): ${skipped}`);
  console.log(`Tip: run with --force to overwrite: node tools/generate_pages_from_routes.mjs --force`);
}

main();