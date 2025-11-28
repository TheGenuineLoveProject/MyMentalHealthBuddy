// guardian-heart.mjs
// Maria's Guardian: gently protects with honesty and self-love.

import fs from "fs";

console.log("💛 MyMentalHealthBuddy Guardian — for Maria and every human.");

const messages = [
  "You are not broken. You are learning.",
  "Your feelings are real and allowed.",
  "Honesty with yourself is healing, not punishment.",
  "This platform exists to support, not judge.",
  "You are allowed to rest while building something beautiful."
];

for (const m of messages) {
  console.log(" •", m);
}

// Show basic project info if available
try {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  console.log("\nProject:", pkg.name, "v" + pkg.version);
} catch {}

// Optional health check
const url = process.env.HEALTH_URL
  || "https://my-mental-health-buddy.replit.app/api/health";

console.log("\nChecking API health at", url, "…");

try {
  const res = await fetch(url);
  const json = await res.json();
  console.log("✔ API health:", JSON.stringify(json));
} catch (err) {
  console.log("⚠ Could not reach API right now. That is okay. You are still safe.");
}

console.log("\nRemember: You are not behind. You are healing while you build. 💛");

