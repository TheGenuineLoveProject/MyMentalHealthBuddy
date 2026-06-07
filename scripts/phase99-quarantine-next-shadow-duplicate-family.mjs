import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execSync } from "node:child_process";

const OUT = "diagnostics/phase99";
const QUARANTINE = "_quarantine/phase99-shadow-duplicates";
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

const ROOT_SHADOW_PREFIXES = [
  "src/",
  "components/",
  "pages/",
  "api/",
  "app/",
  "auth/"
];

const NEVER_TOUCH_PREFIXES = [
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

const SEARCH_ROOTS = [
  "client/src",
  "server",
  "shared",
  "database",
  "scripts"
];

const EXT_RE = /\.(js|jsx|ts|tsx|mjs|cjs)$/;

function exists(file) {
  return fs.existsSync(file);
}

function isCanonical(file) {
  return CANONICAL_PREFIXES.some((p) => file.startsWith(p));
}

function isRootShadow(file) {
  return ROOT_SHADOW_PREFIXES.some((p) => file === p.slice(0, -1) || file.startsWith(p));
}

function isNeverTouch(file) {
  return NEVER_TOUCH_PREFIXES.some((p) => file === p.slice(0, -1) || file.startsWith(p));
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name).split(path.sep).join("/");
    if (isNeverTouch(full)) continue;
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (EXT_RE.test(full)) {
      out.push(full);
    }
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

const searchFiles = SEARCH_ROOTS.flatMap((root) => walk(root)).filter(exists);

function referenceHits(shadowFile) {
  const bare = shadowFile.replace(/\.(js|jsx|ts|tsx|mjs|cjs)$/i, "");
  const base = path.basename(bare);
  const noRoot = shadowFile.replace(/^(src|components|pages|api|app|auth)\//, "");
  const noRootBare = noRoot.replace(/\.(js|jsx|ts|tsx|mjs|cjs)$/i, "");

  const patterns = [
    shadowFile,
    `/${shadowFile}`,
    `./${shadowFile}`,
    `../${shadowFile}`,
    `../../${shadowFile}`,
    bare,
    `/${bare}`,
    `./${bare}`,
    `../${bare}`,
    `../../${bare}`,
    noRoot,
    noRootBare,
    `from "${base}"`,
    `from '${base}'`,
    `import("${base}")`,
    `import('${base}')`,
  ];

  const hits = [];

  for (const file of searchFiles) {
    if (file === shadowFile) continue;
    const text = read(file);
    if (patterns.some((pattern) => pattern && text.includes(pattern))) {
      hits.push(file);
    }
  }

  return [...new Set(hits)].sort();
}

const families = audit.duplicateFamilies || [];

const evaluated = families
  .map((family) => {
    const liveFiles = family.files.filter(exists).filter((file) => !isNeverTouch(file));
    const canonical = liveFiles.filter(isCanonical);
    const rootShadow = liveFiles.filter(isRootShadow);

    const rootShadowRisks = rootShadow.map((file) => ({
      file,
      references: referenceHits(file),
      sha256: sha256(file),
      bytes: fs.statSync(file).size,
    }));

    return {
      family: family.family,
      liveFiles,
      canonical,
      rootShadow,
      rootShadowRisks,
      safeToQuarantine:
        canonical.length >= 1 &&
        rootShadow.length >= 1 &&
        rootShadowRisks.every((risk) => risk.references.length === 0),
    };
  })
  .filter((family) => family.canonical.length >= 1 && family.rootShadow.length >= 1)
  .sort((a, b) => {
    const scoreA = a.rootShadow.length * 100 + a.canonical.length * 10 - a.rootShadowRisks.reduce((sum, r) => sum + r.references.length, 0);
    const scoreB = b.rootShadow.length * 100 + b.canonical.length * 10 - b.rootShadowRisks.reduce((sum, r) => sum + r.references.length, 0);
    return scoreB - scoreA || a.family.localeCompare(b.family);
  });

fs.writeFileSync(`${OUT}/phase99-evaluated-root-shadow-families.json`, JSON.stringify(evaluated, null, 2));

const selected = evaluated.find((family) => family.safeToQuarantine) || null;
fs.writeFileSync(`${OUT}/phase99-selected-family.json`, JSON.stringify(selected, null, 2));

if (!selected) {
  const md = [
    "# Phase 99 Root Shadow Duplicate Quarantine",
    "",
    "## Result",
    "No additional root shadow duplicate family passed the strict quarantine gate.",
    "",
    "## Rules Enforced",
    "- No backup folders touched.",
    "- No npm/global/cache files touched.",
    "- No active canonical files touched.",
    "- No file moved if any active-runtime reference was detected.",
    "",
    "## Next Safe Step",
    "Review `diagnostics/phase99/phase99-evaluated-root-shadow-families.json` and plan one explicit import rewrite if needed.",
    "",
  ].join("\n");

  fs.writeFileSync("docs/architecture/PHASE99_ROOT_SHADOW_DUPLICATE_QUARANTINE.md", md);
  console.log("PHASE99_NO_SAFE_ROOT_SHADOW_DUPLICATE_TO_QUARANTINE");
  process.exit(0);
}

const moved = [];

for (const shadowFile of selected.rootShadow) {
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
    throw new Error(`Hash mismatch after move: ${shadowFile}`);
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
  rootShadowRisks: selected.rootShadowRisks,
  rule: "Only root shadow duplicate files with zero active-runtime references were moved.",
};

fs.writeFileSync(`${OUT}/phase99-quarantine-report.json`, JSON.stringify(report, null, 2));

const md = [
  "# Phase 99 Root Shadow Duplicate Quarantine",
  "",
  "## Result",
  "One additional verified root shadow duplicate family was quarantined.",
  "",
  "## Family",
  selected.family,
  "",
  "## Canonical Owner Files",
  ...selected.canonical.map((file) => `- ${file}`),
  "",
  "## Quarantined Root Shadow Files",
  ...moved.map((item) => `- ${item.from} → ${item.to}`),
  "",
  "## Safety Rules Enforced",
  "- One duplicate family only.",
  "- Root shadow files only.",
  "- Canonical owner files preserved.",
  "- Backup/cache/npm-global noise ignored.",
  "- Zero active-runtime references required before move.",
  "- SHA-256 verified before and after quarantine.",
  "- Build verification required after move.",
  "",
  "## Rollback",
  "Move the quarantined file(s) back from `_quarantine/phase99-shadow-duplicates/` to the original path(s), or run:",
  "",
  "```bash",
  "git restore --source=HEAD~1 -- .",
  "```",
  "",
].join("\n");

fs.writeFileSync("docs/architecture/PHASE99_ROOT_SHADOW_DUPLICATE_QUARANTINE.md", md);

console.log("PHASE99_ROOT_SHADOW_DUPLICATE_QUARANTINE_COMPLETE");
console.log(JSON.stringify({
  selectedFamily: selected.family,
  canonicalOwners: selected.canonical,
  movedCount: moved.length,
}, null, 2));
