// autoheal-project.mjs
// Quantum AutoHeal Project Runner (Safe Edition, Write-Mode)

import { healFolder, healFile } from "./autoheal-core.mjs";

// ----------------------------------------------
// TARGET FOLDERS TO HEAL
// ----------------------------------------------
const TARGETS = [
  "client/src",
  "server",
  "scripts",
  "drizzle"
];

// ----------------------------------------------
// TARGET INDIVIDUAL FILES WITH KNOWN FIXES
// ----------------------------------------------

// Fix 1: API utils
healFile("client/src/utils/api.ts");

// Fix 2: Dashboard fixes
healFile("client/src/pages/dashboard.tsx");

// Fix 3: Server request ID
healFile("server/middleware/requestId.mjs");

// ----------------------------------------------
// RUN FOLDER HEALING
// ----------------------------------------------

console.log("🚀 AutoHeal (Write-Mode) Started\n");

for (const folder of TARGETS) {
  console.log(`🛠 Healing folder: ${folder}`);
  healFolder(folder);
}

console.log("\n✅ AutoHeal Complete (Write-Mode)\n");
console.log("You may now re-run the full automation suite if desired.");