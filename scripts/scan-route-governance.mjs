#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(process.cwd());
const APP = resolve(ROOT, "client/src/App.jsx");
const REGISTRY = resolve(ROOT, "client/src/content/routes/routeRegistry.js");

const errors = [];
const warnings = [];
const pass = [];

function ok(label) {
  pass.push(`PASS  ${label}`);
}
function fail(label, detail = "") {
  errors.push(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
}
function warn(label, detail = "") {
  warnings.push(`WARN  ${label}${detail ? ` — ${detail}` : ""}`);
}

if (!existsSync(APP)) fail("App.jsx exists", APP);
if (!existsSync(REGISTRY)) fail("routeRegistry exists", REGISTRY);

if (errors.length) {
  printAndExit();
}

const app = readFileSync(APP, "utf8");
const mod = await import(pathToFileURL(REGISTRY).href);
const registry = mod.routeRegistry || mod.default;
const list = Object.values(registry);

const seenPaths = new Set();
const seenTitles = new Set();
const seenCanonicals = new Set();

const REQUIRED_FIELDS = [
  "path",
  "title",
  "description",
  "seoDescription",
  "canonical",
  "category",
  "navGroup",
  "emotionalIntent",
  "userGoal",
  "platformRole",
];

for (const entry of list) {
  const path = entry.path || "(no-path)";

  for (const f of REQUIRED_FIELDS) {
    if (entry[f] === undefined || entry[f] === null || entry[f] === "") {
      fail(`${path}: missing field "${f}"`);
    }
  }

  if (entry.path) {
    if (seenPaths.has(entry.path)) fail(`duplicate registry path: ${entry.path}`);
    seenPaths.add(entry.path);
  }
  if (entry.title) {
    if (seenTitles.has(entry.title)) fail(`duplicate registry title: ${entry.title}`);
    seenTitles.add(entry.title);
  }
  if (entry.canonical) {
    if (seenCanonicals.has(entry.canonical)) fail(`duplicate canonical URL: ${entry.canonical}`);
    seenCanonicals.add(entry.canonical);
  } else {
    fail(`${path}: missing canonical URL`);
  }

  if (entry.canonical && !/^https?:\/\//.test(entry.canonical)) {
    fail(`${path}: canonical must be absolute URL`);
  }
}

ok(`registry has ${list.length} entries, ${REQUIRED_FIELDS.length} required fields each`);

const appRouteMatches = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map(
  (m) => m[1],
);
const appPathCounts = appRouteMatches.reduce((acc, p) => {
  acc[p] = (acc[p] || 0) + 1;
  return acc;
}, {});

for (const [p, count] of Object.entries(appPathCounts)) {
  if (count > 1) {
    warn(`duplicate route in App.jsx: ${p}`, `appears ${count}×`);
  }
}
ok(`App.jsx contains ${appRouteMatches.length} <Route path="..."> declarations`);

for (const entry of list) {
  if (!appRouteMatches.includes(entry.path)) {
    warn(
      `registry path missing from App.jsx: ${entry.path}`,
      "informational; aliases/redirects may cover it",
    );
  }
}

if (/pages\/trust\/[A-Z][A-Za-z]+\.tsx/.test(app)) {
  fail("App.jsx still imports a trust .tsx duplicate");
} else {
  ok("no .tsx trust duplicates referenced in App.jsx");
}

const trustPages = [
  "client/src/pages/trust/TrustCenterPage.jsx",
  "client/src/pages/trust/AITransparencyPage.jsx",
];
for (const p of trustPages) {
  const full = resolve(ROOT, p);
  if (!existsSync(full)) {
    fail(`missing trust page file: ${p}`);
    continue;
  }
  const src = readFileSync(full, "utf8");
  if (!/PageSEO/.test(src)) {
    fail(`${p}: does not import PageSEO`);
  } else {
    ok(`${p}: wires PageSEO`);
  }
}

const seoComponent = resolve(ROOT, "client/src/components/seo/PageSEO.jsx");
if (!existsSync(seoComponent)) {
  fail("PageSEO component missing");
} else {
  ok("PageSEO component exists");
}

const VALID_GROUPS = new Set([
  "trust",
  "healing",
  "wellness",
  "awareness",
  "tools",
  "account",
  "growth",
]);
for (const entry of list) {
  if (entry.navGroup && !VALID_GROUPS.has(entry.navGroup)) {
    fail(`${entry.path}: invalid navGroup "${entry.navGroup}"`);
  }
}
ok("all registry navGroups are valid");

printAndExit();

function printAndExit() {
  console.log("");
  console.log("=== Phase 116 — Route Governance Scan ===");
  console.log("");
  for (const p of pass) console.log("  " + p);
  for (const w of warnings) console.log("  " + w);
  for (const e of errors) console.log("  " + e);
  console.log("");
  console.log(
    `Summary: ${pass.length} pass, ${warnings.length} warn, ${errors.length} fail`,
  );
  console.log("");
  process.exit(errors.length === 0 ? 0 : 1);
}
