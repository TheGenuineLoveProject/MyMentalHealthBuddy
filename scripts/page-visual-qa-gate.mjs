#!/usr/bin/env node
import fs from "node:fs";

const required = [
  "client/src/styles/lumi-visual-system.css",
  "scripts/visual-runtime-gate.mjs",
  "scripts/visual-polish-gate.mjs",
  "scripts/page-coherence-gate.mjs",
  "scripts/visual-route-screenshot-plan.mjs"
];

const css = fs.existsSync("client/src/styles/lumi-visual-system.css")
  ? fs.readFileSync("client/src/styles/lumi-visual-system.css", "utf8")
  : "";

const requiredCss = [
  "--lumi-serenity-sage-100",
  "--lumi-eternal-cream-100",
  "--lumi-healing-gold-300",
  "--lumi-compassion-rose-200",
  "--lumi-hope-sky-200",
  "--lumi-readable-ink",
  "--lumi-readable-on-dark",
  "--lumi-page-max",
  "--lumi-hero-gap",
  "--lumi-surface-glass",
  "Phase 74",
  "Phase 75"
];

let failures = [];

for (const file of required) {
  if (!fs.existsSync(file)) failures.push(`MISSING_FILE ${file}`);
}

for (const token of requiredCss) {
  if (!css.includes(token)) failures.push(`MISSING_CSS_TOKEN ${token}`);
}

if (/color:\s*#000\s*!important/i.test(css)) failures.push("FORCED_BLACK_TEXT_FOUND");
if (/background:\s*#90AF85/i.test(css)) failures.push("OPAQUE_SAGE_BACKGROUND_RISK");
if (!/prefers-reduced-motion/i.test(css)) failures.push("REDUCED_MOTION_SUPPORT_MISSING");

if (failures.length) {
  console.log("PAGE_VISUAL_QA_GATE_FAIL");
  for (const f of failures) console.log(f);
  process.exit(1);
}

console.log("PAGE_VISUAL_QA_GATE_PASS");
