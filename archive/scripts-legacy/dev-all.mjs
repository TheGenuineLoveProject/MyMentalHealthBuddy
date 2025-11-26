// scripts/dev-all.mjs
// Convenience launcher: kill ports, then `npm run dev`.
// (Assumes your package.json dev script starts backend; Replit will handle frontend separately.)

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function run(cmd, args, options = {}) {
  return new Promise((resolve) => {
    console.log("▶", cmd, args.join(" "));
    const child = spawn(cmd, args, {
      stdio: "inherit",
      ...options,
    });

    child.on("close", () => resolve());
    child.on("error", () => resolve());
  });
}

async function main() {
  console.log("\nMyMentalHealthBuddy — dev-all launcher");
  console.log("=======================================");

  // 1) Kill stray ports
  await run("node", ["scripts/kill-ports.mjs"], { cwd: rootDir });

  // 2) Start backend dev server
  await run("npm", ["run", "dev"], { cwd: rootDir });

  console.log("dev-all finished.");
}

main().catch((err) => {
  console.error("dev-all.mjs error:", err);
});
