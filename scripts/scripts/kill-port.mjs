import { execSync } from "child_process";

const port = process.argv[2] || process.env.PORT || "5000";

function run(cmd) {
  try { return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString(); }
  catch { return ""; }
}

console.log(`🧹 Killing processes on port ${port} (safe Replit method)`);

// Try lsof first (most common)
const pids = run(`lsof -ti tcp:${port}`).trim().split("\n").filter(Boolean);

if (pids.length === 0) {
  console.log("✅ No processes found on that port.");
  process.exit(0);
}

for (const pid of pids) {
  try {
    execSync(`kill -9 ${pid}`);
    console.log(`✅ Killed PID ${pid}`);
  } catch {
    console.log(`⚠️ Could not kill PID ${pid}`);
  }
}

console.log("✅ Port cleanup complete.");