// automation/archiveScripts.mjs
// Safe Non-Destructive Archival of Legacy Scripts

import fs from "node:fs";
import path from "node:path";
import {
  assertNotProduction,
  logSection,
  ensureDir,
  copyDirRecursive
} from "./automationCore.mjs";

assertNotProduction();

logSection("Archiving Legacy Scripts");

const SOURCE_DIR = path.join(process.cwd(), "scripts");
const DEST_DIR = path.join(process.cwd(), "archive/scripts-legacy");

ensureDir(DEST_DIR);

if (!fs.existsSync(SOURCE_DIR)) {
  console.log("No /scripts folder found. Nothing to archive.");
  process.exit(0);
}

// Move files one-by-one safely
const entries = fs.readdirSync(SOURCE_DIR);

for (const file of entries) {
  if (file.endsWith(".mjs")) {
    const src = path.join(SOURCE_DIR, file);
    const dest = path.join(DEST_DIR, file);

    console.log(`Archiving: ${file}`);
    fs.renameSync(src, dest);
  }
}

logSection("Archival Complete");
console.log("All legacy scripts moved to archive/scripts-legacy/");