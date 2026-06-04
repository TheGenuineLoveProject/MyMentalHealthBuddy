import fs from "node:fs";
import path from "node:path";

const assetsDir = "client/dist/assets";
const outJson = "registry/performance/bundle-budget-audit.json";
const outMd = "docs/reports/PHASE_103_BUNDLE_BUDGET_GUARDRAIL.md";

const limits = {
  jsWarnKB: 180,
  jsFailKB: 350,
  cssWarnKB: 80,
  cssFailKB: 160,
  assetWarnKB: 500,
  assetFailKB: 1500
};

function kb(bytes) {
  return Math.round((bytes / 1024) * 100) / 100;
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(assetsDir).map((file) => {
  const sizeKB = kb(fs.statSync(file).size);
  const ext = path.extname(file);
  let type = "asset";
  if (ext === ".js") type = "js";
  if (ext === ".css") type = "css";

  const warn =
    (type === "js" && sizeKB >= limits.jsWarnKB) ||
    (type === "css" && sizeKB >= limits.cssWarnKB) ||
    (type === "asset" && sizeKB >= limits.assetWarnKB);

  const fail =
    (type === "js" && sizeKB >= limits.jsFailKB) ||
    (type === "css" && sizeKB >= limits.cssFailKB) ||
    (type === "asset" && sizeKB >= limits.assetFailKB);

  return { file, type, sizeKB, warn, fail };
}).sort((a, b) => b.sizeKB - a.sizeKB);

const summary = {
  generatedAt: new Date().toISOString(),
  limits,
  totalFiles: files.length,
  warnings: files.filter(f => f.warn).length,
  failures: files.filter(f => f.fail).length,
  largest: files.slice(0, 25)
};

fs.writeFileSync(outJson, JSON.stringify(summary, null, 2));

const md = `# Phase 103 — Bundle Budget Guardrail

## Purpose
Prevent future bundle bloat while preserving current runtime stability.

## Status
- Total built assets scanned: ${summary.totalFiles}
- Warning-size assets: ${summary.warnings}
- Failure-size assets: ${summary.failures}

## Budget Limits
| Type | Warn | Fail |
|---|---:|---:|
| JS | ${limits.jsWarnKB} KB | ${limits.jsFailKB} KB |
| CSS | ${limits.cssWarnKB} KB | ${limits.cssFailKB} KB |
| Other assets | ${limits.assetWarnKB} KB | ${limits.assetFailKB} KB |

## Largest Assets
| File | Type | Size KB | Status |
|---|---|---:|---|
${summary.largest.map(f => `| ${f.file} | ${f.type} | ${f.sizeKB} | ${f.fail ? "FAIL" : f.warn ? "WARN" : "OK"} |`).join("\n")}

## Governance Rule
No new large user-facing bundle may be added without:
1. lazy-loading,
2. route ownership,
3. documented reason,
4. verified build,
5. production health check.

## Safety
No source files were modified by this audit.
`;

fs.writeFileSync(outMd, md);

console.log("Bundle budget audit complete");
console.log(JSON.stringify({
  totalFiles: summary.totalFiles,
  warnings: summary.warnings,
  failures: summary.failures
}, null, 2));
