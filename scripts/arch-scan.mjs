import fs from "node:fs";
import path from "node:path";
import { walkFiles } from "./_lib_walk.mjs";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "reports", "arch");
const OUT_JSON = path.join(OUT_DIR, "latest.json");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function main() {
  ensureDir(OUT_DIR);

  const files = walkFiles(ROOT, { exts: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".md"] })
    .map(f => path.relative(ROOT, f));

  const has = (p) => files.includes(p);

  const report = {
    generatedAt: new Date().toISOString(),
    checks: {
      hasPackageJson: has("package.json"),
      hasReplit: has(".replit"),
      hasReplitNix: has("replit.nix"),
      hasDocsBatchesDir: fs.existsSync(path.join(ROOT, "docs", "process-engine", "batches")),
      hasReportsDir: fs.existsSync(path.join(ROOT, "reports")),
    },
    notes: [],
  };

  if (!report.checks.hasPackageJson) report.notes.push("Missing package.json");
  if (!report.checks.hasReplit) report.notes.push("Missing .replit (Replit runtime config)");
  if (!report.checks.hasReplitNix) report.notes.push("Missing replit.nix (env pinning) — may be required");
  if (!report.checks.hasDocsBatchesDir) report.notes.push("Missing docs/process-engine/batches directory");

  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));

  console.log("arch-scan:", report.checks);
  if (report.notes.length) {
    console.log("arch-scan: WARN:", report.notes.join(" | "));
    process.exitCode = 1;
  } else {
    console.log("arch-scan: PASS.");
  }
}

main();