#!/usr/bin/env node
import fs from "node:fs";

const file = "docs/operations/deployment-readiness-final-gate.md";

if (!fs.existsSync(file)) {
  throw new Error("Missing deployment readiness final gate");
}

const text = fs.readFileSync(file, "utf8");

const required = [
  "Build passes",
  "Typecheck passes",
  "Test suite passes",
  "Route contract verification passes",
  "Safety guardrails pass",
  "Stripe contract passes",
  "Rate-limit verification passes",
  "HealthKit verification passes",
  "Backup readiness passes",
  "Real backup environment verification passes",
  "Production backup launch proof passes",
  "Observability readiness passes",
  "Incident response readiness passes",
  "Production launch gate passes",
  "Deployment target health check passes",
  "Deployment Blockers"
];

for (const item of required) {
  if (!text.includes(item)) {
    throw new Error(`Missing deployment readiness item: ${item}`);
  }
  console.log(`PASS deployment readiness documented: ${item}`);
}

console.log("DEPLOYMENT_READINESS_FINAL_GATE_PASS");
