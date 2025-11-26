// scan-types.mjs — Scan TypeScript type definitions (Safe Edition)

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const TARGETS = ["client", "server"];

const IGNORE_DIRS = ["node_modules", ".cache"];

function shouldIgnore(p) {
  const normalized = p.replace(/\\/g, "/");
  return IGNORE_DIRS.some((dir) =>
    normalized.includes(`/${dir}/`) || normalized.endsWith(`/${dir}`)
  );
}

function scanFile(filePath) {
  const t = fs.readFileSync(filePath, "utf8");
  if (t.includes(" any ")) {
    console.log(`⚠️ Type Issue → ${filePath}`);
  }
}

function walk(dir) {
  if (shouldIgnore(dir)) return;

  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (shouldIgnore(full)) continue;

    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      scanFile(full);
    }
  }
}

console.log("\n🔍 Type Scan Started (Safe Edition)\n");
for (const dir of TARGETS) {
  walk(path.join(ROOT, dir));
}
console.log("\n✨ Type Scan Complete\n");