#!/usr/bin/env node
import fs from "node:fs";

const files = [
  "client/src/styles/lumi-visual-system.css",
  "client/src/components/lumi/LumiPresenceLayer.css",
  "client/src/components/lumi/LumiBrandAvatar.css",
  "client/src/components/lumi/LumiBrandAvatar.tsx",
  "client/src/main.jsx"
];

const requiredTokens = [
  "--lumi-serenity-sage-100",
  "--lumi-serenity-sage-200",
  "--lumi-eternal-cream-100",
  "--lumi-healing-gold-300",
  "--lumi-compassion-rose-200",
  "--lumi-hope-sky-200",
  "--lumi-readable-on-sage",
  "--lumi-readable-on-gold",
  "data-official-lumi",
  "segmented-brand-rig",
  "lumi-eye-blink",
  "lumi-mouth-talk",
  "lumi-arm-left-wave",
  "lumi-leg-left-sway",
  "LumiPresenceLayer"
];

let corpus = "";
let failures = [];

for (const file of files) {
  if (!fs.existsSync(file)) {
    failures.push(`MISSING_FILE ${file}`);
    continue;
  }
  corpus += `\n/* ${file} */\n` + fs.readFileSync(file, "utf8");
}

for (const token of requiredTokens) {
  if (!corpus.includes(token)) failures.push(`MISSING_TOKEN ${token}`);
}

if (/color:\s*black\s*!important/i.test(corpus)) {
  failures.push("BLACK_IMPORTANT_TEXT_FOUND");
}

if (/background:\s*#000/i.test(corpus)) {
  failures.push("PURE_BLACK_BACKGROUND_FOUND");
}

if (failures.length) {
  console.log("VISUAL_POLISH_GATE_FAIL");
  for (const failure of failures) console.log(failure);
  process.exit(1);
}

console.log("VISUAL_POLISH_GATE_PASS");
