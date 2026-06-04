import fs from "fs";
import path from "path";
import sharp from "sharp";

const targets = [
  "client/src/assets/mmhb_brand_logo_lockup_1777538625498.png",
  "client/src/assets/thegenuineloveproject_logo_v2_1777538625498.png",
  "attached_assets/mmhb_brand_logo_lockup_1777538625498.png",
  "attached_assets/thegenuineloveproject_logo_v2_1777538625498.png"
];

const existing = targets.filter(fs.existsSync);

fs.mkdirSync("attached_assets/optimized", { recursive: true });

const results = [];

for (const file of existing) {
  const base = path.basename(file).replace(/\.(png|jpg|jpeg)$/i, ".webp");
  const out = path.join("attached_assets/optimized", base);

  await sharp(file)
    .webp({ quality: 82 })
    .toFile(out);

  results.push({ source: file, output: out });
}

fs.writeFileSync(
  "docs/reports/PHASE_80_STEP_5_TRUE_WEBP_VARIANTS.json",
  JSON.stringify(results, null, 2)
);

console.log("generated", results.length, "true webp variants");
