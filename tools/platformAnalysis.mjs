import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const exists = (p) => fs.existsSync(path.join(ROOT, p));
const read = (p) => (exists(p) ? fs.readFileSync(path.join(ROOT, p), "utf8") : null);

export async function runPlatformAnalysis() {
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

  // ---------- PLATFORM ----------
  report.platform.replitFile = exists(".replit");
  report.platform.nixFile = exists("replit.nix");

  // ---------- ENV ----------
  report.env.fileExists = exists(".env");

  // ---------- FRONTEND ----------
  report.frontend.clientDir = exists("client");
  report.frontend.appEntry =
    exists("client/src/App.tsx") ||
    exists("client/src/App.jsx") ||
    exists("client/src/main.tsx") ||
    exists("client/src/main.jsx");

  report.frontend.routing =
    exists("client/src/routes") ||
    exists("client/src/router");

  if (!report.frontend.routing) {
    report.warnings.push("No frontend routing detected");
  }

  // ---------- BACKEND ----------
  report.backend.entry =
    exists("server/index.mjs") ||
    exists("server/index.ts") ||
    exists("server/index.js") ||
    exists("server.mjs") ||
    exists("index.mjs") ||
    exists("index.js");

  // auth middleware detection aligned to your project
  report.backend.authMiddleware =
    exists("server/middleware/auth.mjs") ||        // ✅ your file
    exists("server/middleware/requireAdmin.mjs") || // ✅ your file
    exists("server/middleware/requireAuth.mjs");

  // ---------- DATABASE ----------
  report.database.schema =
    exists("server/db/schema") ||
    exists("server/db/schema.mjs") ||
    exists("db/schema.ts") ||
    exists("drizzle/schema.ts");

  // ---------- MISSING / WARNINGS ----------
  if (!report.backend.authMiddleware) report.missing.push("Auth middleware missing");

  // We’ll clear these in Phase B/C, but the analyzer should truthfully report now:
  if (!exists("server/routes/admin.mjs")) report.missing.push("Admin API missing");
  if (
    !exists("client/src/pages/Admin.tsx") &&
    !exists("client/src/pages/admin") &&
    !exists("client/src/routes/admin")
  ) {
    report.missing.push("Admin UI missing");
  }

  if (!report.platform.nixFile) report.warnings.push("Missing replit.nix");

  // ---------- ERRORS ----------
  if (!report.backend.entry) report.errors.push("No backend entry file");
  if (!report.database.schema) report.errors.push("Database schema missing");

  return report;
}