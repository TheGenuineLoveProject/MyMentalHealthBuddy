#!/usr/bin/env node
import fs from "node:fs";

const file = "platform/clinical-safety/psychopathology-education.taxonomy.json";

let ok = true;

if (!fs.existsSync(file)) {
  console.error(`FAIL missing file: ${file}`);
  ok = false;
} else {
  console.log(`PASS file exists: ${file}`);
}

let data = null;

try {
  data = JSON.parse(fs.readFileSync(file, "utf8"));
  console.log(`PASS valid JSON: ${file}`);
} catch {
  console.error(`FAIL invalid JSON: ${file}`);
  ok = false;
}

const required = [
  "schemaVersion",
  "purpose",
  "nonDiagnosticRule",
  "domains",
  "requiredSafeguards",
  "contentRules",
  "adaptationRules"
];

if (data) {
  for (const key of required) {
    if (!(key in data)) {
      console.error(`FAIL missing key: ${key}`);
      ok = false;
    } else {
      console.log(`PASS key present: ${key}`);
    }
  }

  const text = JSON.stringify(data).toLowerCase();

  const requiredPhrases = [
    "must not assign diagnoses",
    "crisis resources",
    "professional support",
    "do not monetize"
  ];

  for (const phrase of requiredPhrases) {
    if (!text.includes(phrase)) {
      console.error(`FAIL missing safeguard phrase: ${phrase}`);
      ok = false;
    } else {
      console.log(`PASS safeguard phrase present: ${phrase}`);
    }
  }
}

if (!ok) {
  console.error("CLINICAL_SAFETY_TAXONOMY_VERIFY_FAIL");
  process.exit(1);
}

console.log("CLINICAL_SAFETY_TAXONOMY_VERIFY_PASS");
