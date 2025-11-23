// scripts/scanCriticalBlockers.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ensureDevOnly } from "./safetyGuard.mjs";

ensureDevOnly("scanCriticalBlockers.mjs");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");

function readFileSafe(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, "utf8");
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function section(title) {
  console.log("\n" + "═".repeat(80));
  console.log(`🔍 ${title}`);
  console.log("═".repeat(80));
}

function checkReplit() {
  section(".replit configuration");

  const content = readFileSafe(".replit");
  if (!content) {
    console.log("❌ .replit file not found");
    return;
  }

  const hasRunNpmStart = /run\s*=\s*"npm start"/.test(content);
  const portsMatches = content.match(/^\[\[ports\]\]/gm) || [];
  const hasDeploymentBlock = /\[deployment\]/.test(content);

  console.log(hasRunNpmStart
    ? "✅ run = \"npm start\" is set"
    : "❌ run = \"npm start\" is NOT set");

  console.log(portsMatches.length === 1
    ? "✅ Exactly one [[ports]] entry is defined"
    : `❌ ${portsMatches.length} [[ports]] entries found (must be 1)`);

  console.log(hasDeploymentBlock
    ? "✅ [deployment] block exists"
    : "❌ [deployment] block missing");
}

function checkServerIndex() {
  section("server/index.mjs core checks");

  const content = readFileSafe("server/index.mjs");
  if (!content) {
    console.log("❌ server/index.mjs not found");
    return;
  }

  // CORS wildcard
  if (/cors\(\s*{[^}]*origin:\s*"\*"/s.test(content)) {
    console.log("❌ CORS is set to origin: \"*\" (critical vulnerability)");
  } else {
    console.log("✅ CORS wildcard origin \"*\" not detected");
  }

  // Health endpoints
  const hasHealth =
    /app\.get\(["']\/health["']/.test(content) &&
    /app\.get\(["']\/health\/ready["']/.test(content) &&
    /app\.get\(["']\/health\/live["']/.test(content);

  console.log(hasHealth
    ? "✅ /health, /health/ready, /health/live endpoints appear to exist"
    : "❌ Health endpoints are missing or incomplete");

  // Static serving
  const hasStatic = /express\.static\(.+client.+dist/.test(content);
  console.log(hasStatic
    ? "✅ Static frontend serving from client/dist appears to be configured"
    : "❌ Static frontend (client/dist) is NOT being served");

  // Rate limiter usage
  const hasRateLimiterImport = /rateLimiter\.mjs/.test(content);
  console.log(hasRateLimiterImport
    ? "✅ rateLimiter middleware appears to be imported/used"
    : "⚠️ rateLimiter middleware not detected in server/index.mjs");
}

function checkSharedSchema() {
  section("shared/schema.ts presence");

  if (fileExists("shared/schema.ts")) {
    console.log("✅ shared/schema.ts exists (good foundation for shared types + Zod)");
  } else {
    console.log("❌ shared/schema.ts is missing (schema currently in wrong place)");
  }
}

function checkRateLimiterFile() {
  section("server/middleware/rateLimiter.mjs presence");

  if (fileExists("server/middleware/rateLimiter.mjs")) {
    console.log("✅ server/middleware/rateLimiter.mjs exists");
  } else {
    console.log("❌ server/middleware/rateLimiter.mjs is missing");
  }
}

console.log("🚦 Running BLOCKER_FIX_PACK scan (critical P0/P1 items)...");

checkReplit();
checkServerIndex();
checkSharedSchema();
checkRateLimiterFile();

console.log("\n✅ Scan complete. Fix the ❌ items above, then run again with:");
console.log("   npm run scan:blockers\n");