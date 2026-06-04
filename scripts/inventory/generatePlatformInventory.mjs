import fs from "fs";
import path from "path";

const ROOTS = [
  "client/src/pages",
  "client/src/components",
  "client/src/features",
  "server",
  "scripts"
];

const inventory = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;

  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full);
    } else {
      inventory.push({
        path: full,
        size: stat.size
      });
    }
  }
}

ROOTS.forEach(walk);

inventory.sort((a,b)=>a.path.localeCompare(b.path));

fs.writeFileSync(
  "codex/inventory/platformInventory.json",
  JSON.stringify(inventory,null,2)
);

console.log("GREEN: platform inventory generated");
console.log(`FILES: ${inventory.length}`);
