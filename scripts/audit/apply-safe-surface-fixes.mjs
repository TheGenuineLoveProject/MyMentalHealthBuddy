#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CLIENT_SRC = path.join(ROOT, "client/src");

let fixCount = 0;
const fixes = [];

function walkDir(dir, ext = [".jsx", ".tsx", ".js", ".ts"]) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      results.push(...walkDir(fullPath, ext));
    } else if (ext.some(e => entry.name.endsWith(e))) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walkDir(CLIENT_SRC);

for (const filePath of files) {
  let content = fs.readFileSync(filePath, "utf-8");
  let modified = false;
  const relPath = path.relative(ROOT, filePath);

  const extLinkRegex = /(<a\s[^>]*target="_blank"[^>]*)(>)/gi;
  let match;
  let newContent = content;
  while ((match = extLinkRegex.exec(content)) !== null) {
    const tag = match[1];
    if (!tag.includes('rel="noopener') && !tag.includes("rel='noopener") && !tag.includes('rel="noreferrer')) {
      const fixed = tag + ' rel="noopener noreferrer"' + match[2];
      newContent = newContent.replace(match[0], fixed);
      fixes.push({ file: relPath, type: "ADD_NOOPENER", original: match[0].substring(0, 80) });
      modified = true;
      fixCount++;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, newContent);
  }
}

console.log("=== Safe Surface Fixes ===");
console.log(`Applied ${fixCount} safe fixes.`);
for (const fix of fixes) {
  console.log(`  ${fix.type}: ${fix.file}`);
}
if (fixCount === 0) {
  console.log("  No safe fixes needed — all checks passed.");
}
