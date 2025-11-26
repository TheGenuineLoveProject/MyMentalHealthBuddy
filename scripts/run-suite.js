// run-suite.mjs — Runs all automation scans

import { execSync } from "node:child_process";

const tasks = [
  "scripts/scan-ui.mjs",
  "scripts/scan-api.mjs",
  "scripts/scan-types.mjs",
  "scripts/scan-critical.mjs",
  "scripts/autoheal.mjs"
];

console.log("\n🚀 Running Full Automation Suite\n");

for (const t of tasks) {
  try {
    console.log(`\n➡️ Running ${t}\n`);
    execSync(`node ${t}`, { stdio: "inherit" });
  } catch (err) {
    console.log("❌ Error:", err.message);
  }
}

console.log("\n✨ Automation Suite Complete\n");