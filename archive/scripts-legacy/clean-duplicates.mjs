/**
 * QuantumBrain_CleanDuplicates_v2.0_9999^ (SAFE EDITION)
 * © Maria Landa / The Genuine Love Project / MyMentalHealthBuddy
 * This script safely detects duplicate filenames WITHOUT touching:
 * - package.json
 * - package-lock.json
 * - node_modules
 * - .cache, .tscache, .upm
 * - config files
 * - build artifacts
 */

import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

if (process.env.NODE_ENV === "production") {
  console.log("⚠️ Duplicate cleanup disabled in production.");
  process.exit(0);
}

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DIRECTORIES THAT MUST NEVER BE SCANNED
const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".git",
  ".cache",
  ".tscache",
  ".upm",
  ".replit",
  "dist",
  "build",
  "safe_backups",
  ".config",
  "__pycache__"
]);

// FILES THAT MUST *NEVER* BE MOVED OR PROCESSED
const PROTECTED_FILES = new Set([
  "package.json",
  "package-lock.json",
  "vite.config.js",
  "vite.config.ts",
  "tsconfig.json",
  "tsconfig.app.json",
  "tsconfig.node.json",
  ".env",
  ".env.example",
  ".replit",
  "replit.nix"
]);

const ROOT_DIR = path.resolve(__dirname, "..");
const duplicateMap = new Map();

function walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) {
        walk(fullPath);
      }
      continue;
    }

    // Skip protected files completely
    if (PROTECTED_FILES.has(entry.name)) {
      continue;
    }

    const list = duplicateMap.get(entry.name) || [];
    list.push(fullPath);
    duplicateMap.set(entry.name, list);
  }
}

console.log("🔍 Scanning for duplicate files (SAFE MODE)...");
walk(ROOT_DIR);

const duplicates = [...duplicateMap.entries()].filter(([_, paths]) => paths.length > 1);

if (duplicates.length === 0) {
  console.log("✨ No duplicate filenames found. You’re clean!");
  process.exit(0);
}

console.log("\n⚠️ DUPLICATES DETECTED:");
duplicates.forEach(([name, paths]) => {
  console.log("\n📎 File:", name);
  paths.forEach(p => console.log("   - " + p));
});

// SAFE SUGGESTION: Only move non-primary duplicates
console.log("\n✨ Suggested cleanup:");

const cleanupPlan = [];

duplicates.forEach(([name, paths]) => {
  // Choose the "keep" file (first real project path)
  const keep = paths.find(p => !p.includes("archive") && !p.includes("backup")) || paths[0];
  const backups = paths.filter(p => p !== keep);

  cleanupPlan.push({ name, keep, backups });

  console.log("\nFile:", name);
  console.log("• Keep:", keep);
  console.log("• Move to safe_backups:");
  backups.forEach(b => console.log("   - " + b));
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("\nType YES to move backup duplicates into /safe_backups/: ", input => {
  if (input.trim() !== "YES") {
    console.log("❌ Cancelled. No files moved.");
    rl.close();
    return;
  }

  const backupDir = path.join(ROOT_DIR, "safe_backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  cleanupPlan.forEach(({ name, backups }) => {
    backups.forEach(src => {
      const dest = path.join(backupDir, `${name}__${Date.now()}`);
      try {
        fs.renameSync(src, dest);
      } catch (err) {
        console.log(`⚠️ Failed to move ${src}:`, err.message);
      }
    });
  });

  console.log("\n✨ All safe duplicates moved to /safe_backups/");
  console.log("You may delete the safe_backups folder manually anytime.\n");

  rl.close();
});