// scripts/remove-legacy-colors.mjs
import fs from "node:fs";
import path from "node:path";
import { BRAND_HEX_ALLOWLIST } from "./brand-config.mjs";
import { ALLOWED_HEX, HEX_REMAP, RGBA_REMAP } from "./brand-config.mjs";

const ROOT = process.cwd();

// Only scan “real repo files” (skip bundles/archives/node_modules/dist)
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".git",
  "_chatgpt_bundle",
  "archive_DO_NOT_DELETE",
]);

const EXT_OK = new Set([".css", ".scss", ".sass", ".less", ".js", ".jsx", ".html", ".md"]);

const HEX_RE = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
const RGBA_RE = /\brgba?\([^)]+\)/g;

function shouldSkip(filePath) {
  const parts = filePath.split(path.sep);
  return parts.some((p) => SKIP_DIRS.has(p));
}

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (shouldSkip(p)) continue;
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function normalizeHex(hex) {
  // expand #fff -> #ffffff
  let h = hex.toLowerCase();
  if (h.length === 4) {
    h = "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  }
  return h;
}

let findings = 0;

const files = walk(ROOT).filter((f) => EXT_OK.has(path.extname(f)));

for (const file of files) {
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }

  const hexMatches = [...text.matchAll(HEX_RE)].map((m) => normalizeHex(m[0]));
  const rgbaMatches = [...text.matchAll(RGBA_RE)].map((m) => m[0]);

  // Report “non-brand” hex values (anything not in allowlist)
  for (const h of hexMatches) {
    if (!BRAND_HEX_ALLOWLIST.has(h)) {
      findings++;
      console.log(`❌ Non-brand hex "${h}" found in ${file}`);
    }
  }

  // Report any rgba() usage (we want tokens instead)
  for (const r of rgbaMatches) {
    findings++;
    console.log(`❌ Legacy token "${r}" found in ${file}`);
  }
}

if (findings === 0) {
  console.log("✅ Scan complete. No non-brand colors found.");
} else {
  console.log("✅ Scan complete. Fix ONLY the items printed above (real repo files).");
  process.exitCode = 1;
}