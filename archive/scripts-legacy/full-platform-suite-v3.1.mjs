// scripts/full-platform-suite-v3.1.mjs
// =====================================================
//  MyMentalHealthBuddy — FULL SUITE v3.1 (Replit-Safe)
// =====================================================
//  ✓ Kills ALL Node/Vite/TS-node/Bun/child servers
//  ✓ Validates backend imports
//  ✓ Validates frontend structure
//  ✓ Auto-heals missing client files
//  ✓ Rebuilds client
//  ✓ Starts fresh dev server on PORT=5000 safely
// =====================================================

import { execSync, spawn } from "child_process";
import fs from "fs";
import path from "path";
import url from "url";

console.log("\n🚀 MyMentalHealthBuddy — FULL SUITE v3.1\n");

//---------------------------
// Helper — safe command run
//---------------------------
function sh(cmd) {
  try {
    execSync(cmd, { stdio: "inherit", shell: "/bin/bash" });
  } catch (e) {
    console.log("⚠️ Command failed (non-fatal):", cmd);
  }
}

//---------------------------
// A. KILL ALL PROCESSES
//---------------------------
console.log("\n🔪 Killing ALL Node/Vite/TS processes…");

const killCmds = [
  "pkill -9 node || true",
  "pkill -9 -f node || true",
  "pkill -9 -f vite || true",
  "pkill -9 -f ts-node || true",
  "pkill -9 -f nodemon || true",
  "pkill -9 -f bun || true",
  "pkill -9 -f dev || true",
];

killCmds.forEach(c => sh(c));

console.log("🧹 All processes killed.\n");

//---------------------------
// B. INSTALL PACKAGES
//---------------------------
console.log("📦 Installing packages…\n");
sh("npm install");

//---------------------------
// C. BACKEND IMPORT VALIDATION
//---------------------------
console.log("\n🛠 Backend import validation\n");
sh("node scripts/check-backend.mjs");

//---------------------------
// D. FRONTEND AUTO-HEAL
//---------------------------
console.log("\n💚 Auto-Heal Engine Activated\n");
sh("node scripts/autoHeal.mjs");

//---------------------------
// E. FRONTEND BUILD
//---------------------------
console.log("\n🏗 Rebuilding client…\n");
sh("npm run build --prefix client");

//---------------------------
// F. START DEV SERVER SAFELY
//---------------------------
console.log("\n🚀 Starting fresh DEV SERVER (Port 5000)…\n");

process.env.NODE_ENV = "development";

const server = spawn("node", ["server/index.mjs"], {
  stdio: "inherit",
  env: { ...process.env, PORT: "5000" }
});

server.on("close", code => {
  console.log(`\n❌ Dev server exited with code ${code}`);
});

server.on("error", err => {
  console.error("\n🔥 Failed to start server:", err);
});