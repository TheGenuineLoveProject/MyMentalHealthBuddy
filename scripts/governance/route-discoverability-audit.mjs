import fs from "fs";
import path from "path";

const SRC = "client/src";

const routeFiles = [];

function walk(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) walk(full);
    else if (
      full.endsWith(".tsx") ||
      full.endsWith(".jsx")
    ) {
      routeFiles.push(full);
    }
  }
}

walk(SRC);

const routeRegex = /path=["'`](.*?)["'`]/g;

const routes = [];

for (const file of routeFiles) {
  const content = fs.readFileSync(file, "utf8");

  let match;

  while ((match = routeRegex.exec(content))) {
    routes.push({
      file,
      route: match[1]
    });
  }
}

const duplicates = {};
const counts = {};

for (const r of routes) {
  counts[r.route] = (counts[r.route] || 0) + 1;
}

for (const [route, count] of Object.entries(counts)) {
  if (count > 1) duplicates[route] = count;
}

const discoverability = routes.map(r => ({
  ...r,
  canonical:
    !r.route.includes(":") &&
    !r.route.includes("*"),
  admin:
    r.route.startsWith("/admin"),
  trust:
    [
      "/privacy",
      "/terms",
      "/safety",
      "/about"
    ].includes(r.route),
  wellness:
    r.route.includes("wellness") ||
    r.route.includes("mood") ||
    r.route.includes("journal") ||
    r.route.includes("healing"),
}));

fs.writeFileSync(
  "docs/reports/PHASE_81_ROUTE_DISCOVERABILITY.json",
  JSON.stringify(discoverability, null, 2)
);

fs.writeFileSync(
  "docs/reports/PHASE_81_DUPLICATE_ROUTES.json",
  JSON.stringify(duplicates, null, 2)
);

const summary = `
# Phase 81 — Route Discoverability Governance

## Total Route Entries
${routes.length}

## Duplicate Routes
${Object.keys(duplicates).length}

## Admin Routes
${discoverability.filter(r => r.admin).length}

## Trust Routes
${discoverability.filter(r => r.trust).length}

## Wellness Routes
${discoverability.filter(r => r.wellness).length}

## Canonical Routes
${discoverability.filter(r => r.canonical).length}
`;

fs.writeFileSync(
  "docs/reports/PHASE_81_ROUTE_DISCOVERABILITY.md",
  summary
);

console.log(summary);
