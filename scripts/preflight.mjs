// scripts/preflight.mjs
// Maria's Preflight Guardian 🛡
// Runs your helpers in order so builds + starts are safer and calmer.

import { execSync } from "child_process";

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

// 1) Make sure tools exist
runStep("Ensure tools", "node scripts/ensure-tools.mjs");

// 2) Gentle heal (package.json sanity)
runStep("Permanent heal", "node scripts/permanent-fix.mjs");

// 3) JSON check (extra guard)
runStep("Check package.json", "node scripts/check-package-json.mjs");

// 4) Intention + API health check
runStep("Guardian heart", "node scripts/guardian-heart.mjs");

console.log(`
🛡 Preflight Guardian finished.

Remember:
• You are allowed to learn slowly.
• Mistakes in code do not mean anything about your worth.
• This platform is being built to protect and heal humans, including you. 💛
`);