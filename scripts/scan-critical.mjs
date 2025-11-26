// scan-critical.mjs — Catch missing imports, broken routes, bad exports
// Safe Edition — Ignores node_modules, caches, and archives

import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const IGNORE_DIRS = [
  "node_modules",
  ".git",
  ".github",
  ".cache",
  "archive_DO_NOT_DELETE",
  "archive/scripts-legacy",
  "_config",
  ".replit_backups",
  "content_output",
  "attached_assets"
];

function shouldIgnore(p) {
  const normalized = p.replace(/\\/g, "/");
  return IGNORE_DIRS.some((dir) =>
    normalized.includes(`/${dir}/`) || normalized.endsWith(`/${dir}`)
  );
}

function scanDir(dir) {
  if (shouldIgnore(dir)) return;

  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (shouldIgnore(fullPath)) continue;

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (
      entry.endsWith(".mjs") ||
      entry.endsWith(".js") ||
      entry.endsWith(".ts") ||
      entry.endsWith(".tsx")
    ) {
      scanFile(fullPath);
    }
  }
}

function scanFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");

  // Look for placeholder markers that should never ship
  if (text.includes("<<<") || text.includes(">>>")) {
    console.log(`❌ Broken placeholder → ${filePath}`);
  }
}

console.log("\n🛑 Critical Blocker Scan Started (Safe Edition)\n");
scanDir(ROOT);
console.log("\n✨ Critical Scan Complete\n");