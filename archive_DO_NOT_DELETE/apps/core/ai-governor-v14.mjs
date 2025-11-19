#!/usr/bin/env node
import cron from "node-cron";
import { execSync } from "child_process";

console.log("🤖 AI Governor v14 started...");

const jobs = [
  { label: "Daily Content", cron: "0 9 * * *", cmd: "npm run diagnose && npm run heal" },
  { label: "Weekly Chain", cron: "0 12 * * 1", cmd: "npm run weekly:chain" },
  { label: "Analytics Report", cron: "0 18 * * 5", cmd: "npm run verify" }
];

jobs.forEach(({ label, cron: schedule, cmd }) => {
  cron.schedule(schedule, () => {
    console.log(`⚡ Running ${label}...`);
    try {
      execSync(cmd, { stdio: "inherit" });
      console.log(`✅ ${label} complete.`);
    } catch (err) {
      console.error(`❌ ${label} failed:`, err.message);
    }
  });
});

console.log("📅 All scheduled AI Employee tasks active.");
