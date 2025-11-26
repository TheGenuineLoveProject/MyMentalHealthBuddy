// automation/templates/exampleAutomation.mjs

import fs from "node:fs";
import path from "node:path";
import {
  assertNotProduction,
  logSection,
  withBackup
} from "../automationCore.mjs";

// 1) Safety: never run in production
assertNotProduction();

// 2) Configure the folder you want to back up and inspect
const TARGET_DIR = "src";         // change if your main source folder is different
const BACKUP_ROOT = "backup";     // backups will be placed in this folder

logSection("Example Automation Script");
console.log("This script will:");
console.log("1) Create a safe backup of the target directory.");
console.log("2) Print a simple list of top-level files and folders.");
console.log("");
console.log("Target directory:", TARGET_DIR);
console.log("Backup root:     ", BACKUP_ROOT);

withBackup({
  targetDir: TARGET_DIR,
  backupRoot: BACKUP_ROOT,
  label: "example",
  task: () => {
    // After backup, run the simple inspection
    logSection("Top-Level Entries In Project Root");
    const rootPath = process.cwd();
    const entries = fs.readdirSync(rootPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(rootPath, entry.name);
      const info = entry.isDirectory() ? "[DIR]" : "[FILE]";
      console.log(info, entry.name, "→", entryPath);
    }

    logSection("Next Steps");
    console.log("You just ran the example automation safely.");
    console.log("You can now copy this file and modify the logic inside the task");
    console.log("to build real scanners (errors, duplicates, folder checks).");
  }
});