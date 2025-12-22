import { execSync } from "node:child_process";
import { existsSync, unlinkSync } from "node:fs";

const out = "gpt_repair_bundle.zip";

// Only include safe files (NO .env, NO node_modules)
const potentialPaths = [
  ".replit",
  "replit.nix",
  "package.json",
  "package-lock.json",
  "vite.config.ts",
  "vite.config.js",
  "vitest.config.ts",
  "vitest.config.js",
  "tsconfig.json",
  "server",
  "client/src",
  "client/index.html",
  "client/public",
  "shared",
  "public",
  "scripts",
  "drizzle",
  "migrations",
  ".github",
  "README.md",
  "FINAL_CLEANUP_PROMPT.md",
  "final-deployment.log",
  "PLATFORM_360_ANALYSIS_REPORT.md",
  "replit.md"
];

// Filter to only paths that exist
const include = potentialPaths.filter(p => existsSync(p));

console.log(`Including ${include.length} paths in bundle...`);

// Remove old bundle if exists
try { unlinkSync(out); } catch {}

try {
  // Use zip command
  execSync(`zip -rq ${out} ${include.join(" ")}`, { stdio: "inherit" });
  
  if (existsSync(out)) {
    const size = execSync(`ls -lh ${out}`).toString().trim();
    console.log(size);
    console.log(`✅ Created ${out}`);
  } else {
    console.error("❌ Failed to create bundle");
    process.exit(1);
  }
} catch (err) {
  console.error("❌ Failed to create bundle:", err.message);
  process.exit(1);
}
