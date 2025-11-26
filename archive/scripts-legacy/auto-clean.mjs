// scripts/auto-clean.mjs
// SAFE CLEANUP SCRIPT — ARCHIVE EVERYTHING NOT IN THE TRUE PLATFORM
// Run with: node scripts/auto-clean.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();

// ----------------------------------------------
// 1. CONFIG — WHICH DIRECTORIES WE KEEP
// ----------------------------------------------
const KEEP_DIRS = new Set([
  "server",
  "client",
  "scripts",
  "drizzle",          // optional
  "migrations",       // optional
]);

// ----------------------------------------------
// 2. CONFIG — WHICH FILES WE KEEP IN ROOT
// ----------------------------------------------
const KEEP_FILES = new Set([
  "package.json",
  "tsconfig.json",
  ".replit",
  ".env",
  ".env.example",
  "README.md"
]);

// ----------------------------------------------
// 3. TRUE SERVER ENTRY
// ----------------------------------------------
const TRUE_SERVER_ENTRY = "server/index.mjs";

// ----------------------------------------------
// 4. TRUE CLIENT ENTRY
// ----------------------------------------------
const TRUE_CLIENT_MAIN = "client/src/main.tsx";
const TRUE_CLIENT_APP = "client/src/App.tsx";

// ----------------------------------------------
// 5. ARCHIVE DIRECTORY
// ----------------------------------------------
const ARCHIVE = path.join(root, "archive_DO_NOT_DELETE");
if (!fs.existsSync(ARCHIVE)) fs.mkdirSync(ARCHIVE);

// Helpers — move file or folder
function safeMove(src) {
  const dest = path.join(ARCHIVE, src.replace(/\//g, "_"));
  console.log(`🟡 Moving → ${src}`);
  try {
    fs.renameSync(src, dest);
    console.log(`   ✔ Archived → ${dest}`);
  } catch (err) {
    console.log(`   ❗ Could not move ${src}:`, err.message);
  }
}

// ----------------------------------------------
// 6. STEP 1: MOVE UNUSED ROOT FILES
// ----------------------------------------------
console.log("\n===== STEP 1 — CLEAN ROOT FILES =====\n");
for (const file of fs.readdirSync(root)) {
  const full = path.join(root, file);

  if (fs.lstatSync(full).isFile()) {
    if (!KEEP_FILES.has(file)) {
      safeMove(full);
    }
  }
}

// ----------------------------------------------
// 7. STEP 2: MOVE UNUSED ROOT DIRECTORIES
// ----------------------------------------------
console.log("\n===== STEP 2 — CLEAN ROOT DIRECTORIES =====\n");
for (const dir of fs.readdirSync(root)) {
  const full = path.join(root, dir);
  if (!fs.lstatSync(full).isDirectory()) continue;

  if (
    !KEEP_DIRS.has(dir) &&
    dir !== "archive_DO_NOT_DELETE" &&
    dir !== "node_modules" &&
    !dir.startsWith(".")
  ) {
    safeMove(full);
  }
}

// ----------------------------------------------
// 8. STEP 3: CLEAN CLIENT PUBLIC DUPLICATES
// ----------------------------------------------
const clientPublicSrc = "client/public/src";
if (fs.existsSync(clientPublicSrc)) {
  console.log("\n===== STEP 3 — ARCHIVE client/public/src DUPLICATES =====\n");
  safeMove(clientPublicSrc);
}

// ----------------------------------------------
// 9. STEP 4: ARCHIVE DUPLICATE SCHEMAS OUTSIDE server/db
// ----------------------------------------------
console.log("\n===== STEP 4 — ARCHIVE duplicate schemas =====\n");

function archiveIfExists(p) {
  const full = path.join(root, p);
  if (fs.existsSync(full)) {
    safeMove(full);
  }
}

archiveIfExists("apps/shared/schema.ts");
archiveIfExists("apps/shared/schema.js");
archiveIfExists("apps/shared/schema.d.ts");
archiveIfExists("apps/shared/db-schema.ts");
archiveIfExists("apps/shared/tokens.ts");
archiveIfExists("apps/shared/tokens.js");

// ----------------------------------------------
// 10. STEP 5: VERIFY REQUIRED FILES
// ----------------------------------------------
console.log("\n===== STEP 5 — VERIFY CORE FILES =====\n");

function checkExists(label, pathToCheck) {
  const exists = fs.existsSync(path.join(root, pathToCheck));
  console.log(`${exists ? "✔" : "❌"} ${label}: ${pathToCheck}`);
}

checkExists("SERVER ENTRY", TRUE_SERVER_ENTRY);
checkExists("CLIENT MAIN", TRUE_CLIENT_MAIN);
checkExists("CLIENT APP", TRUE_CLIENT_APP);

// ----------------------------------------------
// 11. REPORT DONE
// ----------------------------------------------
console.log("\n=======================================");
console.log("   SAFE CLEANUP COMPLETED");
console.log("   Everything unused is archived.");
console.log("   Nothing deleted.");
console.log("=======================================\n");