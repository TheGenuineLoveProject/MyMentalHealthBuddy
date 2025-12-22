#!/usr/bin/env node
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const ALLOWLIST = [
  path.join(ROOT, "shared", "brand.mjs"),
  path.join(ROOT, "client", "src", "styles", "brand.css"),
];

const BLOCKED_SNIPPETS = [
  "The Genuine Love Project",
  "Live in Genuine Love",
  "#6D9B8D",
  "#A4C3B2",
  "#EAC3B5",
  "#EAC33B",
];

function walk(dir, out = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const p = path.join(dir, it.name);
    if (it.isDirectory()) {
      if (it.name === "node_modules" || it.name === "dist" || it.name === ".git") continue;
      walk(p, out);
    } else {
      out.push(p);
    }
  }
  return out;
}

const files = walk(ROOT).filter((f) =>
  /\.(ts|tsx|js|mjs|css|html)$/.test(f)
);

let failed = false;

for (const f of files) {
  if (ALLOWLIST.includes(f)) continue;

  const content = fs.readFileSync(f, "utf8");
  for (const snip of BLOCKED_SNIPPETS) {
    if (content.includes(snip)) {
      console.error(`❌ Brand drift detected: "${snip}" found in ${path.relative(ROOT, f)}`);
      failed = true;
    }
  }
}

if (failed) {
  console.error("\nFix: remove hardcoded brand values and import BRAND from shared/brand.mjs instead.\n");
  process.exit(1);
}

console.log("✅ Brand lock passed (no drift).");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

const BRAND_SOURCE = path.join(rootDir, "shared/brand.mjs");

const BRAND_VALUES = {
  colors: ["#6D9B8D", "#A4C3B2", "#EAC3B5", "#EAC33B", "var(--glp-paper)", "var(--glp-ink)"],
  names: ["The Genuine Love Project", "Genuine Love"],
  taglines: ["Live in Genuine Love"],
};

const ALLOWED_FILES = [
  "shared/brand.mjs",
  "shared/brand.d.ts",
  "client/src/styles/brand.css",
  "client/src/lib/brand.ts",
  "client/src/brand.ts",
  "client/src/index.css",
  "replit.md",
  "scripts/brand-lock.mjs",
];

const IGNORE_DIRS = [
  "node_modules", 
  ".git", 
  "dist", 
  "build", 
  ".next", 
  "coverage",
  "archive",
  "scripts-legacy",
  "content_output"
];

const IGNORE_EXTENSIONS = [".html", ".md"];

function getAllFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(rootDir, fullPath);

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.includes(entry.name)) {
        getAllFiles(fullPath, files);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if ([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"].includes(ext) && !IGNORE_EXTENSIONS.includes(ext)) {
        files.push({ fullPath, relativePath });
      }
    }
  }

  return files;
}

function checkFile(filePath, relativePath) {
  const violations = [];

  if (ALLOWED_FILES.some((allowed) => relativePath.includes(allowed))) {
    return violations;
  }

  const content = fs.readFileSync(filePath, "utf-8");

  for (const color of BRAND_VALUES.colors) {
    const regex = new RegExp(color.replace("#", "#?"), "gi");
    if (regex.test(content)) {
      violations.push({
        file: relativePath,
        type: "color",
        value: color,
        message: `Hardcoded brand color "${color}" found. Use CSS variable or BRAND.colors instead.`,
      });
    }
  }

  for (const name of BRAND_VALUES.names) {
    if (content.includes(name) && !relativePath.endsWith(".md")) {
      const isImportingBrand =
        content.includes('from "@shared/brand"') ||
        content.includes('from "../../shared/brand') ||
        content.includes("BRAND.name");

      if (!isImportingBrand) {
        violations.push({
          file: relativePath,
          type: "name",
          value: name,
          message: `Hardcoded brand name "${name}" found. Use BRAND.name instead.`,
        });
      }
    }
  }

  return violations;
}

function main() {
  console.log("🔒 Brand Lock Check\n");
  console.log("Scanning for hardcoded brand values...\n");

  if (!fs.existsSync(BRAND_SOURCE)) {
    console.error("❌ Brand source file not found:", BRAND_SOURCE);
    process.exit(1);
  }

  const files = getAllFiles(rootDir);
  let allViolations = [];

  for (const { fullPath, relativePath } of files) {
    const violations = checkFile(fullPath, relativePath);
    allViolations = allViolations.concat(violations);
  }

  if (allViolations.length > 0) {
    console.log("❌ Brand drift detected!\n");

    for (const v of allViolations) {
      console.log(`  File: ${v.file}`);
      console.log(`  Type: ${v.type}`);
      console.log(`  ${v.message}\n`);
    }

    console.log(`\nTotal violations: ${allViolations.length}`);
    console.log("\nFix: Import from @shared/brand and use BRAND.* or CSS variables.\n");
    process.exit(1);
  }

  console.log("✅ No brand drift detected!");
  console.log(`   Scanned ${files.length} files.`);
  console.log("   Brand source of truth: shared/brand.mjs\n");
  process.exit(0);
}

main();
