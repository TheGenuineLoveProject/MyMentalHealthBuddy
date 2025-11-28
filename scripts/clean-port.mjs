// scripts/clean-port.mjs
import { execSync } from "node:child_process";

try {
  console.log("🔧 Cleaning Node processes on port 5000...");
  execSync(`pkill -f node || true`, { stdio: "inherit" });
  console.log("✅ Port 5000 is free.");
} catch (err) {
  console.error("❌ Failed to clean port:", err);
}