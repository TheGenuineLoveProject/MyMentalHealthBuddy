#!/usr/bin/env node
import fs from "node:fs";

const failures = [];

const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
const exists = (file) => fs.existsSync(file);

const app = read("client/src/App.jsx") + "\n" + read("client/src/App.tsx");
const main = read("client/src/main.jsx") + "\n" + read("client/src/main.tsx");
const indexCss = read("client/src/index.css");
const lumiCss = read("client/src/styles/lumi-visual-system.css");
const avatarTsx = read("client/src/components/lumi/LumiBrandAvatar.tsx");
const avatarCss = read("client/src/components/lumi/LumiBrandAvatar.css");
const presenceTsx = read("client/src/components/lumi/LumiPresenceLayer.tsx");
const presenceCss = read("client/src/components/lumi/LumiPresenceLayer.css");

const requiredFiles = [
  "client/src/styles/lumi-visual-system.css",
  "client/src/components/lumi/LumiBrandAvatar.tsx",
  "client/src/components/lumi/LumiBrandAvatar.css",
  "client/src/components/lumi/LumiPresenceLayer.tsx",
  "client/src/components/lumi/LumiPresenceLayer.css",
  "client/public/avatar-core/master/MMHB_FLOAT_IDLE_UNIT_v1_clean_master.webp",
  "client/public/avatar-core/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_arm-l.webp",
  "client/public/avatar-core/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_arm-r.webp",
  "client/public/avatar-core/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_leg-l.webp",
  "client/public/avatar-core/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_leg-r.webp",
  "client/public/avatar-core/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_eyes.webp",
  "client/public/avatar-core/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_mouth.webp",
  "client/public/avatar-core/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_sparkles.webp"
];

for (const file of requiredFiles) {
  if (!exists(file)) failures.push(`MISSING_FILE ${file}`);
}

const mounted = (app + main + presenceTsx).includes("LumiPresenceLayer");
if (!mounted) failures.push("LUMI_PRESENCE_NOT_MOUNTED");

const requiredMarkers = [
  "data-official-lumi",
  "segmented-brand-rig",
  "MMHB_FLOAT_IDLE_UNIT_v1_region_eyes.webp",
  "MMHB_FLOAT_IDLE_UNIT_v1_region_mouth.webp",
  "MMHB_FLOAT_IDLE_UNIT_v1_region_arm-l.webp",
  "MMHB_FLOAT_IDLE_UNIT_v1_region_arm-r.webp",
  "MMHB_FLOAT_IDLE_UNIT_v1_region_leg-l.webp",
  "MMHB_FLOAT_IDLE_UNIT_v1_region_leg-r.webp"
];

for (const marker of requiredMarkers) {
  if (!avatarTsx.includes(marker)) failures.push(`MISSING_OFFICIAL_LUMI_MARKER ${marker}`);
}

const requiredMotion = [
  "lumi-eye-blink",
  "lumi-mouth-talk",
  "lumi-arm-left-wave",
  "lumi-arm-right-wave",
  "lumi-leg-left-sway",
  "lumi-leg-right-sway",
  "lumi-breathe",
  "lumi-float",
  "lumi-aura"
];

const allCss = [indexCss, lumiCss, avatarCss, presenceCss].join("\n");

for (const token of requiredMotion) {
  if (!allCss.includes(token)) failures.push(`MISSING_MOTION_TOKEN ${token}`);
}

const contrastRisk = /background[^;]*(#AFC6A1|#90AF85|sage)[^;]*;[\s\S]{0,160}color\s*:\s*(black|#000|#111)/i.test(allCss);
if (contrastRisk) failures.push("BUTTON_CONTRAST_RISK_SAGE_WITH_BLACK_TEXT");

if (!allCss.includes("prefers-reduced-motion")) failures.push("REDUCED_MOTION_SUPPORT_MISSING");

if (failures.length) {
  console.log("VISUAL_RUNTIME_GATE_FAIL");
  for (const failure of failures) console.log(failure);
  process.exit(1);
}

console.log("VISUAL_RUNTIME_GATE_PASS");
