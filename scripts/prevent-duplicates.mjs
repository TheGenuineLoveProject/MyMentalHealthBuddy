#!/usr/bin/env node

/**
 * Duplicate Prevention Scanner
 * 
 * Scans for duplicate files, routes, and component names.
 * Designed for CI/pre-commit use (non-blocking by default).
 * 
 * Usage:
 *   node scripts/prevent-duplicates.mjs           # Non-blocking (warnings only)
 *   node scripts/prevent-duplicates.mjs --strict   # Blocking (exit 1 on duplicates)
 */

import { readdirSync, statSync, readFileSync } from "fs";
import { join, basename, extname, relative } from "path";
import { createHash } from "crypto";

const ROOT = process.cwd();
const STRICT = process.argv.includes("--strict");

const SCAN_DIRS = [
  "server/routes",
  "server/middleware",
  "server/services",
  "server/utils",
  "client/src/pages",
  "client/src/components",
  "client/src/hooks",
];

const IGNORE_DIRS = ["node_modules", ".git", "dist", ".cache", "attached_assets"];
const CODE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);

let totalWarnings = 0;
let totalErrors = 0;

function walkDir(dir, results = []) {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      if (IGNORE_DIRS.includes(entry)) continue;
      try {
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          walkDir(fullPath, results);
        } else if (CODE_EXTENSIONS.has(extname(entry))) {
          results.push(fullPath);
        }
      } catch { /* skip inaccessible files */ }
    }
  } catch { /* skip inaccessible dirs */ }
  return results;
}

function hashFile(filePath) {
  try {
    const content = readFileSync(filePath, "utf-8");
    return createHash("sha256").update(content).digest("hex").slice(0, 16);
  } catch {
    return null;
  }
}

function normalizeComponentName(filename) {
  return basename(filename)
    .replace(/\.(jsx?|tsx?|mjs|cjs)$/, "")
    .replace(/\.module$/, "")
    .replace(/\.test$/, "")
    .replace(/\.spec$/, "")
    .toLowerCase();
}

function checkDuplicateFileNames() {
  console.log("\n--- Duplicate File Name Check ---");
  const nameMap = new Map();

  for (const dir of SCAN_DIRS) {
    const fullDir = join(ROOT, dir);
    const files = walkDir(fullDir);
    for (const file of files) {
      const name = normalizeComponentName(file);
      const rel = relative(ROOT, file);
      if (!nameMap.has(name)) nameMap.set(name, []);
      nameMap.get(name).push(rel);
    }
  }

  let found = 0;
  for (const [name, files] of nameMap) {
    if (files.length > 1) {
      const inSameDir = new Set(files.map(f => f.split("/").slice(0, -1).join("/")));
      if (inSameDir.size < files.length) {
        console.log(`  WARN: "${name}" appears ${files.length} times:`);
        files.forEach(f => console.log(`    - ${f}`));
        found++;
        totalWarnings++;
      }
    }
  }

  if (found === 0) console.log("  No duplicate file names detected.");
  return found;
}

function checkDuplicateContent() {
  console.log("\n--- Duplicate Content Hash Check ---");
  const hashMap = new Map();

  for (const dir of SCAN_DIRS) {
    const fullDir = join(ROOT, dir);
    const files = walkDir(fullDir);
    for (const file of files) {
      const hash = hashFile(file);
      if (!hash) continue;
      const rel = relative(ROOT, file);
      if (!hashMap.has(hash)) hashMap.set(hash, []);
      hashMap.get(hash).push(rel);
    }
  }

  let found = 0;
  for (const [hash, files] of hashMap) {
    if (files.length > 1) {
      console.log(`  WARN: Identical content (hash: ${hash}):`);
      files.forEach(f => console.log(`    - ${f}`));
      found++;
      totalWarnings++;
    }
  }

  if (found === 0) console.log("  No duplicate content detected.");
  return found;
}

function checkDuplicateRoutes() {
  console.log("\n--- Duplicate Route Registration Check ---");
  const entryFiles = [
    join(ROOT, "server/index.mjs"),
    join(ROOT, "server/dev.mjs"),
  ];

  const routePattern = /app\.use\(\s*["'`]([^"'`]+)["'`]/g;
  const routeMap = new Map();

  for (const entryFile of entryFiles) {
    try {
      const content = readFileSync(entryFile, "utf-8");
      const entryName = basename(entryFile);
      let match;
      while ((match = routePattern.exec(content)) !== null) {
        const route = match[1];
        const key = `${entryName}:${route}`;
        if (!routeMap.has(route)) routeMap.set(route, []);
        routeMap.get(route).push({ file: entryName, path: route });
      }
    } catch { /* skip missing files */ }
  }

  let found = 0;
  for (const [route, registrations] of routeMap) {
    const byFile = new Map();
    for (const reg of registrations) {
      if (!byFile.has(reg.file)) byFile.set(reg.file, 0);
      byFile.set(reg.file, byFile.get(reg.file) + 1);
    }
    for (const [file, count] of byFile) {
      if (count > 1) {
        console.log(`  ERROR: Route "${route}" registered ${count} times in ${file}`);
        found++;
        totalErrors++;
      }
    }
  }

  if (found === 0) console.log("  No duplicate route registrations detected.");
  return found;
}

function checkDuplicateExports() {
  console.log("\n--- Duplicate Named Exports Check ---");
  const exportMap = new Map();

  for (const dir of SCAN_DIRS) {
    const fullDir = join(ROOT, dir);
    const files = walkDir(fullDir);
    for (const file of files) {
      try {
        const content = readFileSync(file, "utf-8");
        const exportPattern = /export\s+(?:default\s+)?(?:function|class|const|let|var)\s+(\w+)/g;
        let match;
        while ((match = exportPattern.exec(content)) !== null) {
          const name = match[1];
          const rel = relative(ROOT, file);
          if (!exportMap.has(name)) exportMap.set(name, []);
          exportMap.get(name).push(rel);
        }
      } catch { /* skip */ }
    }
  }

  let found = 0;
  for (const [name, files] of exportMap) {
    if (files.length > 2 && !["default", "Router", "router"].includes(name)) {
      console.log(`  WARN: Export "${name}" defined in ${files.length} files:`);
      files.slice(0, 5).forEach(f => console.log(`    - ${f}`));
      if (files.length > 5) console.log(`    ... and ${files.length - 5} more`);
      found++;
      totalWarnings++;
    }
  }

  if (found === 0) console.log("  No suspicious duplicate exports detected.");
  return found;
}

console.log("=== Duplicate Prevention Scanner ===");
console.log(`Mode: ${STRICT ? "STRICT (blocking)" : "WARNING (non-blocking)"}`);
console.log(`Scanning: ${SCAN_DIRS.join(", ")}`);

checkDuplicateFileNames();
checkDuplicateContent();
checkDuplicateRoutes();
checkDuplicateExports();

console.log("\n=== Summary ===");
console.log(`Warnings: ${totalWarnings}`);
console.log(`Errors:   ${totalErrors}`);

if (STRICT && (totalErrors > 0)) {
  console.log("\nSTRICT MODE: Failing due to errors.");
  process.exit(1);
} else if (totalErrors > 0) {
  console.log("\nWARNING MODE: Errors found but not blocking.");
  process.exit(0);
} else {
  console.log("\nAll checks passed.");
  process.exit(0);
}
