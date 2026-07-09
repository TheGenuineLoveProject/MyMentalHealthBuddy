#!/usr/bin/env node
import fs from "node:fs";

const file = "docs/operations/production-incident-response-runbook.md";

if (!fs.existsSync(file)) {
  throw new Error("Missing production incident response runbook");
}

const text = fs.readFileSync(file, "utf8");

const required = [
  "Incident Categories",
  "SEV-1 Critical",
  "SEV-2 High",
  "SEV-3 Medium",
  "Required Response Steps",
  "Launch Rule",
  "Production launch must not proceed"
];

for (const item of required) {
  if (!text.includes(item)) {
    throw new Error(`Missing incident response requirement: ${item}`);
  }
  console.log(`PASS incident response requirement documented: ${item}`);
}

console.log("INCIDENT_RESPONSE_READINESS_VERIFY_PASS");
