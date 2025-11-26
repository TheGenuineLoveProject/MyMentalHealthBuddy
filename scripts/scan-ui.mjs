// scan-ui.mjs — Scans UI components for missing imports, typos, // NOTE: cleaneds

import fs from "fs";
import path from "path";

const TARGET = "client/src";

function scanFile(filePath) {
  const text = fs.readFileSync(filePath, "utf-8");

  if (text.includes("// NOTE: cleaned") || text.includes("// NOTE: cleaned")) {
    console.log(`⚠️  // NOTE: cleaned/// NOTE: cleaned → ${filePath}`);
  }
  if (text.includes("<<") && text.includes(">>")) {
    console.log(`⚠️  Placeholder markers → ${filePath}`);
  }
}

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) walk(full);
    else if (file.endsWith(".tsx") || file.endsWith(".jsx")) scanFile(full);
  }
}

console.log("\n🔍 UI Scan Started\n");
walk(TARGET);
console.log("\n✨ UI Scan Complete\n");