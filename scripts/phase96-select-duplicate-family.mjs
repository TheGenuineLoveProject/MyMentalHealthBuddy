import fs from "node:fs";
import path from "node:path";

fs.mkdirSync("diagnostics/phase96", { recursive: true });
fs.mkdirSync("docs/architecture", { recursive: true });

const families = [
  "Button",
  "Card",
  "StateTracker",
  "ReflectionFooter",
  "UpsellModal",
  "BehaviorChangePage",
  "Privacy",
];

function findFiles(dir, matcher, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (
      full.includes("node_modules") ||
      full.includes(".git") ||
      full.includes("client/dist") ||
      full.includes("diagnostics") ||
      full.includes(".local")
    ) continue;

    if (entry.isDirectory()) {
      findFiles(full, matcher, out);
    } else if (matcher(full)) {
      out.push(full);
    }
  }
  return out;
}

const results = [];

for (const family of families) {
  const files = findFiles(".", (file) => {
    const base = path.basename(file);
    return base === `${family}.jsx` ||
      base === `${family}.tsx` ||
      base === `${family}.js` ||
      base === `${family}.ts` ||
      base.includes(family);
  }).sort();

  const imports = findFiles(".", (file) => /\.(js|jsx|ts|tsx|mjs)$/.test(file))
    .filter((file) => {
      try {
        return fs.readFileSync(file, "utf8").includes(family);
      } catch {
        return false;
      }
    })
    .sort();

  results.push({
    family,
    fileCount: files.length,
    importMentionCount: imports.length,
    files,
    importMentions: imports,
    riskScore: files.length * 2 + imports.length,
  });
}

results.sort((a, b) => {
  if (a.fileCount !== b.fileCount) return b.fileCount - a.fileCount;
  return a.importMentionCount - b.importMentionCount;
});

const preferred = results.find((item) => item.family === "Button" && item.fileCount > 1)
  || results.find((item) => item.fileCount > 1)
  || results[0];

const md = [
  "# Phase 96 Duplicate Family Selection",
  "",
  "Purpose: select exactly one duplicate family for the next safe canonicalization plan.",
  "",
  "## Selected Family",
  "",
  `Selected: **${preferred.family}**`,
  "",
  "Reason:",
  "- Common UI primitive or known duplicate family.",
  "- High leverage for reducing design-system drift.",
  "- Must be planned before mutation.",
  "",
  "## Family Inventory",
  "",
  "| Family | File Count | Import Mention Count | Risk Score |",
  "|---|---:|---:|---:|",
  ...results.map((item) => `| ${item.family} | ${item.fileCount} | ${item.importMentionCount} | ${item.riskScore} |`),
  "",
  "## Selected Files",
  "",
  ...preferred.files.map((file) => `- ${file}`),
  "",
  "## Selected Import Mentions",
  "",
  ...preferred.importMentions.map((file) => `- ${file}`),
  "",
  "## Boundary",
  "",
  "- No files deleted.",
  "- No imports changed.",
  "- No component rewritten.",
  "- No runtime mutation.",
  "",
  "## Next Safe Step",
  "",
  "Phase 97 should inspect the selected family only and decide canonical owner, quarantine candidate, and rollback plan.",
  "",
].join("\n");

fs.writeFileSync("diagnostics/phase96/duplicate-family-selection.json", JSON.stringify({ selected: preferred, all: results }, null, 2));
fs.writeFileSync("docs/architecture/PHASE96_DUPLICATE_FAMILY_SELECTION.md", md);
fs.writeFileSync("diagnostics/phase96/status-summary.md", md);

console.log(JSON.stringify({ selected: preferred.family, fileCount: preferred.fileCount, importMentionCount: preferred.importMentionCount }, null, 2));

if (!preferred || preferred.fileCount < 1) process.exit(1);
