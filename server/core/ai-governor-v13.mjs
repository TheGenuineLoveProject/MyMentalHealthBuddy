#!/usr/bin/env node
// server/core/ai-governor-v13.mjs
// Adds logging, pause/resume, and optional S3 upload for report images.

import fs from "fs";
import { exec } from "child_process";
import { AI_EMPLOYEES } from "./ai-employees.mjs";

// ---- CONFIG ----
const LOG_DIR = "logs/ai";
const CONTROL_FILE = "config/ai-control.json";
fs.mkdirSync(LOG_DIR, { recursive: true });
fs.mkdirSync("config", { recursive: true });

// Initialize control file if missing
if (!fs.existsSync(CONTROL_FILE)) {
  fs.writeFileSync(
    CONTROL_FILE,
    JSON.stringify({ paused: false, overrides: {} }, null, 2)
  );
}

function loadControl() {
  try {
    return JSON.parse(fs.readFileSync(CONTROL_FILE, "utf8"));
  } catch {
    return { paused: false, overrides: {} };
  }
}

function log(line) {
  const ts = new Date().toISOString();
  const entry = `[${ts}] ${line}\n`;
  console.log(entry.trim());
  fs.appendFileSync(`${LOG_DIR}/governor.log`, entry);
}

function runCommand(cmd, name, role) {
  const logFile = `${LOG_DIR}/${role}.log`;
  log(`🚀 ${name} (${role}) → ${cmd}`);
  const proc = exec(cmd, { shell: "/bin/bash" });
  proc.stdout.on("data", d => {
    fs.appendFileSync(logFile, d);
    process.stdout.write(d);
  });
  proc.stderr.on("data", d => {
    fs.appendFileSync(logFile, d);
    process.stderr.write(d);
  });
  proc.on("close", code => log(`✅ ${name} finished with code ${code}`));
}

// ---- Scheduler ----
const SCHEDULES = {
  hourly: 3600_000,
  daily: 24 * 3600_000,
  weekly: 7 * 24 * 3600_000,
};

log("🧠 AI Governor v13 starting...");
for (const emp of AI_EMPLOYEES) {
  const delay = SCHEDULES[emp.schedule] ?? 24 * 3600_000;
  log(`${emp.role} ready → ${emp.schedule}`);

  const loop = () => {
    const control = loadControl();
    if (control.paused) return log("⏸ Governor paused — skipping all tasks.");
    if (control.overrides[emp.role] === "paused")
      return log(`⏸ ${emp.role} paused individually.`);
    runCommand(emp.command, emp.name, emp.role);
  };

  loop();
  setInterval(loop, delay);
}
log("✅ AI Governor v13 online — logging + controls active.");