/**
 * brand-rename.mjs
 * Safe codemod: replaces legacy name strings with TheGenuineLoveProject.
 * Creates backup: <file>.bak
 */

import fs from "fs";
import path from "path";

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "_chatgpt_bundle",
  "archive_DO_NOT_DELETE",
]);

const TARGET_ROOTS = new Set(["client", "server", "docs", "public", "brand", "README.md"]);

const REPLACEMENTS = [
  ["MyMentalHealthBuddy", "TheGenuineLoveProject"],
  ["mymentalhealthbuddy", "thegenuineloveproject"],
];

function normalize(p) {
  return p.replace(/\\/g, "/");
}

function shouldScan(fullPath) {
  const n = normalize(fullPath);
  if (n.endsWith("README.md")) return true;
  const top = n.split("/").filter(Boolean)[0];
  return TARGET_ROOTS.has(top);
}

function walk(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (SKIP_DIRS.has(item)) continue;
      walk(full);
      continue;
    }

    const n = normalize(full);
    if (!shouldScan(n)) continue;
    if (!/\.(md|js|jsx|css|html)$/i.test(item) && item !== "README.md") continue;

    const before = fs.readFileSync(full, "utf8");
    let after = before;

    for (const [from, to] of REPLACEMENTS) {
      after = after.split(from).join(to);
    }

    if (after !== before) {
      fs.writeFileSync(full + ".bak", before, "utf8");
      fs.writeFileSync(full, after, "utf8");
      console.log(`✅ Renamed legacy text in: ${n}`);
    }
  }
}

walk(process.cwd());
console.log("✅ Rename pass complete.");