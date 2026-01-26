// scripts/preflight.mjs
// Maria's Preflight Guardian 🛡
// Runs your helpers in order so builds + starts are safer and calmer.

import { execSync } from "child_process";
import { spawnSync } from "node:child_process";

function run(name, cmd, args) {
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  const code = r.status ?? 1;
  return { name, code };
}

const checks = [
  ["dup-scan", "node", ["scripts/dup-scan.mjs"]],
  ["scan-collisions", "node", ["scripts/scan-collisions.mjs"]],
  ["keeper-audit", "node", ["scripts/keeper-audit.mjs"]],
  ["arch-scan", "node", ["scripts/arch-scan.mjs"]],
];

let worst = 0;
for (const [name, cmd, args] of checks) {
  console.log("\n=== PRECHECK:", name, "===\n");
  const { code } = run(name, cmd, args);
  if (code > worst) worst = code;
}

if (worst >= 2) {
  console.log("\nPRELIGHT: FAIL (high severity duplicates/collisions). Fix before proceeding.\n");
  process.exit(2);
}
if (worst === 1) {
  console.log("\nPREFLIGHT: WARN (medium severity or recommendations). Review reports before proceeding.\n");
  process.exit(1);
}

console.log("\nPREFLIGHT: PASS.\n");
process.exit(0);
function runStep(label, command) {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`▶ ${label}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  try {
    execSync(command, { stdio: "inherit" });
    console.log(`✅ ${label} completed.`);
  } catch (err) {
    console.error(`❌ ${label} failed.`);
    console.error("   Details:", err.message);
    // do not hard-crash here; each tool already prints its own guidance
  }
}