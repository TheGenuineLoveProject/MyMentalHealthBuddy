#!/usr/bin/env node
/**
 * deepScan.mjs - Deep duplicate detection for pages, components, and registry
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();

const CLIENT_DIR = path.join(ROOT, "client", "src");
const PAGES_DIR = path.join(CLIENT_DIR, "pages");
const COMPONENTS_DIR = path.join(CLIENT_DIR, "components");
const META_DIR = path.join(CLIENT_DIR, "content", "meta");
const REPORT_DIR = path.join(ROOT, "scripts");
const OUT = path.join(REPORT_DIR, ".deep-scan-report.json");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts|jsx|js)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function readFile(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

function sha(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function normalizeForDupes(code) {
  return (code || "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/\s+/g, " ")
    .replace(/["'`](?:\\.|[^"'`])*["'`]/g, '"STR"')
    .trim();
}

function findHardcodedDupBlocks(code) {
  const flags = [];
  const needles = [
    "not therapy",
    "not medical advice",
    "By using this platform, you confirm you are 18+",
    "Next best step",
    "How this helps",
    "Benefits",
  ];
  for (const n of needles) {
    if ((code || "").toLowerCase().includes(n.toLowerCase())) flags.push(n);
  }
  return flags;
}

function safeRel(p) {
  return path.relative(ROOT, p).replace(/\\/g, "/");
}

function loadRegistryText() {
  const p = path.join(META_DIR, "routeMetaRegistry.ts");
  return { file: safeRel(p), text: readFile(p) };
}

function extractCanonicalPathLiterals(registryText) {
  const re = /canonicalPath\s*:\s*["'`]([^"'`]+)["'`]/g;
  const out = [];
  let m;
  while ((m = re.exec(registryText))) out.push(m[1]);
  return out;
}

function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const pages = walk(PAGES_DIR);
  const comps = walk(COMPONENTS_DIR);

  const pageHashes = new Map();
  const nearDupBuckets = new Map();

  const hardcodedBlocks = [];
  const exactDupPages = [];

  for (const file of pages) {
    const raw = readFile(file);
    const norm = normalizeForDupes(raw);
    const h = sha(norm);

    if (pageHashes.has(h)) {
      exactDupPages.push({ hash: h, a: pageHashes.get(h), b: safeRel(file) });
    } else {
      pageHashes.set(h, safeRel(file));
    }

    const key = norm.slice(0, 120);
    if (!nearDupBuckets.has(key)) nearDupBuckets.set(key, []);
    nearDupBuckets.get(key).push(safeRel(file));

    const flags = findHardcodedDupBlocks(raw);
    if (flags.length) hardcodedBlocks.push({ file: safeRel(file), flags });
  }

  const nearDupPages = Array.from(nearDupBuckets.entries())
    .filter(([, files]) => files.length >= 3)
    .slice(0, 200)
    .map(([sig, files]) => ({ signature: sig.slice(0, 60), files }));

  const compHashes = new Map();
  const exactDupComponents = [];
  for (const file of comps) {
    const raw = readFile(file);
    const norm = normalizeForDupes(raw);
    const h = sha(norm);
    if (compHashes.has(h)) exactDupComponents.push({ hash: h, a: compHashes.get(h), b: safeRel(file) });
    else compHashes.set(h, safeRel(file));
  }

  const reg = loadRegistryText();
  const canonicalPaths = extractCanonicalPathLiterals(reg.text);
  const canonMap = {};
  for (const p of canonicalPaths) canonMap[p] = (canonMap[p] || 0) + 1;
  const dupCanon = Object.entries(canonMap)
    .filter(([, n]) => n >= 2)
    .map(([p, n]) => ({ canonicalPath: p, count: n }))
    .slice(0, 200);

  const report = {
    generatedAt: new Date().toISOString(),
    counts: {
      pages: pages.length,
      components: comps.length,
      exactDupPages: exactDupPages.length,
      nearDupGroups: nearDupPages.length,
      hardcodedDupBlocks: hardcodedBlocks.length,
      exactDupComponents: exactDupComponents.length,
      dupCanonicalPathsInRegistryHeuristic: dupCanon.length,
    },
    exactDupPages: exactDupPages.slice(0, 50),
    nearDupPages: nearDupPages.slice(0, 50),
    hardcodedDupBlocks: hardcodedBlocks.slice(0, 50),
    exactDupComponents: exactDupComponents.slice(0, 50),
    registryHeuristic: {
      file: reg.file,
      dupCanonicalPaths: dupCanon,
      note: "Heuristic only; true registry parse is not performed in this script.",
    },
    actionRules: [
      "If hardcodedDupBlocks > 0, replace in pages with shared components only (SafetyFooter/BenefitsBlock/RelatedLinksBlock).",
      "If exactDupPages > 0, keep ONE canonical file; others become thin wrappers using PageTemplate or redirect routes.",
      "If nearDupGroups > 0, convert to registry-driven meta + single template page.",
      "If dupCanonicalPathsInRegistryHeuristic > 0, ensure each canonicalPath is unique or intentionally aliased.",
    ],
  };

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(`Deep scan report -> ${safeRel(OUT)}`);
  console.log(`Counts:`, report.counts);
}

main();
