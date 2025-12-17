// scripts/free-port.mjs
import { execSync } from "node:child_process";

const ports = [5000, 5173];

function tryRun(cmd) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
}

for (const port of ports) {
  const pids = tryRun(`lsof -ti tcp:${port} || true`)
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);

  if (pids.length) {
    console.log(`[free-port] Port ${port} in use by PID(s): ${pids.join(", ")} → killing...`);
    for (const pid of pids) {
      tryRun(`kill -9 ${pid} || true`);
    }
  } else {
    console.log(`[free-port] Port ${port} is free.`);
  }
}

console.log("[free-port] Done.");