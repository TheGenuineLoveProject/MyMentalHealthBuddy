#!/usr/bin/env node
import fs from "node:fs";

const requiredFiles = [
  "client/src/styles/lumi-visual-system.css",
  "scripts/visual-runtime-gate.mjs",
  "scripts/visual-polish-gate.mjs"
];

const requiredTokens = [
  "--lumi-page-max",
  "--lumi-section-gap",
  "--lumi-hero-gap",
  "--lumi-surface-glass",
  "--lumi-text-strong",
  "Page Hero Coherence",
  "CTA visibility",
  "section:first-of-type",
  "prefers-reduced-motion",
];

let failures = [];
let corpus = "";

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    failures.push(`MISSING_FILE ${file}`);
    continue;
  }
  corpus += `\n/* ${file} */\n${fs.readFileSync(file, "utf8")}`;
}

for (const token of requiredTokens) {
  if (!corpus.includes(token)) failures.push(`MISSING_TOKEN ${token}`);
}

const css = fs.existsSync("client/src/styles/lumi-visual-system.css")
  ? fs.readFileSync("client/src/styles/lumi-visual-system.css", "utf8")
  : "";

if (/color:\s*black\s*!important/i.test(css)) failures.push("BLACK_IMPORTANT_TEXT_FOUND");
if (/opacity:\s*0(?:\.0+)?\s*;/i.test(css)) failures.push("ZERO_OPACITY_RISK_FOUND");

if (failures.length) {
  console.log("PAGE_COHERENCE_GATE_FAIL");
  for (const failure of failures) console.log(failure);
  process.exit(1);
}

console.log("PAGE_COHERENCE_GATE_PASS");
