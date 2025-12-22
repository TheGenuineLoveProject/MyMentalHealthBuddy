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
// Safe no-op shim so permanent-fix / scripts don't crash if this file is referenced.
// Keep this file forever unless you fully remove all references.
console.log("✅ autorepair-project shim: OK (no-op).");
process.exit(0);

console.log("🛠️ autorepair-project.mjs: starting safe checks…");

// 1) Validate package.json
run("node", ["scripts/validate-json.mjs"]);

// 2) Verify platform (does not mutate)
run("node", ["scripts/verify-platform.mjs"]);

console.log("✅ autorepair-project.mjs: complete (safe mode).");
process.exit(0);