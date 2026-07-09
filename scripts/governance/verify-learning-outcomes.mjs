#!/usr/bin/env node
import fs from "node:fs";

const required = [
  "platform/learning/learning-object.schema.json",
  "platform/outcomes/outcome-measures.registry.json"
];

let ok = true;

for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`FAIL missing file: ${file}`);
    ok = false;
  } else {
    console.log(`PASS file exists: ${file}`);
  }
}

for (const file of required) {
  try {
    JSON.parse(fs.readFileSync(file, "utf8"));
    console.log(`PASS valid JSON: ${file}`);
  } catch {
    console.error(`FAIL invalid JSON: ${file}`);
    ok = false;
  }
}

if (!ok) {
  console.error("LEARNING_OUTCOMES_VERIFY_FAIL");
  process.exit(1);
}

console.log("LEARNING_OUTCOMES_VERIFY_PASS");
