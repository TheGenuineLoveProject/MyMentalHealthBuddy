import { execSync } from "node:child_process";

const tasks = [
  "scripts/scan-ui.mjs",
  "scripts/scan-api.mjs",
  "scripts/scan-critical.mjs",
  "scripts/scan-types.mjs",
  "scripts/scan-vips.mjs"
];

console.log("🧪 Running full automation suite...");

for (const t of tasks) {
  try {
    console.log(`🔹 Running ${t}...`);
    execSync(`node ${t}`, { stdio: "inherit" });
  } catch (err) {
    console.log(`⚠️ Error: ${err.message}`);
  }
}

console.log("🧪 Automation Suite Complete");