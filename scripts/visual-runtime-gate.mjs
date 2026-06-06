import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "client/src/styles/lumi-visual-system.css",
  "client/src/components/lumi/LumiBrandAvatar.tsx",
  "client/src/components/lumi/LumiBrandAvatar.css",
  "client/src/components/lumi/LumiPresenceLayer.tsx",
  "client/src/components/lumi/LumiPresenceLayer.css",
];

const requiredCssTokens = [
  "--lumi-sage-100",
  "--lumi-sage-200",
  "--lumi-sage-300",
  "--lumi-sage-400",
  "--lumi-cream-100",
  "--lumi-gold-300",
  "--lumi-rose-100",
  "--lumi-sky-100",
];

const requiredMotion = [
  "lumi-official-breathe",
  "lumi-eye-blink",
  "lumi-arm-left-wave",
  "lumi-arm-right-wave",
  "lumi-leg-left-sway",
  "lumi-leg-right-sway",
  "prefers-reduced-motion",
];

const failures = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) failures.push(`MISSING_FILE ${file}`);
}

const visualCss = fs.existsSync("client/src/styles/lumi-visual-system.css")
  ? fs.readFileSync("client/src/styles/lumi-visual-system.css", "utf8")
  : "";

for (const token of requiredCssTokens) {
  if (!visualCss.includes(token)) failures.push(`MISSING_TOKEN ${token}`);
}

const avatarCss = fs.existsSync("client/src/components/lumi/LumiBrandAvatar.css")
  ? fs.readFileSync("client/src/components/lumi/LumiBrandAvatar.css", "utf8")
  : "";

for (const motion of requiredMotion) {
  if (!avatarCss.includes(motion) && !visualCss.includes(motion)) failures.push(`MISSING_MOTION ${motion}`);
}

const appPath = ["client/src/App.jsx", "client/src/App.tsx"].find((p) => fs.existsSync(p));
const appSrc = appPath ? fs.readFileSync(appPath, "utf8") : "";
if (!appSrc.includes("LumiPresenceLayer")) failures.push("LUMI_PRESENCE_NOT_IMPORTED_IN_APP");
if (!appSrc.includes("<LumiPresenceLayer />")) failures.push("LUMI_PRESENCE_NOT_MOUNTED_IN_APP");

const avatarSrc = fs.existsSync("client/src/components/lumi/LumiBrandAvatar.tsx")
  ? fs.readFileSync("client/src/components/lumi/LumiBrandAvatar.tsx", "utf8")
  : "";
if (!avatarSrc.includes("data-official-lumi")) failures.push("OFFICIAL_LUMI_RIG_MARKER_MISSING");
if (!avatarSrc.includes("MMHB_FLOAT_IDLE_UNIT_v1_region_eyes.webp")) failures.push("OFFICIAL_EYES_LAYER_MISSING");
if (!avatarSrc.includes("MMHB_FLOAT_IDLE_UNIT_v1_region_arm-l.webp")) failures.push("OFFICIAL_ARM_LAYER_MISSING");
if (!avatarSrc.includes("MMHB_FLOAT_IDLE_UNIT_v1_region_leg-l.webp")) failures.push("OFFICIAL_LEG_LAYER_MISSING");

const cssFiles = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && full.endsWith(".css")) cssFiles.push(full);
  }
}
walk("client/src");

for (const file of cssFiles) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  let seenNonImport = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("/*") || trimmed.startsWith("*") || trimmed.startsWith("*/")) continue;
    if (trimmed.startsWith("@import")) {
      if (seenNonImport) failures.push(`CSS_IMPORT_ORDER ${file}`);
    } else {
      seenNonImport = true;
    }
  }
}

if (failures.length) {
  console.error("VISUAL_RUNTIME_GATE_FAIL");
  for (const failure of failures) console.error(failure);
  process.exit(1);
}

console.log("VISUAL_RUNTIME_GATE_PASS");
