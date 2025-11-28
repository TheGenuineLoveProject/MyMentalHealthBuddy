// clean-port.mjs
import { execSync } from "child_process";

console.log("🧹 Cleaning any process running on port 5000…");

try {
  execSync("killall node || true");
  console.log("✔ Port 5000 cleaned");
} catch (err) {
  console.error("❌ Could not clean port:", err.message);
}

console.log("✨ Done.");