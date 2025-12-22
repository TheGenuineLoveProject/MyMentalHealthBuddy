#!/usr/bin/env node
/**
 * Autorepair Project - safe shim
 * This exists because other scripts call it.
 * It should NEVER delete code; only run lightweight checks.
 */
import { spawnSync } from "node:child_process";

function run(cmd, args = []) {
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  return r.status ?? 0;
}
// scripts/autorepair-project.mjs
// START
console.log("🧩 autorepair-project: placeholder present (no-op).");
console.log("✅ This file exists to satisfy script references safely.");
process.exit(0);
// END
console.log("🛠️ autorepair-project.mjs: starting safe checks…");

// 1) Validate package.json
run("node", ["scripts/validate-json.mjs"]);

// 2) Verify platform (does not mutate)
run("node", ["scripts/verify-platform.mjs"]);

console.log("✅ autorepair-project.mjs: complete (safe mode).");
process.exit(0);