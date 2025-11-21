// scripts/fixRoutes.mjs
// Automatic Route Sanitizer — Prevents path-to-regexp crash

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesDir = path.join(__dirname, "..", "server", "routes");

function fixContent(text) {
  return text
    // remove trailing semicolons after wildcard
    .replace(/\*\s*;/g, "*")
    // remove invalid parameter sequences
    .replace(/\/:\*/g, "/*")
    .replace(/\/;;+/g, "/")
    // fix double wildcard formatting
    .replace(/\*{2,}/g, "*")
    // cleanup accidental characters
    .replace(/\*\/+/g, "*")
    .replace(/\/\*;+/, "/*");
}

function processRoutes() {
  console.log("🛠 Fixing invalid route patterns...\n");

  const files = fs.readdirSync(routesDir).filter(f => f.endsWith(".js") || f.endsWith(".mjs"));

  for (const file of files) {
    const full = path.join(routesDir, file);
    const original = fs.readFileSync(full, "utf8");
    const cleaned = fixContent(original);

    if (cleaned !== original) {
      fs.writeFileSync(full, cleaned, "utf8");
      console.log(`✔ Fixed: ${file}`);
    }
  }

  console.log("\n✨ Route healing complete.");
}

processRoutes();