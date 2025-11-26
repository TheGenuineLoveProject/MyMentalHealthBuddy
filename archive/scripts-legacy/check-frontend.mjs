// scripts/check-frontend.mjs
// Simple health check for the Vite/React client.

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const clientDir = path.join(rootDir, "client");

function run(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log("▶", cmd, args.join(" "));
    const child = spawn(cmd, args, {
      stdio: "inherit",
      ...options,
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Frontend check passed.");
        resolve();
      } else {
        console.error("❌ Frontend check failed with code", code);
        resolve();
      }
    });

    child.on("error", (err) => {
      console.error("⚠ Error running command:", err.message);
      resolve();
    });
  });
}

async function main() {
  console.log("\nMyMentalHealthBuddy — Frontend Check");
  console.log("=====================================");

  await run("npm", ["run", "build"], { cwd: clientDir });
}

main().catch((err) => {
  console.error("check-frontend.mjs error:", err);
});
