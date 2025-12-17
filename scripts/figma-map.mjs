import fs from "fs";
import path from "path";

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
  "client/src/pages/dashboard/DesignSystem.tsx",

  "client/src/pages/ai/ChatEmpty.tsx",
  "client/src/pages/ai/ChatConversation.tsx",
  "client/src/pages/ai/ChatCrisis.tsx",

  "client/src/pages/account/Profile.tsx",
  "client/src/pages/account/Settings.tsx",
  "client/src/pages/account/Billing.tsx",

  "client/src/pages/legal/Privacy.tsx",
  "client/src/pages/legal/Terms.tsx",
  "client/src/pages/legal/Disclaimer.tsx",
];

const template = (name) => `import React from "react";
import { BRAND } from "@shared/brand";

export default function ${name}() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: BRAND.colors.primary }}>${name}</h1>
      <p>${BRAND.tagline}</p>
      <p style={{ opacity: 0.75 }}>
        Replace this scaffold with your Figma Dev Mode code.
      </p>
    </div>
  );
}
`;

for (const f of files) {
  const dir = path.dirname(f);
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(f)) {
    const name = path.basename(f).replace(".tsx", "").replace(/[^a-zA-Z0-9_]/g, "");
    fs.writeFileSync(f, template(name), "utf8");
    console.log("created", f);
  } else {
    console.log("exists ", f);
  }
}