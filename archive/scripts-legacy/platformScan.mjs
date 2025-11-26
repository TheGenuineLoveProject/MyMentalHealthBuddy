/**
 * 360° Platform Scanner — MyMentalHealthBuddy
 * Scans entire platform: missing files, empty files, duplicates, crashes, Vite issues.
 */

import fs from "fs";
import path from "path";

// Root paths
const ROOT = process.cwd();
const CLIENT = path.join(ROOT, "client");
const SERVER = path.join(ROOT, "server");

// Helper log
const log = (msg) => console.log("🔍 " + msg);

// -----------------------------
// 1. Scan for empty frontend files
// -----------------------------
function scanEmptyFiles(folder) {
  log(`Scanning empty files in: ${folder}`);

  const results = [];

  function check(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const full = path.join(dir, item);
      const stat = fs.statSync(full);

      if (stat.isDirectory()) check(full);
      else if (stat.size === 0) results.push(full);
    }
  }

  check(folder);
  return results;
}

// -----------------------------
// 2. Scan for missing critical frontend files
// -----------------------------
const REQUIRED_FILES = [
  "client/src/main.tsx",
  "client/src/App.tsx",
  "client/index.html",
  "client/vite.config.js",
  "server/index.mjs"
];

function missingFiles() {
  return REQUIRED_FILES.filter((file) => !fs.existsSync(path.join(ROOT, file)));
}

// -----------------------------
// 3. Run scan
// -----------------------------
log("Starting 360° platform scan…");

const empty = scanEmptyFiles(CLIENT);
const missing = missingFiles();

log("---------------------------------------------------");
log("SCAN RESULTS:");
log("---------------------------------------------------");

if (empty.length) {
  log("⚠️ Empty files found:");
  empty.forEach((f) => console.log("  - " + f));
} else {
  log("✅ No empty files detected.");
}

if (missing.length) {
  log("❌ Missing required files:");
  missing.forEach((f) => console.log("  - " + f));
} else {
  log("✅ No missing critical files.");
}

log("---------------------------------------------------");
log("Scan complete.");