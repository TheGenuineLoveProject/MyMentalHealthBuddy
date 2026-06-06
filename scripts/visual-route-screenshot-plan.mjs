#!/usr/bin/env node
import fs from "node:fs";

const routes = [
  "/",
  "/pricing",
  "/premium",
  "/account/billing",
  "/account/subscription",
  "/wellness",
  "/tools",
  "/safety",
  "/privacy",
  "/terms",
  "/login",
  "/register"
];

const report = [
  "# Visual Route Screenshot Plan",
  "",
  "Purpose:",
  "Use this list for manual or browser-based screenshot QA.",
  "",
  "Routes:",
  ...routes.map((route) => `- ${route}`),
  "",
  "Checks:",
  "- Hero area has visual depth, not empty whitespace.",
  "- Lumi appears as official brand avatar where intended.",
  "- Button labels remain readable.",
  "- Sage is soft pastel, not opaque/dark over text.",
  "- Pricing and premium routes have clear CTA hierarchy.",
  "- Safety/privacy/terms remain readable and compliant.",
  "- Mobile width keeps labels visible.",
  "- Reduced-motion preference remains respected.",
  ""
].join("\n");

fs.mkdirSync("diagnostics/phase76", { recursive: true });
fs.writeFileSync("diagnostics/phase76/visual-route-screenshot-plan.md", report);
console.log("VISUAL_ROUTE_SCREENSHOT_PLAN_CREATED");
console.log(routes.join("\n"));
