// scripts/gen-generated-routekeys.mjs
import fs from "fs";
import path from "path";

const root = process.cwd();
const dir = path.join(root, "client/src/pages/generated");

function toKey(file) {
  const base = file.replace(/\.(t|j)sx?$/, "");
  const kebab = base
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
  return `generated_${kebab}`;
}

if (!fs.existsSync(dir)) {
  console.log("No generated pages folder found:", dir);
  process.exit(0);
}

const files = fs
  .readdirSync(dir)
  .filter((f) => /\.(t|j)sx?$/.test(f))
  .sort();

const out = {};
for (const f of files) {
  out[f] = toKey(f);
}

const outPath = path.join(root, "client/src/content/meta/generatedRouteKeys.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log("Wrote:", outPath, "count:", files.length);