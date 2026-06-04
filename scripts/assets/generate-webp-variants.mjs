import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const roots = ["client", "public", "assets"];
const exts = new Set([".png", ".jpg", ".jpeg"]);
const minBytes = 300 * 1024;
const generated = [];

async function walk(dir) {
  let entries = [];
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (full.includes("/dist/") || full.includes("node_modules")) continue;

    if (entry.isDirectory()) {
      await walk(full);
      continue;
    }

    const ext = path.extname(full).toLowerCase();
    if (!exts.has(ext)) continue;

    const stat = await fs.stat(full);
    if (stat.size < minBytes) continue;

    const out = full.replace(ext, ".webp");
    try {
      await fs.access(out);
      continue;
    } catch {}

    await sharp(full).webp({ quality: 82 }).toFile(out);
    const outStat = await fs.stat(out);

    generated.push({
      source: full,
      sourceKB: +(stat.size / 1024).toFixed(2),
      webp: out,
      webpKB: +(outStat.size / 1024).toFixed(2),
      savedKB: +((stat.size - outStat.size) / 1024).toFixed(2),
    });
  }
}

for (const root of roots) await walk(root);

await fs.writeFile(
  "docs/reports/PHASE_79_WEBP_VARIANTS.json",
  JSON.stringify(generated, null, 2)
);

console.log(JSON.stringify(generated, null, 2));
console.log(`Generated ${generated.length} WebP variants`);
