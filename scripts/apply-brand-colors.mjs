// scripts/apply-brand-colors.mjs
import fs from "node:fs";
import path from "node:path";
import { HEX_REMAP, RGBA_REMAP } from "./brand-config.mjs";

const ROOT = process.cwd();
const TARGET_DIRS = ["client", "docs", "brand", ".local"];

const exts = new Set([".js", ".jsx", ".ts", ".tsx", ".css", ".html", ".md"]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function normalizeHex(s) {
  return s.toUpperCase();
}

function applyReplacements(text) {
  let t = text;

  // RGBA replacements (exact string matches)
  for (const [from, to] of Object.entries(RGBA_REMAP)) {
    t = t.split(from).join(to);
  }

  // HEX replacements (case-insensitive)
  for (const [fromHex, to] of Object.entries(HEX_REMAP)) {
    const from = fromHex.toLowerCase();
    // replace both lowercase and uppercase occurrences safely
    t = t.replaceAll(new RegExp(from, "g"), to);
    t = t.replaceAll(new RegExp(normalizeHex(from), "g"), to);
  }

  return t;
}

let changed = 0;
for (const d of TARGET_DIRS) {
  const abs = path.join(ROOT, d);
  if (!fs.existsSync(abs)) continue;

  const files = walk(abs).filter((f) => exts.has(path.extname(f)));
  for (const file of files) {
    const before = fs.readFileSync(file, "utf8");
    const after = applyReplacements(before);
    if (after !== before) {
      fs.writeFileSync(file, after, "utf8");
      changed++;
      console.log("✅ updated", file);
    }
  }
}

console.log(`\nDONE. Files updated: ${changed}\n`);