// scripts/permanent-fix.mjs
// Maria's Love + Safety Guardian
// ESM-only, Replit-safe, Node 20+

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
// permanent-fix.mjs
import { execSync } from "child_process";
import fs from "fs";

console.log("🔧 Running Permanent Fix…");

// 1. Kill all Node processes
try {
  execSync("killall node || true");
  console.log("✔ Node processes cleaned");
} catch {}

// 2. Validate package.json
try {
  JSON.parse(fs.readFileSync("package.json", "utf8"));
  console.log("✔ package.json valid");
} catch (err) {
  console.error("❌ Invalid package.json:", err.message);
}

// 3. Confirm scripts directory exists
if (!fs.existsSync("./scripts")) {
  console.error("❌ Scripts folder missing");
} else {
  console.log("✔ Scripts folder OK");
}

console.log("✨ Permanent Fix Completed");

const ROOT = process.cwd();

// --- tiny helper: run a shell command safely ---
function run(label, cmd) {
  try {
    console.log(`\n💛 [${label}] ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
    console.log(`✅ [${label}] done.`);
  } catch (err) {
    console.error(`❌ [${label}] failed:`, err.message ?? err);
  }
}

// --- tiny helper: validate JSON file exists + parses ---
function checkJson(relativePath) {
  const full = path.join(ROOT, relativePath);
  if (!fs.existsSync(full)) {
    console.warn(`⚠️  Missing file: ${relativePath}`);
    return false;
  }

  try {
    const raw = fs.readFileSync(full, "utf8");
    JSON.parse(raw);
    console.log(`✅ JSON OK: ${relativePath}`);
    return true;
  } catch (err) {
    console.error(`❌ JSON INVALID: ${relativePath}`);
    console.error("   ", err.message ?? err);
    return false;
  }
}

function main() {
  console.log("────────────────────────────");
  console.log("💛 MyMentalHealthBuddy — Heal Tool");
  console.log("   (Love + Safety + Error Guard)");
  console.log("────────────────────────────");

  // 1) Check root package.json
  checkJson("package.json");

  // 2) Check client package.json (if client exists)
  if (fs.existsSync(path.join(ROOT, "client"))) {
    checkJson("client/package.json");
  } else {
    console.log("ℹ️  No client/ folder detected, skipping client/package.json.");
  }

  // 3) Clean any stuck Node processes / ports via your existing script
  if (fs.existsSync(path.join(ROOT, "scripts", "clean-port.mjs"))) {
    run("clean-port", "node scripts/clean-port.mjs");
  } else {
    console.log("ℹ️  No scripts/clean-port.mjs found, skipping port cleanup.");
  }

  // 4) Optional: run your JSON checker script (if present)
  if (fs.existsSync(path.join(ROOT, "scripts", "check-package-json.mjs"))) {
    run("check:package", "node scripts/check-package-json.mjs");
  } else {
    console.log("ℹ️  No scripts/check-package-json.mjs found, skipping deep JSON check.");
  }

  console.log("\n💛 Reminder from Maria to every human who touches this project:");
  console.log("   You are not broken. You are learning to remember yourself.");
  console.log("   This platform exists to reflect genuine love back to you.\n");

  console.log("✨ Heal tool finished. If there are still errors above,");
  console.log("   we can fix them one by one — gently, without self-attack.\n");
}

main();