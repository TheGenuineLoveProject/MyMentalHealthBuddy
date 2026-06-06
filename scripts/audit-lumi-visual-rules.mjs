#!/usr/bin/env node
import fs from "fs";
import path from "path";

const root = process.cwd();
const outDir = path.join(root, "diagnostics", "phase55");
fs.mkdirSync(outDir, { recursive: true });

const exists = (p) => fs.existsSync(path.join(root, p));
const read = (p) => exists(p) ? fs.readFileSync(path.join(root, p), "utf8") : "";
const readMaybe = (p) => {
  try { return fs.readFileSync(path.join(root, p), "utf8"); } catch { return ""; }
};

const recursiveFiles = (dir, exts) => {
  const abs = path.join(root, dir);
  const results = [];
  if (!fs.existsSync(abs)) return results;
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (["node_modules", "dist", ".git", "diagnostics"].includes(entry.name)) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (exts.includes(path.extname(entry.name).toLowerCase())) results.push(full);
    }
  };
  walk(abs);
  return results;
};

const sourceFiles = [
  ...recursiveFiles("client/src", [".tsx", ".ts", ".jsx", ".js", ".css", ".svg"]),
  ...recursiveFiles("src", [".tsx", ".ts", ".jsx", ".js", ".css", ".svg"]),
  ...recursiveFiles("app", [".tsx", ".ts", ".jsx", ".js", ".css", ".svg"]),
  ...recursiveFiles("public", [".html", ".css", ".svg"]),
];

const allSource = sourceFiles.map((f) => readMaybe(f)).join("\n");

const css = read("client/src/styles/lumi-visual-system.css");
const avatar = read("client/src/components/lumi/LivingLumiAvatar.tsx");

const checks = [
  ["canonical pastel palette file exists", exists("client/src/styles/lumi-visual-system.css")],
  ["living Lumi component file exists", exists("client/src/components/lumi/LivingLumiAvatar.tsx")],
  ["Lumi component imported or mounted", /LivingLumiAvatar/.test(allSource)],
  ["CSS visual system imported", /lumi-visual-system\.css/.test(allSource)],
  ["sage palette tokens present", /#DDE7D5|#C7D8BC|#AFC6A1|#90AF85/.test(css)],
  ["cream palette tokens present", /#FFF9F2|#F7F0E8|#EFE5D7/.test(css)],
  ["gold palette tokens present", /#FFD46B|#F6C14B|#E2AA2B/.test(css)],
  ["rose palette tokens present", /#FFD6DA|#F9BEC5/.test(css)],
  ["sky palette tokens present", /#AEE9FF|#77D8FF/.test(css)],
  ["button label readability rule present", /button[\s\S]*color: var\(--lumi-ink\).*important/.test(css)],
  ["ambient scene system present", /body::before|lumiAmbientDrift|lumiScenePulse/.test(css)],
  ["facial animation present", /lumiBlink|lumiMouth|lumiCheekPulse/.test(css + avatar)],
  ["arms animation present", /lumiArmWaveLeft|lumiArmWaveRight|lumi-arm-left|lumi-arm-right/.test(css + avatar)],
  ["legs animation present", /lumiLegLeft|lumiLegRight|lumi-leg-left|lumi-leg-right/.test(css + avatar)],
  ["breathing animation present", /lumiBreathe|lumi-head/.test(css + avatar)],
  ["sparkle/glow animation present", /lumiSparkle|lumiGlowPulse|lumi-living-companion__sparkle/.test(css + avatar)],
  ["reduced motion accessibility present", /prefers-reduced-motion/.test(css)],
];

const assetLines = readMaybe(path.join(outDir, "brand-avatar-asset-inventory.txt"))
  .split("\n")
  .filter(Boolean);

const likelyOfficialAssets = assetLines.filter((line) =>
  /official|brand|lumi|avatar|mascot|buddy|character/i.test(line)
);

const failures = checks.filter(([, ok]) => !ok);

const report = [
  "# Phase 55 Lumi Visual Rule Implementation Audit",
  "",
  `Checked source files: ${sourceFiles.length}`,
  `Possible brand/avatar assets found: ${assetLines.length}`,
  `Likely official/brand avatar candidates: ${likelyOfficialAssets.length}`,
  "",
  "## Rule Status",
  "",
  ...checks.map(([name, ok]) => `- ${ok ? "[x]" : "[ ]"} ${name}`),
  "",
  "## Official Brand Avatar Finding",
  "",
  likelyOfficialAssets.length
    ? "Possible official avatar assets exist. Next implementation must replace the generic SVG-only Lumi with the closest official brand asset or create a layered rig from the official asset."
    : "No clearly named official brand avatar asset was found by filename. The current Lumi component is likely a generic SVG approximation, not the official brand avatar.",
  "",
  "## Current Problem",
  "",
  failures.length
    ? `Implementation gaps remain: ${failures.map(([name]) => name).join("; ")}.`
    : "Most written visual rules appear implemented at code-token level, but the current avatar may still visually mismatch the official brand because it is SVG-generated rather than asset-derived.",
  "",
  "## Most Powerful Recommendation",
  "",
  "Do not keep polishing the generic SVG avatar. Build a canonical Lumi Brand Avatar System:",
  "",
  "1. Select or add the official Lumi brand avatar assets into `client/src/assets/lumi/official/`.",
  "2. Create `LumiBrandAvatar.tsx` that renders the official asset as the base visual identity.",
  "3. Add an overlay motion rig for blinking eyes, mouth movement, cheek glow, arm/leg movement where compatible, sparkle field, glow field, and breathing motion.",
  "4. Replace all generic Lumi usages with the canonical brand component.",
  "5. Keep the pastel palette, but reduce sage opacity and force button text contrast with tokenized foreground colors.",
  "6. Add a visual QA gate that checks routes, button labels, Lumi render presence, palette token presence, and build health before each commit.",
  "",
  "## Next Safe Implementation Phase",
  "",
  "Phase 56 should implement the canonical brand-avatar pipeline, but only after confirming which asset is official. If no official file exists in the repo, add the official Lumi image first, then rig it.",
  "",
].join("\n");

fs.writeFileSync(path.join(outDir, "visual-rule-audit.md"), report);

const json = {
  sourceFiles: sourceFiles.length,
  possibleAvatarAssets: assetLines.length,
  likelyOfficialAssets,
  checks: Object.fromEntries(checks),
  failures: failures.map(([name]) => name),
};

fs.writeFileSync(path.join(outDir, "visual-rule-audit.json"), JSON.stringify(json, null, 2));
console.log(report);
