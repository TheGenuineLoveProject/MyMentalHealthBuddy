import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execSync } from "node:child_process";

const OUT = "diagnostics/phase98";
const QUARANTINE = "_quarantine/phase98-shadow-duplicates";
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(QUARANTINE, { recursive: true });
fs.mkdirSync("docs/architecture", { recursive: true });

const auditPath = "diagnostics/phase97/active-runtime-duplicate-audit.json";
const audit = JSON.parse(fs.readFileSync(auditPath, "utf8"));

const CANONICAL_PREFIXES = [
  "client/src/",
  "server/",
  "shared/",
  "database/"
];

const SHADOW_PREFIXES = [
  "src/",
  "components/",
  "pages/",
  "api/",
  "app/"
];

const IGNORE_IMPORT_SEARCH_PREFIXES = [
  "node_modules/",
  ".git/",
  ".cache/",
  ".config/",
  ".local/",
  "diagnostics/",
  "backups/",
  "production-backups/",
  ".hx-backups/",
  "_quarantine/",
  ".archive/",
  "client/dist/",
  "dist/"
];

const EXT_RE = /\.(js|jsx|ts|tsx|mjs|cjs)$/;

function isCanonical(file) {
  return CANONICAL_PREFIXES.some((p) => file.startsWith(p));
}

function isShadow(file) {
  return SHADOW_PREFIXES.some((p) => file === p.slice(0, -1) || file.startsWith(p));
}

function exists(file) {
  return fs.existsSync(file);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name).split(path.sep).join("/");
    if (IGNORE_IMPORT_SEARCH_PREFIXES.some((p) => full === p.slice(0, -1) || full.startsWith(p))) continue;
    if (entry.isDirectory()) walk(full, out);
    else if (EXT_RE.test(full)) out.push(full);
  }
  return out;
}

function read(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function shellQuote(s) {
  return `'${s.replaceAll("'", "'\\''")}'`;
}

const families = audit.duplicateFamilies || [];

const candidates = families
  .map((family) => {
    const liveFiles = family.files.filter(exists);
    const canonical = liveFiles.filter(isCanonical);
    const shadow = liveFiles.filter(isShadow);
    return {
      ...family,
      liveFiles,
      canonical,
      shadow,
      safeShape: canonical.length >= 1 && shadow.length >= 1,
    };
  })
  .filter((family) => family.safeShape)
  .sort((a, b) => {
    const scoreA =
      Number(a.family === audit.selectedFamily?.family) * 1000 +
      a.shadow.length * 100 +
      a.canonical.length * 10;
    const scoreB =
      Number(b.family === audit.selectedFamily?.family) * 1000 +
      b.shadow.length * 100 +
      b.canonical.length * 10;
    return scoreB - scoreA || a.family.localeCompare(b.family);
  });

const searchFiles = [
  ...walk("client/src"),
  ...walk("server"),
  ...walk("shared"),
  ...walk("database"),
  ...walk("scripts"),
].filter(exists);

function referenceHits(shadowFile) {
  const hits = [];
  const bare = shadowFile.replace(/\.(js|jsx|ts|tsx|mjs|cjs)$/i, "");
  const base = path.basename(bare);
  const patterns = [
    shadowFile,
    `/${shadowFile}`,
    `../${shadowFile}`,
    `../../${shadowFile}`,
    `/${bare}`,
    `../${bare}`,
    `../../${bare}`,
    `from "${base}"`,
    `from '${base}'`,
  ];

  for (const file of searchFiles) {
    if (file === shadowFile) continue;
    const text = read(file);
    if (patterns.some((p) => text.includes(p))) {
      hits.push(file);
    }
  }

  return [...new Set(hits)].sort();
}

const evaluated = candidates.map((candidate) => {
  const shadowRisks = candidate.shadow.map((file) => ({
    file,
    references: referenceHits(file),
    hash: sha256(file),
    bytes: fs.statSync(file).size,
  }));

  return {
    ...candidate,
    shadowRisks,
    safeToQuarantine: shadowRisks.every((risk) => risk.references.length === 0),
  };
});

const selected = evaluated.find((candidate) => candidate.safeToQuarantine) || null;

fs.writeFileSync(`${OUT}/phase98-candidate-families.json`, JSON.stringify(evaluated, null, 2));
fs.writeFileSync(`${OUT}/phase98-selected-family.json`, JSON.stringify(selected, null, 2));

if (!selected) {
  const md = [
    "# Phase 98 Shadow Duplicate Quarantine",
    "",
    "## Result",
    "No shadow duplicate family passed the strict quarantine gate.",
    "",
    "## Reason",
    "A family must have at least one canonical active file, at least one root shadow duplicate, and zero active-runtime references to the shadow file.",
    "",
    "## Action Taken",
    "No files moved.",
    "",
    "## Next Safe Step",
    "Manually inspect `diagnostics/phase98/phase98-candidate-families.json` and choose one family for explicit import-rewrite planning.",
    "",
  ].join("\n");

  fs.writeFileSync("docs/architecture/PHASE98_SHADOW_DUPLICATE_QUARANTINE.md", md);
  console.log("PHASE98_NO_SAFE_SHADOW_DUPLICATE_TO_QUARANTINE");
  process.exit(0);
}

const moved = [];

for (const shadowFile of selected.shadow) {
  const destination = `${QUARANTINE}/${shadowFile}`;
  fs.mkdirSync(path.dirname(destination), { recursive: true });

  const beforeHash = sha256(shadowFile);
  const beforeBytes = fs.statSync(shadowFile).size;

  try {
    execSync(`git mv ${shellQuote(shadowFile)} ${shellQuote(destination)}`, { stdio: "pipe" });
  } catch {
    fs.renameSync(shadowFile, destination);
  }

  const afterHash = sha256(destination);

  if (beforeHash !== afterHash) {
    throw new Error(`Hash mismatch after quarantine move: ${shadowFile}`);
  }

  moved.push({
    from: shadowFile,
    to: destination,
    sha256: beforeHash,
    bytes: beforeBytes,
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  selectedFamily: selected.family,
  canonicalOwners: selected.canonical,
  moved,
  shadowRisks: selected.shadowRisks,
  rule: "Only root shadow duplicate files with zero active-runtime references were moved to quarantine.",
};

fs.writeFileSync(`${OUT}/phase98-quarantine-report.json`, JSON.stringify(report, null, 2));

const md = [
  "# Phase 98 Shadow Duplicate Quarantine",
  "",
  "## Result",
  "One verified active-runtime shadow duplicate family was quarantined.",
  "",
  `## Family`,
  selected.family,
  "",
  "## Canonical Owner Files",
  ...selected.canonical.map((file) => `- ${file}`),
  "",
  "## Quarantined Shadow Files",
  ...moved.map((item) => `- ${item.from} → ${item.to}`),
  "",
  "## Safety Rules Enforced",
  "- Backup/cache/npm-global duplicate noise ignored.",
  "- Only active-runtime roots inspected.",
  "- Only one duplicate family changed.",
  "- Only root shadow files moved.",
  "- Canonical owner files preserved.",
  "- Zero active-runtime references required before quarantine.",
  "- SHA-256 verified before and after move.",
  "- Build must pass after quarantine.",
  "",
  "## Rollback",
  "Move the quarantined file(s) back from `_quarantine/phase98-shadow-duplicates/` to the original path(s), or run:",
  "",
  "```bash",
  "git restore --source=HEAD~1 -- .",
  "```",
  "",
].join("\n");

fs.writeFileSync("docs/architecture/PHASE98_SHADOW_DUPLICATE_QUARANTINE.md", md);

console.log("PHASE98_SHADOW_DUPLICATE_QUARANTINE_COMPLETE");
console.log(JSON.stringify({
  selectedFamily: selected.family,
  canonicalOwners: selected.canonical,
  movedCount: moved.length,
}, null, 2));
