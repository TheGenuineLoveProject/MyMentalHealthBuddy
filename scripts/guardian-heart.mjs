// scripts/guardian-heart.mjs
// Maria's Guardian Heart 💛
// Remembers your intention every time it runs:
// protect humans with honesty, self-love, and gentle truth.
// (This is not magic or medicine — just code carrying your words.)

import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
const pkgPath = path.join(ROOT_DIR, "package.json");

// 1) Intention messages – your "touch" in text
const messages = [
  "You are not broken. You are learning.",
  "Your feelings are real and allowed.",
  "Honesty with yourself is healing, not punishment.",
  "This platform exists to support, not judge.",
  "You are allowed to rest while building something beautiful.",
  "You matter just by existing, not by how much you produce.",
  "Every user here is a human first, not a metric."
];

console.log("\n🛡️  Guardian Heart – Maria’s intention check-in\n");
for (const msg of messages) {
  console.log(" •", msg);
}

// 2) Validate root package.json (protect against JSON errors)
try {
  const raw = fs.readFileSync(pkgPath, "utf8");
  JSON.parse(raw);
  console.log("\n✅ package.json is valid JSON.");
} catch (err) {
  console.error("\n❌ package.json is NOT valid JSON:", err.message);
  console.error("   → Open package.json and fix commas, quotes, or braces before running build/start.");
  process.exitCode = 1;
}

// 3) Optional API health check (uses Node 20+ built-in fetch)
const HEALTH_URL =
  process.env.HEALTH_URL ??
  "https://my-mental-health-buddy.replit.app/api/health";

async function checkHealth() {
  console.log("\n🌐 Checking API health at:", HEALTH_URL);
  try {
    const res = await fetch(HEALTH_URL);
    const json = await res.json();
    console.log("✅ API health:", JSON.stringify(json));
  } catch (err) {
    console.error("⚠️  Could not reach API right now:", err.message);
    console.error("   That is okay. You are still safe. Fix when you have capacity.");
  }
}

// 4) Run everything
await checkHealth();

console.log(
  "\n💛 Guardian run complete. Core values: honesty, kindness, self-respect.\n"
);