// scripts/kill-port.mjs
// START
import { execSync } from "node:child_process";

const port = Number(process.env.PORT || 5000);

function run(cmd) {
  try {
    execSync(cmd, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

console.log(`🔧 kill-port: attempting to free port ${port}...`);

let killed = false;

// Linux (Replit) approach: fuser
killed = run(`bash -lc "command -v fuser >/dev/null && fuser -k ${port}/tcp"`) || killed;

// Fallback: lsof + kill
killed = run(`bash -lc "command -v lsof >/dev/null && kill -9 $(lsof -t -i:${port}) 2>/dev/null"`) || killed;

if (killed) {
  console.log(`✅ Port ${port} was in use and has been freed.`);
} else {
  console.log(`ℹ️ Port ${port} did not appear to be in use (or no permission).`);
}
// END