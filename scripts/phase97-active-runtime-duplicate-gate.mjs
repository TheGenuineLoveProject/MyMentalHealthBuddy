import fs from "node:fs";
import path from "node:path";

const OUT_DIR = "diagnostics/phase97";
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync("docs/architecture", { recursive: true });

const EXCLUDED_PARTS = new Set([
  ".git",
  "node_modules",
  ".cache",
  ".config",
  ".local",
  "diagnostics",
  "client/dist",
  "dist",
  "backups",
  "production-backups",
  ".hx-backups",
  ".archive",
  "_archive",
  "_quarantine",
  "coverage",
  ".tmp_drizzle",
]);

const ACTIVE_ROOTS = [
  "client/src",
  "server",
  "shared",
  "database",
  "scripts",
  "src",
  "components",
  "pages",
  "api",
  "app",
];

const SHADOW_ROOTS = [
  "src",
  "components",
  "pages",
  "api",
  "app",
];

const EXT_RE = /\.(js|jsx|ts|tsx|mjs|cjs)$/;

function normalize(p) {
  return p.split(path.sep).join("/");
}

function isExcluded(file) {
  const n = normalize(file);
  return [...EXCLUDED_PARTS].some((part) => n === part || n.startsWith(`${part}/`) || n.includes(`/${part}/`));
}

function existsDir(dir) {
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

function walk(dir, out = []) {
  if (!existsDir(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = normalize(path.join(dir, entry.name));
    if (isExcluded(full)) continue;
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function activeFiles() {
  const seen = new Set();
  const files = [];
  for (const root of ACTIVE_ROOTS) {
    if (!existsDir(root)) continue;
    for (const file of walk(root)) {
      if (!EXT_RE.test(file)) continue;
      if (seen.has(file)) continue;
      seen.add(file);
      files.push(file);
    }
  }
  return files.sort();
}

function baseName(file) {
  return path.basename(file).replace(/\.(js|jsx|ts|tsx|mjs|cjs)$/i, "");
}

function read(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

const files = activeFiles();

const byBase = new Map();
for (const file of files) {
  const base = baseName(file);
  if (!byBase.has(base)) byBase.set(base, []);
  byBase.get(base).push(file);
}

const duplicateFamilies = [...byBase.entries()]
  .filter(([, group]) => group.length > 1)
  .map(([family, group]) => ({
    family,
    fileCount: group.length,
    files: group.sort(),
    hasClientSrc: group.some((f) => f.startsWith("client/src/")),
    hasServer: group.some((f) => f.startsWith("server/")),
    hasRootShadow: group.some((f) => SHADOW_ROOTS.some((root) => f === root || f.startsWith(`${root}/`))),
    hasJsxTsxPair: new Set(group.map((f) => path.extname(f))).size > 1,
  }))
  .sort((a, b) => {
    const scoreA = Number(a.hasRootShadow) * 50 + Number(a.hasJsxTsxPair) * 25 + a.fileCount;
    const scoreB = Number(b.hasRootShadow) * 50 + Number(b.hasJsxTsxPair) * 25 + b.fileCount;
    return scoreB - scoreA || a.family.localeCompare(b.family);
  });

const shadowTrees = SHADOW_ROOTS
  .filter(existsDir)
  .map((root) => ({
    root,
    files: walk(root).filter((file) => EXT_RE.test(file)).sort(),
  }));

const canonicalSearchFiles = files.filter((file) =>
  file.startsWith("client/src/") ||
  file.startsWith("server/") ||
  file.startsWith("shared/") ||
  file.startsWith("database/")
);

const shadowImportRisks = [];
for (const shadow of shadowTrees) {
  for (const file of shadow.files) {
    const name = baseName(file);
    const mentions = [];
    for (const candidate of canonicalSearchFiles) {
      const text = read(candidate);
      if (
        text.includes(`/${file}`) ||
        text.includes(`../${file}`) ||
        text.includes(`../../${file}`) ||
        text.includes(`from "${name}"`) ||
        text.includes(`from '${name}'`) ||
        text.includes(`/${name}`)
      ) {
        mentions.push(candidate);
      }
    }
    shadowImportRisks.push({
      shadowFile: file,
      family: name,
      canonicalMentions: mentions.sort(),
    });
  }
}

const selected =
  duplicateFamilies.find((item) => item.hasRootShadow && item.hasClientSrc) ||
  duplicateFamilies.find((item) => item.hasJsxTsxPair && item.hasClientSrc) ||
  duplicateFamilies.find((item) => item.hasClientSrc) ||
  duplicateFamilies[0] ||
  null;

const activeAudit = {
  generatedAt: new Date().toISOString(),
  activeRoots: ACTIVE_ROOTS.filter(existsDir),
  excludedParts: [...EXCLUDED_PARTS],
  activeFileCount: files.length,
  duplicateFamilyCount: duplicateFamilies.length,
  shadowTreeCount: shadowTrees.length,
  selectedFamily: selected,
  duplicateFamilies,
  shadowTrees,
  shadowImportRisks,
};

fs.writeFileSync(`${OUT_DIR}/active-runtime-files.txt`, files.join("\n") + "\n");
fs.writeFileSync(`${OUT_DIR}/active-duplicate-families.json`, JSON.stringify(duplicateFamilies, null, 2));
fs.writeFileSync(`${OUT_DIR}/shadow-root-trees.json`, JSON.stringify(shadowTrees, null, 2));
fs.writeFileSync(`${OUT_DIR}/shadow-import-risks.json`, JSON.stringify(shadowImportRisks, null, 2));
fs.writeFileSync(`${OUT_DIR}/active-runtime-duplicate-audit.json`, JSON.stringify(activeAudit, null, 2));

const duplicateMd = duplicateFamilies.length
  ? duplicateFamilies.map((item) => [
      `## ${item.family}`,
      `- File count: ${item.fileCount}`,
      `- Has client/src: ${item.hasClientSrc ? "yes" : "no"}`,
      `- Has server: ${item.hasServer ? "yes" : "no"}`,
      `- Has root shadow: ${item.hasRootShadow ? "yes" : "no"}`,
      `- Has JSX/TSX/JS/TS mix: ${item.hasJsxTsxPair ? "yes" : "no"}`,
      "",
      ...item.files.map((file) => `  - ${file}`),
      "",
    ].join("\n")).join("\n")
  : "No active-runtime duplicate families detected.\n";

const plan = [
  "# Phase 97 Active-Runtime Duplicate Ownership Gate",
  "",
  "## Objective",
  "Replace noisy duplicate scans with an active-runtime-only ownership audit.",
  "",
  "## Why",
  "The previous broad duplicate report included backup trees, cache folders, npm-global packages, historical snapshots, and generated artifacts. That noise makes canonical cleanup unsafe.",
  "",
  "## Active Runtime Roots",
  ...ACTIVE_ROOTS.filter(existsDir).map((root) => `- ${root}`),
  "",
  "## Excluded Noise Roots",
  ...[...EXCLUDED_PARTS].map((root) => `- ${root}`),
  "",
  "## Counts",
  `- Active runtime files scanned: ${files.length}`,
  `- Active duplicate families found: ${duplicateFamilies.length}`,
  `- Root shadow trees found: ${shadowTrees.length}`,
  "",
  "## Selected Next Candidate",
  selected
    ? `Selected: **${selected.family}**`
    : "Selected: **NONE**",
  "",
  selected
    ? selected.files.map((file) => `- ${file}`).join("\n")
    : "- No selected duplicate family.",
  "",
  "## Boundary",
  "- No files deleted.",
  "- No imports rewritten.",
  "- No routes changed.",
  "- No component rewritten.",
  "- No quarantine performed.",
  "",
  "## Next Safe Step",
  "Phase 98 should inspect only the selected family and produce a canonical owner + rollback-safe mutation plan.",
  "",
  "# Active Duplicate Families",
  "",
  duplicateMd,
].join("\n");

fs.writeFileSync("docs/architecture/PHASE97_ACTIVE_RUNTIME_DUPLICATE_OWNERSHIP.md", plan);
fs.writeFileSync(`${OUT_DIR}/status-summary.md`, plan);

const failures = [];
if (files.some((file) => file.includes("node_modules/"))) failures.push("NODE_MODULES_INCLUDED");
if (files.some((file) => file.includes(".cache/"))) failures.push("CACHE_INCLUDED");
if (files.some((file) => file.includes(".config/"))) failures.push("CONFIG_INCLUDED");
if (files.some((file) => file.includes("backups/"))) failures.push("BACKUPS_INCLUDED");
if (files.some((file) => file.includes("production-backups/"))) failures.push("PRODUCTION_BACKUPS_INCLUDED");
if (files.some((file) => file.includes(".hx-backups/"))) failures.push("HX_BACKUPS_INCLUDED");
if (files.some((file) => file.includes("diagnostics/"))) failures.push("DIAGNOSTICS_INCLUDED");

if (failures.length) {
  console.log("ACTIVE_RUNTIME_DUPLICATE_GATE_FAIL");
  for (const failure of failures) console.log(failure);
  process.exit(1);
}

console.log("ACTIVE_RUNTIME_DUPLICATE_GATE_PASS");
console.log(JSON.stringify({
  activeFileCount: files.length,
  duplicateFamilyCount: duplicateFamilies.length,
  shadowTreeCount: shadowTrees.length,
  selectedFamily: selected?.family || null,
}, null, 2));
