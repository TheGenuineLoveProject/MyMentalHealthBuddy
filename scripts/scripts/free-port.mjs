#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const port = Number(process.argv[2] || process.env.PORT || 5000);

function sh(cmd) {
  return spawnSync(cmd, { stdio: "inherit", shell: true }).status ?? 0;
}

console.log(`🔌 free-port: checking port ${port}…`);

// Try lsof (common on Replit). If not present, we just warn.
const status = sh(`command -v lsof >/dev/null 2>&1 && lsof -ti :${port} | xargs -r kill -9 || true`);

if (status !== 0) {
  console.log("ℹ️ free-port: could not auto-kill (tool missing or no process).");
}
console.log("✅ free-port: done.");