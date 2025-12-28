import { execSync } from "node:child_process";

// scripts/restart-dev.mjs
import { spawnSync, spawn } from "node:child_process";

function sh(cmd) {
  // bash -lc so "|| true" works reliably
  return spawnSync("bash", ["-lc", cmd], { stdio: "inherit" });
}

// Kill anything that might be holding port 5000 / dev server
sh(`pkill -f "server/dev.mjs" || true`);
sh(`pkill -f "vite" || true`);
sh(`pkill -f "npm run dev" || true`);

sh(`sleep 1`);

// Start dev server and keep it running
const child = spawn("bash", ["-lc", "npm run dev"], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 0));