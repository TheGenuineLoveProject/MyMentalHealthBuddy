#!/usr/bin/env node
import fs from "node:fs";

console.log("🧪 Smoke test: starting…");

// Basic checks
if (!fs.existsSync("package.json")) {
  console.error("❌ package.json missing");
  process.exit(1);
}

console.log("✅ Smoke test passed (basic filesystem checks).");
process.exit(0);