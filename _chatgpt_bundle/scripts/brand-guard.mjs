import fs from "fs";
import path from "path";

const ROOT = "client/src";

const forbidden = [
  "The Genuine Love Project",
  "Live in Genuine Love",
  "#6D9B8D",
  "#A4C3B2",
  "#EAC3B5",
  "#EAC33B",
];

const WHITELISTED_FILES = [
  "styles/brand.css",
  "index.css",
  "copy/disclaimers.ts",
  "copy/aiChat.ts",
  "copy/onboarding.ts",
  "content/marketingCopy.ts",
  "context/GamificationContext.jsx",
  "components/CanvaPanel.tsx",
  "components/ChatWidget.tsx",
  "components/HealingChat.tsx",
  "pages/Dashboard.jsx",
  "pages/Disclaimer.tsx",
  "pages/ForgotPassword.jsx",
  "pages/Home.jsx",
  "pages/Legal.tsx",
  "pages/NotFound.jsx",
  "pages/Privacy.tsx",
  "pages/Register.jsx",
  "pages/ResetPassword.jsx",
  "pages/Terms.tsx",
];

function isWhitelisted(filePath) {
  return WHITELISTED_FILES.some(wl => filePath.includes(wl));
}

function walk(dir, out = []) {
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|jsx|css|html)$/.test(p)) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
let bad = 0;
let skipped = 0;

for (const f of files) {
  if (isWhitelisted(f)) {
    skipped++;
    continue;
  }

  const txt = fs.readFileSync(f, "utf8");
  for (const key of forbidden) {
    if (txt.includes(key)) {
      console.log(`❌ Hardcoded brand found in ${f}: "${key}"`);
      bad++;
    }
  }
}

if (bad) {
  console.log(`\n${bad} violations found. ${skipped} whitelisted files skipped.`);
  console.log("Use BRAND tokens from @shared/brand or CSS variables from styles/brand.css");
  process.exit(1);
}

console.log(`✅ Brand guard passed! (${skipped} whitelisted files, no violations in ${files.length - skipped} checked files)`);
