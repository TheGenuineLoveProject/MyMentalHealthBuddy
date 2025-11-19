#!/usr/bin/env node
// server/core/ai-governor.mjs
// Autonomous scheduler that runs each AI Employee's task by its schedule.
// Runs safely in Replit background; idempotent + console-visible.

import { exec } from "child_process";
import { AI_EMPLOYEES } from "./ai-employees.mjs";

console.log("🧠 Starting AI Governor…");

// Allowlist of valid commands from AI_EMPLOYEES (defense-in-depth)
const VALID_COMMANDS = new Set(AI_EMPLOYEES.map(emp => emp.command));

function runCommand(cmd, name, role) {
  // Validate command is from known allowlist
  if (!VALID_COMMANDS.has(cmd)) {
    console.error(`❌ Security: Rejected unknown command: ${cmd}`);
    return;
  }
  
  console.log(`🚀 ${name} (${role}) → ${cmd}`);
  const proc = exec(cmd, { shell: "/bin/bash" });
  proc.stdout.on("data", d => process.stdout.write(`   ${d}`));
  proc.stderr.on("data", d => process.stderr.write(`   ${d}`));
  proc.on("close", code => console.log(`✅ ${name} finished with code ${code}`));
}

// helper: milliseconds for each schedule keyword
const SCHEDULES = {
  hourly: 3600_000,
  daily: 24 * 3600_000,
  weekly: 7 * 24 * 3600_000
};

// launch each employee loop
for (const emp of AI_EMPLOYEES) {
  const delay = SCHEDULES[emp.schedule] ?? 24 * 3600_000;
  console.log(`${emp.role} ready → ${emp.schedule}`);
  runCommand(emp.command, emp.name, emp.role);
  setInterval(() => runCommand(emp.command, emp.name, emp.role), delay);
}

console.log("✅ AI Governor online — all employees scheduled.");