import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const report = {
  meta: {
    timestamp: new Date().toISOString(),
    root: ROOT
  },
  platform: {},
  frontend: {},
  backend: {},
  auth: {},
  database: {},
  env: {},
  build: {},
  missing: [],
  warnings: [],
  errors: []
};

// ---------- helpers ----------
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const read = (p) =>
  exists(p) ? fs.readFileSync(path.join(ROOT, p), "utf8") : "";

// ---------- PLATFORM ----------
report.platform.replitFile = exists(".replit");
report.platform.nixFile = exists("replit.nix");

if (!report.platform.replitFile) report.errors.push("Missing .replit");
if (!report.platform.nixFile) report.warnings.push("Missing replit.nix");

// ---------- ENV ----------
report.env.fileExists = exists(".env");
if (!report.env.fileExists) report.errors.push("Missing .env file");

const env = read(".env");
["DATABASE_URL", "SESSION_SECRET", "JWT_SECRET"].forEach((key) => {
  if (!env.includes(key)) {
    report.missing.push(`ENV missing: ${key}`);
  }
});

// ---------- FRONTEND ----------
report.frontend.clientDir = exists("client");
report.frontend.appEntry =
  exists("client/src/App.tsx") || exists("client/src/App.jsx");

if (!report.frontend.clientDir)
  report.errors.push("Missing client/ directory");

if (!report.frontend.appEntry)
  report.errors.push("Missing App.tsx / App.jsx");

report.frontend.routing =
  exists("client/src/routes") || exists("client/src/router");

if (!report.frontend.routing)
  report.warnings.push("No frontend routing detected");

// ---------- BACKEND ----------
report.backend.entry =
  exists("server/index.ts") ||
  exists("server/index.js") ||
  exists("server/index.mjs") ||   // ✅ ADD THIS
  exists("server.mjs") ||         // optional fallback
  exists("index.js") ||
  exists("index.mjs");

if (!report.backend.entry)
  report.errors.push("No backend entry file");

report.backend.authMiddleware =
  exists("server/middleware/requireAuth.mjs") ||
  exists("server/middleware/auth.mjs") ||        // ✅ your real file
  exists("server/middleware/requireAdmin.mjs");

if (!report.backend.authMiddleware)
  report.missing.push("Auth middleware missing");

// ---------- AUTH ----------
if (
  !exists("client/src/pages/Login.tsx") &&
  !exists("client/src/pages/Login.jsx")
) report.missing.push("Login page missing");

if (
  !exists("client/src/pages/Register.tsx") &&
  !exists("client/src/pages/Register.jsx")
) report.missing.push("Register page missing");

// ---------- ADMIN ----------
if (
  !exists("client/src/pages/Admin.tsx") &&
  !exists("client/src/pages/admin")
) report.missing.push("Admin UI missing");

if (
  !exists("server/routes/admin.ts") &&
  !exists("server/api/admin.ts")
) report.missing.push("Admin API missing");

// ---------- DATABASE ----------
report.database.schema =
  exists("db/schema.ts") ||
  exists("drizzle/schema.ts") ||
  exists("prisma/schema.prisma");

if (!report.database.schema)
  report.errors.push("Database schema missing");

if (!exists("drizzle") && !exists("prisma/migrations"))
  report.warnings.push("No database migrations found");

// ---------- BUILD ----------
if (!exists("package.json"))
  report.errors.push("Missing package.json");

const pkg = JSON.parse(read("package.json") || "{}");

if (!pkg.scripts?.dev && !pkg.scripts?.start)
  report.errors.push("No dev/start script");

if (!pkg.scripts?.build)
  report.warnings.push("No build script");

// ---------- OUTPUT ----------
console.log("\n========== PROJECT ANALYSIS ==========\n");
console.log(JSON.stringify(report, null, 2));

console.log("\nSUMMARY");
console.log("Errors:", report.errors.length);
console.log("Missing:", report.missing.length);
console.log("Warnings:", report.warnings.length);

if (report.errors.length) {
  console.log("\n❌ ERRORS");
  report.errors.forEach((e) => console.log(" -", e));
}
if (report.missing.length) {
  console.log("\n⚠️ MISSING");
  report.missing.forEach((m) => console.log(" -", m));
}
if (report.warnings.length) {
  console.log("\nℹ️ WARNINGS");
  report.warnings.forEach((w) => console.log(" -", w));
}

console.log("\n=====================================\n");