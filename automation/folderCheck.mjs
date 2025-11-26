// automation/folderCheck.mjs

import fs from "node:fs";
import path from "node:path";
import {
  assertNotProduction,
  logSection
} from "./automationCore.mjs";

assertNotProduction();

logSection("Folder Structure Checker v1.0");

// Folders we expect at the project root
const REQUIRED_FOLDERS = [
  "client",
  "server",
  "drizzle",
  "migrations",
  "scripts",
  "safe_backups"
];

const root = process.cwd();
const entries = fs.readdirSync(root, { withFileTypes: true });

const folderNames = entries.filter(e => e.isDirectory()).map(e => e.name);

logSection("Required Folders");

for (const req of REQUIRED_FOLDERS) {
  if (folderNames.includes(req)) {
    console.log(`✔️ Found required folder: ${req}`);
  } else {
    console.log(`❌ MISSING required folder: ${req}`);
  }
}

logSection("Unexpected Folders At Root");

for (const name of folderNames) {
  if (!REQUIRED_FOLDERS.includes(name) && !name.startsWith(".")) {
    console.log(`⚠️ Non-standard folder detected: ${name}`);
  }
}

logSection("Folder Check Complete");
console.log("No folders were changed or deleted. This is a read-only report.");