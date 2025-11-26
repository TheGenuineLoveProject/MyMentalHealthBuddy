// scan-api.mjs — Scan server routes/services for issues

import fs from "fs";
import path from "path";

const TARGET = "server";

function scanFile(filePath) {
  const t = fs.readFileSync(filePath, "utf-8");
  if (t.includes("// NOTE: cleaned") || t.includes("// NOTE: cleaned")) {
    console.log(`⚠️ // NOTE: cleaned/// NOTE: cleaned in ${filePath}`);
  }
  if (t.includes("any")) {
    console.log(`⚠️ 'any' detected in ${filePath}`);
  }
}

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (file.endsWith(".mjs") || file.endsWith(".js") || file.endsWith(".ts"))
      scanFile(full);
  }
}

console.log("\n🔍 API Scan Started\n");
walk(TARGET);
console.log("\n✨ API Scan Complete\n");