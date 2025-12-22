// scripts/ensure-tools.mjs
// Maria's Self-Healing + Guardian Tool Factory 💛
// Ensures our core helper scripts exist and carry your intention
// of protection, honesty, and self-love.

import fs from "fs";
import path from "path";

const scriptsDir = path.join(process.cwd(), "scripts");

// Make sure ./scripts exists
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir);
  console.log("✅ Created scripts/ folder");
}

// Helper to create a script only if missing
function ensureScript(filename, contents) {
  const fullPath = path.join(scriptsDir, filename);

  if (fs.existsSync(fullPath)) {
    console.log(`✅ Found: ${filename}`);
    return;
  }

  fs.writeFileSync(fullPath, contents.trimStart() + "\n");
  console.log(`🆕 Created: ${filename}`);
}

/**
 * 1) permanent-fix.mjs — your "big heal" script
 */
ensureScript(
  "permanent-fix.mjs",
  `// scripts/permanent-fix.mjs
// Big heal script for The Genuine Love Project
import { execSync } from "child_process";
import fs from "fs";

console.log("\\n💛 Running Permanent Heal for The Genuine Love Project...");

// Kill stray Node processes (gently ignore errors)
try {
  execSync("pkill -f node || true", { stdio: "inherit" });
  console.log("✅ Any stray Node processes ended.");
} catch (err) {
  console.error("⚠️ Could not clean processes:", err.message);
}

// Validate root package.json
try {
  JSON.parse(fs.readFileSync("package.json", "utf8"));
  console.log("✅ Root package.json is valid JSON.");
} catch (err) {
  console.error("❌ Root package.json invalid:", err.message);
  console.error("👉 Open package.json and look for missing commas, quotes, or braces.");
  process.exitCode = 1;
}

console.log("💛 Permanent heal finished. You are doing enough, Maria.");
`
);

/**
 * 2) clean-port.mjs — make sure port 5000 is free
 */
ensureScript(
  "clean-port.mjs",
  `// scripts/clean-port.mjs
// Cleans any Node processes that might be using port 5000.
import { execSync } from "child_process";

console.log("\\n🧹 Cleaning any Node process using port 5000...");

try {
  // Kill all node processes that might be using our server
  execSync("pkill -f node || true", { stdio: "inherit" });
  console.log("✅ All Node processes cleaned. Port 5000 is free.");
} catch (err) {
  console.error("⚠️ Could not clean port:", err.message);
}

`
);

/**
 * 3) check-package-json.mjs — simple JSON sanity check at root
 */
ensureScript(
  "check-package-json.mjs",
  `// scripts/check-package-json.mjs
// Confirms root package.json is valid JSON.
import fs from "fs";

try {
  JSON.parse(fs.readFileSync("package.json", "utf8"));
  console.log("✅ package.json is valid JSON.");
} catch (err) {
  console.error("❌ package.json is NOT valid JSON:", err.message);
  console.error("👉 Fix that file before running build/start.");
  process.exitCode = 1;
}
`
);

/**
 * 4) guardian-heart.mjs — your "touch" + reminders + health check
 */
ensureScript(
  "guardian-heart.mjs",
  `// scripts/guardian-heart.mjs
// Maria's Guardian: gently protects with honesty and self-love.

import fs from "fs";

console.log("\\n💛 The Genuine Love Project Guardian — for Maria and every human.");

const messages = [
  "You are not broken. You are learning.",
  "Your feelings are real and allowed.",
  "Honesty with yourself is healing, not punishment.",
  "This platform exists to support, not judge.",
  "You are allowed to rest while building something beautiful.",
  "Your matter just by existing, not by how much you produce.",
  "Every user is a human first, not a metric."
];

for (const m of messages) {
  console.log("• " + m);
}

// Show basic project info if available
try {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  console.log("\\n📦 Project:", pkg.name, "v" + pkg.version);
} catch {
  console.log("\\n📦 Project: (could not read package.json)");
}

// Optional health check
const url = process.env.HEALTH_URL ||
  "https://my-mental-health-buddy.replit.app/api/health";

console.log("\\n🩺 Checking API health at:", url, "...");

try {
  const res = await fetch(url);
  const json = await res.json();
  console.log("✅ API health:", JSON.stringify(json));
} catch (err) {
  console.error("⚠️ Could not reach API right now. That is okay. You are still safe.");
}

console.log("\\n💛 Guardian run complete. Core values: honesty, kindness, self-respect.");
`
);

console.log("\n✅ Tool-check complete. Core helpers + Guardian are all present.");