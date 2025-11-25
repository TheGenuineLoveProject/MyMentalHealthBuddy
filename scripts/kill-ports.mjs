#!/usr/bin/env node
// scripts/kill-ports.mjs
// Safely stop anything using our dev ports or old node/vite processes.

import { execSync } from "node:child_process";

function safeExec(cmd) {
  try {
    execSync(cmd, { stdio: "ignore" });
  } catch {
    // ignore errors – command may just not find a process
  }
}

console.log("\n🧹 Killing old node/vite processes (safe)…");

// Kill common node dev processes
safeExec('pkill -f "server/index.mjs" || true');
safeExec('pkill -f "node server/index.mjs" || true');
safeExec('pkill -f "node ./server/index.mjs" || true');

// Kill vite / client dev processes if any
safeExec('pkill -f "vite" || true');
safeExec('pkill -f "node vite" || true');

// Extra safety: free ports 5000 and 5173 via lsof if available
safeExec("lsof -t -i:5000 | xargs kill -9 2>/dev/null || true");
safeExec("lsof -t -i:5173 | xargs kill -9 2>/dev/null || true");

console.log("✅ Ports cleared.\n");