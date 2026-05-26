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
function check(label, cond, detail = "") {
  if (cond) ok(label);
  else fail(label, detail);
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
  const hasPageSEO = /PageSEO/.test(src);
  const hasHelmet =
    /import\s*\{\s*Helmet\s*\}\s*from\s*['"]react-helmet-async['"]/.test(src) &&
    /<Helmet>/.test(src);
  if (!hasPageSEO && !hasHelmet) {
    fail(`${p}: missing SEO wiring (neither PageSEO nor <Helmet>)`);
  } else {
    ok(`${p}: wires SEO (${hasPageSEO ? "PageSEO" : "Helmet"})`);
  }
}

const aboutPage = resolve(ROOT, "client/src/pages/About.jsx");
if (!existsSync(aboutPage)) {
  fail("About.jsx missing");
} else {
  const src = readFileSync(aboutPage, "utf8");
  check(
    "About.jsx: imports routeRegistry (getRouteMeta)",
    /getRouteMeta\s*\(\s*['"]\/about['"]/.test(src) ||
      /from\s+['"][^'"]*content\/routes\/routeRegistry/.test(src),
  );
  check(
    "About.jsx: renders <Helmet> (or PageSEO)",
    /<Helmet>/.test(src) || /<PageSEO\b/.test(src),
  );
  check("About.jsx: sets <title>", /<title>[\s\S]*?<\/title>/.test(src) || /title=\{/.test(src));
  check("About.jsx: sets meta description", /name=["']description["']/.test(src) || /description=\{/.test(src));
  check("About.jsx: sets canonical link", /rel=["']canonical["']/.test(src) || /canonical=\{/.test(src));
  check("About.jsx: emits OG metadata", /property=["']og:/.test(src));
  check("About.jsx: emits Twitter metadata", /name=["']twitter:/.test(src));
}

const appHasAboutRoute = /<Route\s+path="\/about"\s+component=\{AboutPage\}/.test(app);
check("App.jsx: /about route uses AboutPage component", appHasAboutRoute);

const featuresPage = resolve(ROOT, "client/src/pages/Features.jsx");
if (!existsSync(featuresPage)) {
  fail("Features.jsx missing");
} else {
  const src = readFileSync(featuresPage, "utf8");
  check(
    "Features.jsx: imports routeRegistry (getRouteMeta)",
    /getRouteMeta\s*\(\s*['"]\/features['"]/.test(src) ||
      /from\s+['"][^'"]*content\/routes\/routeRegistry/.test(src),
  );
  check(
    "Features.jsx: renders <Helmet> (or PageSEO)",
    /<Helmet>/.test(src) || /<PageSEO\b/.test(src),
  );
  check("Features.jsx: sets <title>", /<title>[\s\S]*?<\/title>/.test(src) || /title=\{/.test(src));
  check("Features.jsx: sets meta description", /name=["']description["']/.test(src) || /description=\{/.test(src));
  check("Features.jsx: sets canonical link", /rel=["']canonical["']/.test(src) || /canonical=\{/.test(src));
  check("Features.jsx: emits OG metadata", /property=["']og:/.test(src));
  check("Features.jsx: emits Twitter metadata", /name=["']twitter:/.test(src));
}

const appHasFeaturesRoute = /<Route\s+path="\/features"\s+component=\{FeaturesPage\}/.test(app);
check("App.jsx: /features route uses FeaturesPage component", appHasFeaturesRoute);

const healingPage = resolve(ROOT, "client/src/pages/Healing.jsx");
if (!existsSync(healingPage)) {
  fail("Healing.jsx missing");
} else {
  const src = readFileSync(healingPage, "utf8");
  check(
    "Healing.jsx: imports routeRegistry (getRouteMeta)",
    /getRouteMeta\s*\(\s*['"]\/healing['"]/.test(src) ||
      /from\s+['"][^'"]*content\/routes\/routeRegistry/.test(src),
  );
  check(
    "Healing.jsx: renders <Helmet> (or PageSEO)",
    /<Helmet>/.test(src) || /<PageSEO\b/.test(src),
  );
  check("Healing.jsx: sets <title>", /<title>[\s\S]*?<\/title>/.test(src) || /title=\{/.test(src));
  check("Healing.jsx: sets meta description", /name=["']description["']/.test(src) || /description=\{/.test(src));
  check("Healing.jsx: sets canonical link", /rel=["']canonical["']/.test(src) || /canonical=\{/.test(src));
  check("Healing.jsx: emits OG metadata", /property=["']og:/.test(src));
  check("Healing.jsx: emits Twitter metadata", /name=["']twitter:/.test(src));
}

const appHasHealingRoute = /<Route\s+path="\/healing"\s+component=\{HealingPage\}/.test(app);
check("App.jsx: /healing route uses HealingPage component", appHasHealingRoute);

const healingMetaSrc = readFileSync(REGISTRY, "utf8");
const healingBlock = healingMetaSrc.match(/"\/healing"\s*:\s*\{[\s\S]*?\n\s*\}/);
if (!healingBlock) {
  fail("routeRegistry: /healing entry missing");
} else {
  const block = healingBlock[0];
  check("routeRegistry /healing: emotionalIntent present", /emotionalIntent\s*:/.test(block));
  check("routeRegistry /healing: userGoal present", /userGoal\s*:/.test(block));
  check("routeRegistry /healing: platformRole present", /platformRole\s*:/.test(block));
  check("routeRegistry /healing: seoDescription present", /seoDescription\s*:/.test(block));
  check("routeRegistry /healing: canonical present", /canonical\s*:/.test(block));
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
