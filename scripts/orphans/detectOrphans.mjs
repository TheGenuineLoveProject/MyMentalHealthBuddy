import fs from "fs";
import path from "path";

const ROOT = "client/src/components";

const files = [];
const imports = new Set();

function walk(dir) {
  if (!fs.existsSync(dir)) return;

  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full);
    } else if (
      full.endsWith(".jsx") ||
      full.endsWith(".tsx") ||
      full.endsWith(".js") ||
      full.endsWith(".ts")
    ) {
      files.push(full);

      const content = fs.readFileSync(full, "utf8");

      const matches = [
        ...content.matchAll(/from\s+['"](.*?)['"]/g)
      ];

      matches.forEach(m => imports.add(m[1]));
    }
  }
}

walk(ROOT);

const orphaned = [];

for (const file of files) {
  const base = path.basename(file).replace(/\.(jsx|tsx|js|ts)$/,"");

  let referenced = false;

  for (const imp of imports) {
    if (imp.includes(base)) {
      referenced = true;
      break;
    }
  }

  if (!referenced) {
    orphaned.push(file);
  }
}

fs.writeFileSync(
  "codex/orphans/orphanComponents.json",
  JSON.stringify(orphaned,null,2)
);

console.log("GREEN: orphan scan complete");
console.log(`ORPHANS: ${orphaned.length}`);
