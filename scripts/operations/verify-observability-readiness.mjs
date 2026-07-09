#!/usr/bin/env node
import fs from "node:fs";

const file = "docs/operations/production-observability-readiness.md";

if (!fs.existsSync(file)) {
  throw new Error("Missing production observability readiness document");
}

const text = fs.readFileSync(file, "utf8");

const required = [
  "API health",
  "readiness status",
  "backup readiness",
  "Stripe webhook",
  "HealthKit webhook",
  "safety guardrail",
  "Incident Response Rule",
  "Production failures must never be silent"
];

for (const item of required) {
  if (!text.includes(item)) {
    throw new Error(`Missing observability requirement: ${item}`);
  }
  console.log(`PASS observability requirement documented: ${item}`);
}

console.log("OBSERVABILITY_READINESS_VERIFY_PASS");
