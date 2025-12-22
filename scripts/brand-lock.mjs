#!/usr/bin/env node
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import { BRAND_HEX_ALLOWLIST } from "../shared/brand.js";

const ROOT = process.cwd();
const ALLOWED = new Set(BRAND_HEX_ALLOWLIST.map(h => h.toLowerCase()));
const FILE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".css"];

let violations = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const hexMatches = content.match(/#[0-9a-fA-F]{6}/g) || [];

  hexMatches.forEach(hex => {
    if (!ALLOWED.has(hex.toLowerCase())) {
      violations.push({ filePath, hex });
    }
  });
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    if (["node_modules", "dist", ".git", ".quarantine"].includes(entry)) continue;
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) walk(fullPath);
    else if (FILE_EXTENSIONS.some(ext => fullPath.endsWith(ext))) {
      scanFile(fullPath);
    }
  }
}

console.log("🔒 BRAND LOCK SCAN STARTED");
walk(ROOT);

if (violations.length > 0) {
  console.error("\n❌ BRAND LOCK VIOLATIONS FOUND:\n");
  violations.forEach(v =>
    console.error(`• ${v.hex} → ${v.filePath}`)
  );
  process.exit(1);
}

console.log("✅ BRAND LOCK PASSED — No unauthorized colors detected.");