import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { BRAND } from "../shared/brand.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  "client/src/pages/marketing/LandingHero.tsx",
  "client/src/pages/marketing/LandingFeatures.tsx",
  "client/src/pages/marketing/LandingTestimonials.tsx",
  "client/src/pages/marketing/LandingCTA.tsx",

  "client/src/pages/auth/Login.tsx",
  "client/src/pages/auth/SignUp.tsx",
  "client/src/pages/auth/ForgotPassword.tsx",

  "client/src/pages/dashboard/Overview.tsx",
  "client/src/pages/dashboard/MoodTracker.tsx",
  "client/src/pages/dashboard/Journal.tsx",
  "client/src/pages/dashboard/Insights.tsx",

  "client/src/pages/ai/ChatEmpty.tsx",
  "client/src/pages/ai/ChatConversation.tsx",
  "client/src/pages/ai/ChatCrisis.tsx",

  "client/src/pages/account/Profile.tsx",
  "client/src/pages/account/Settings.tsx",
  "client/src/pages/account/Billing.tsx",

  "client/src/pages/legal/Privacy.tsx",
  "client/src/pages/legal/Terms.tsx",
  "client/src/pages/legal/Disclaimer.tsx"
];

function scaffold(name) {
  return `import React from "react";
import { BRAND } from "@shared/brand";

export default function ${name}() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: BRAND.colors.primary }}>{BRAND.name}</h1>
      <p>{BRAND.tagline}</p>
      <p style={{ opacity: 0.75 }}>
        Replace this scaffold with your Figma Dev Mode code for: ${name}
      </p>
    </div>
  );
}
`;
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function componentNameFromFile(filePath) {
  const base = path.basename(filePath).replace(/\.(tsx|jsx)$/, "");
  return base.replace(/[^a-zA-Z0-9]/g, "");
}

for (const rel of files) {
  const abs = path.resolve(process.cwd(), rel);
  ensureDir(abs);
  if (!fs.existsSync(abs)) {
    fs.writeFileSync(abs, scaffold(componentNameFromFile(rel)), "utf8");
    console.log("created:", rel);
  } else {
    console.log("exists:", rel);
  }
}

const tokensJson = {
  brand: {
    name: BRAND.name,
    shortName: BRAND.shortName,
    tagline: BRAND.tagline
  },
  colors: BRAND.colors,
  typography: BRAND.typography,
  spacing: BRAND.spacing,
  borderRadius: BRAND.borderRadius,
  figma: {
    instructions: "Import these tokens as Figma Variables via Tokens Studio plugin or paste manually",
    colorMode: "HEX"
  },
  canva: {
    brandKit: {
      primaryFont: "Playfair Display",
      secondaryFont: "Inter",
      colors: Object.values(BRAND.colors).slice(0, 6)
    }
  }
};

const tokensPath = path.resolve(process.cwd(), "public/brand/tokens.json");
ensureDir(tokensPath);
fs.writeFileSync(tokensPath, JSON.stringify(tokensJson, null, 2), "utf8");
console.log("updated: public/brand/tokens.json");

console.log("Done. Now paste Figma Dev Mode code into the generated files.");