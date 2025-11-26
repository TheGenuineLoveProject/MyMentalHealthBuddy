// automation/automationCore.mjs
// FINAL STABLE VERSION — v1.0

import fs from "node:fs";
import path from "node:path";

/**
 * Immediately stop if running in production.
 * All automation must be human-triggered in development only.
 */
export function assertNotProduction() {
  if (process.env.NODE_ENV === "production") {
    console.log("Automation disabled in production.");
    process.exit(0);
  }
}

/**
 * Simple timestamp generator — YYYYMMDD-HHMMSS
 */
export function makeTimestamp() {
  const now = new Date();

  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}-${hour}${minute}${second}`;
}

/**
 * Clean section headers
 */
export function logSection(title) {
  console.log("");
  console.log("────────────────────────────────────────────");
  console.log(title);
  console.log("────────────────────────────────────────────");
}

/**
 * Ensure a directory exists — create if missing.
 */
export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Copy directory recursively — used for backups.
 */
export function copyDirRecursive(srcDir, destDir) {
  ensureDir(destDir);

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(src, dest);
    } else if (entry.isFile()) {
      fs.copyFileSync(src, dest);
    }
  }
}

/**
 * withBackup({ targetDir, backupRoot, label, task })
 * Automatically creates a timestamped backup before running the task.
 */
export function withBackup(options) {
  const { targetDir, backupRoot, label = "automation", task } = options;

  if (!fs.existsSync(targetDir)) {
    logSection(`Backup skipped — directory does not exist: ${targetDir}`);
    task();
    return;
  }

  ensureDir(backupRoot);

  const timestamp = makeTimestamp();
  const backupDirName = `${path.basename(targetDir)}-${label}-${timestamp}`;
  const backupDirPath = path.join(backupRoot, backupDirName);

  logSection("Creating backup before automation task runs");
  console.log(`FROM: ${targetDir}`);
  console.log(`TO:   ${backupDirPath}`);

  copyDirRecursive(targetDir, backupDirPath);

  logSection("Backup complete. Running task now...");
  task();
}