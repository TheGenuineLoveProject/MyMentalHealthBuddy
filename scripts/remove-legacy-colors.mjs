import fs from "node:fs/promises";
import path from "node:path";
import { ALLOWED_HEX, HEX_REMAP, RGBA_REMAP } from "./brand-config.mjs";
import fg from "fast-glob";

const INCLUDE = [
  "client/**/*.{css,ts,tsx,js,jsx,html,json}",
  "server/**/*.{css,ts,tsx,js,jsx,html,json,mjs}",
  "shared/**/*.{css,ts,tsx,js,jsx,json,mjs}",
  "public/**/*.{css,html,json,svg,js}",
  "docs/**/*.{md,mdx}",
  "*.{md,html,json,js,ts,mjs}",
];

const IGNORE = [
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/.git/**",
  "**/.cache/**",
  "**/.local/**",
  "**/_chatgpt_bundle/**",
  "**/archive_DO_NOT_DELETE/**",
  "**/.next/**",
  "**/.vite/**",
  "**/coverage/**",
];

const ROOT = process.cwd();

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".local",              // replit agent cache (ignore!)
  "_chatgpt_bundle",      // generated bundle (ignore!)
  "archive_DO_NOT_DELETE" // your archive (ignore!)
]);

const EXT_ALLOW = new Set([
  ".css", ".ts", ".tsx", ".js", ".jsx", ".html", ".json", ".md"
]);

// ✅ Put your *official* brand hex values here (add/remove as needed)
const BRAND_HEX_ALLOWLIST = new Set([
  // Example placeholders — keep what you truly use:
  // "8FBF9F", // Serenity Sage
  // "E5E7EB", // Mist / neutral
]);

function isIgnoredDir(dirName) {
  return IGNORE_DIRS.has(dirName);
}

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (ent.isDirectory()) {
      if (isIgnoredDir(ent.name)) continue;
      out.push(...(await walk(path.join(dir, ent.name))));
    } else {
      const ext = path.extname(ent.name).toLowerCase();
      if (!EXT_ALLOW.has(ext)) continue;
      out.push(path.join(dir, ent.name));
    }
  }
  return out;
}

function findHexes(text) {
  const matches = text.match(/#([0-9a-fA-F]{3,8})\b/g) ?? [];
  // Normalize to 6-digit where possible, store as uppercase without "#"
  return matches.map(m => m.slice(1).toUpperCase());
}

function findRgba(text) {
  return (text.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*(?:0?\.\d+|1|0))?\s*\)/g) ?? []);
}

async function main() {
  const files = await walk(ROOT);

  let nonBrandHexCount = 0;
  let legacyRgbaCount = 0;
  let filesTouched = 0;

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");

    const hexes = findHexes(raw);
    const rgbas = findRgba(raw);

    const nonBrandHexes = hexes.filter(h => !BRAND_HEX_ALLOWLIST.has(h));

    // We do NOT auto-replace hexes (too risky).
    // We DO auto-clean purely cosmetic legacy tokens if you want later.
    // For now: just report.
    if (nonBrandHexes.length || rgbas.length) {
      if (nonBrandHexes.length) {
        nonBrandHexCount += nonBrandHexes.length;
        console.log(`✗ Non-brand hex found in ${file}`);
      }
      if (rgbas.length) {
        legacyRgbaCount += rgbas.length;
        console.log(`✗ Legacy rgba token(s) found in ${file}`);
      }
    }

    // No writes by default (safe mode)
    // If you later want auto-fixes, we’ll enable it with a flag.
  }

  console.log("\n✅ Scan complete.");
  console.log(`Non-brand hex count: ${nonBrandHexCount}`);
  console.log(`Legacy rgba count:   ${legacyRgbaCount}`);
  console.log("Next: paste your official brand hexes into BRAND_HEX_ALLOWLIST to stop false positives.");
}

main().catch((err) => {
  console.error("❌ remove-legacy-colors failed:", err);
  process.exit(1);
});