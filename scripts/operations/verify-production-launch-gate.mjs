#!/usr/bin/env node
import fs from "node:fs";

const file = "docs/operations/production-launch-gate-checklist.md";

if (!fs.existsSync(file)) {
  throw new Error("Missing production launch gate checklist");
}

const text = fs.readFileSync(file, "utf8");

const required = [
  "API health returns 200",
  "Readiness endpoint returns 200",
  "Typecheck passes",
  "Test suite passes",
  "Build completes successfully",
  "Route contract verification passes",
  "Safety guardrail verification passes",
  "Stripe monetization contract passes",
  "Rate-limit verification passes",
  "HealthKit signature and webhook verification pass",
  "Backup readiness verification passes",
  "Real backup environment verification passes",
  "Production backup launch proof passes",
  "Observability readiness verification passes",
  "Incident response readiness verification passes",
  "Hard Launch Blockers"
];

for (const item of required) {
  if (!text.includes(item)) {
    throw new Error(`Missing launch gate item: ${item}`);
  }
  console.log(`PASS launch gate documented: ${item}`);
}

console.log("PRODUCTION_LAUNCH_GATE_VERIFY_PASS");
