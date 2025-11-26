// scripts/check-imports-alias.mjs
// Prints out absolute paths for all backend imports

import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_IMPORTS } from "../server/shared/importMap.mjs";

console.log("=== IMPORT MAP STATUS ===");
console.log(ALL_IMPORTS);
console.log("Total imports:", Object.keys(ALL_IMPORTS).length);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fromRoot = (rel) => path.join(__dirname, '..', rel);

console.log('🧭 Backend import map (alias-safe)');
console.log('=================================');

for (const [key, group] of Object.entries(ALL_IMPORTS)) {
  const indexPath = fromRoot(`server/${key}.mjs`);
  console.log(`\n• ${key} → ${indexPath}`);

  if (group.routes) {
    for (const r of group.routes) {
      console.log(`   ↳ route       → ${fromRoot(`server/${r}`)}`);
    }
  }
  if (group.middleware) {
    for (const m of group.middleware) {
      console.log(`   ↳ middleware  → ${fromRoot(`server/${m}`)}`);
    }
  }
  if (group.db) {
    for (const d of group.db) {
      console.log(`   ↳ db          → ${fromRoot(`server/${d}`)}`);
    }
  }
}

console.log('\n✅ Import-map alias check finished.\n');