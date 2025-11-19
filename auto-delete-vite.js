// -----------------------------------------------------------
// AUTO-DELETE ALL DUPLICATE vite.config FILES
// Keeps ONLY: <root>/client/vite.config.js
//
// Deletes:
//  - vite.config.ts
//  - vite.config.mjs
//  - vite.config.cjs
//  - vite.config.js in any OTHER folder
//  - old backups, archive copies, temp files
// -----------------------------------------------------------

import { readdirSync, statSync, rmSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const filesDeleted = [];
const PROTECTED = join(ROOT, "client", "vite.config.js");

function scanDir(dir) {
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules to avoid slow scan
      if (!item.includes("node_modules")) scanDir(fullPath);
    } else {
      if (item.startsWith("vite.config")) {
        if (fullPath !== PROTECTED) {
          // Delete duplicates
          rmSync(fullPath, { force: true });
          filesDeleted.push(fullPath);
        }
      }
    }
  }
}

console.log("🧹 Cleaning duplicate vite.config files...\n");
scanDir(ROOT);

console.log("✨ Done!");
console.log(`📦 Protected: ${PROTECTED}`);

if (filesDeleted.length === 0) {
  console.log("\n👍 No duplicates found.");
} else {
  console.log("\n🗑️ Deleted duplicates:");
  filesDeleted.forEach(f => console.log(" - " + f));
}

console.log("\n🎯 You now have EXACTLY one vite.config.js in client/");
console.log("Restart with: npm run dev\n");