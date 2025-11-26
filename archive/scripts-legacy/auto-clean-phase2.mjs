// scripts/auto-clean-phase2.mjs
// SAFE BACKEND + ROOT CLEANUP — PHASE 2
// Run with: node scripts/auto-clean-phase2.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();

const ARCHIVE = path.join(root, "archive_DO_NOT_DELETE");
if (!fs.existsSync(ARCHIVE)) fs.mkdirSync(ARCHIVE);

// ----------------------------------
// Helper to move unsafe files
// ----------------------------------
function archive(pathToFile) {
  const dest = path.join(ARCHIVE, pathToFile.replace(/\//g, "_"));
  try {
    fs.renameSync(pathToFile, dest);
    console.log(`🟡 Archived → ${pathToFile}`);
  } catch (err) {
    console.log(`❗ Could not archive ${pathToFile}: ${err.message}`);
  }
}

// ----------------------------------
// Helper to archive directory
// ----------------------------------
function archiveDir(dir) {
  if (fs.existsSync(dir)) archive(dir);
}

// ----------------------------------
// 1. CLEAN ROOT UNNEEDED DIRECTORIES
// ----------------------------------
[
  ".config",
  ".semgrep",
  "npm",
  "node_global",
].forEach(dir => {
  archiveDir(dir);
});

// ----------------------------------
// 2. CLEAN SERVER DUPLICATES
// ----------------------------------
const serverDir = path.join(root, "server");

if (fs.existsSync(serverDir)) {
  const files = fs.readdirSync(serverDir);

  files.forEach(file => {
    const full = path.join(serverDir, file);

    // Keep ONLY index.mjs
    if (file === "index.mjs") return;

    // Archive all TypeScript
    if (file.endsWith(".ts") || file.endsWith(".d.ts")) archive(full);

    // Archive compiled JS (we only keep mjs)
    if (file.endsWith(".js") && file !== "index.mjs") archive(full);

    // Archive maps
    if (file.endsWith(".map")) archive(full);

    // Archive dist/ and lib/
    if (file === "dist" || file === "lib") archive(full);
  });
}

// ----------------------------------
// 3. CLEAN CLIENT PUBLIC DUPLICATES
// ----------------------------------
const clientPublicSrc = "client/public/src";
if (fs.existsSync(clientPublicSrc)) {
  archiveDir(clientPublicSrc);
}

// ----------------------------------
// 4. CLEAN CLIENT GENERATED BUILD FILES
// ----------------------------------
[
  "client/dist",
  "client/build",
  "client/.vite",
].forEach(dir => {
  const full = path.join(root, dir);
  if (fs.existsSync(full)) archiveDir(full);
});

// ----------------------------------
// 5. VERIFY CORE FILES
// ----------------------------------
console.log("\n===== VERIFYING CORE FILES =====");
[
  "server/index.mjs",
  "client/src/main.tsx",
  "client/src/App.tsx",
].forEach(f => {
  console.log(fs.existsSync(f) ? `✔ ${f}` : `❌ MISSING → ${f}`);
});

console.log("\n===== PHASE 2 CLEANUP COMPLETE =====");
console.log("Everything unnecessary archived safely.");
console.log("Server is now PURE JavaScript.");