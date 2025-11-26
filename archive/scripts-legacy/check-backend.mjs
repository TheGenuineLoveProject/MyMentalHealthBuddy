// scripts/check-backend.mjs
// Backend validation — imports everything from importMap and reports OK / FAIL

import BACKEND_IMPORTS from "../server/shared/importMap.mjs";

const log = console.log;

// Turn a path from importMap (relative to /server) into one valid for /scripts
const resolvePathForScript = (p) => {
  if (p.startsWith("../")) {
    // Example: "../routes/auth.mjs" -> "../server/routes/auth.mjs"
    return "../server/" + p.slice(3);
  }
  // Core node_modules like "express"
  return p;
};

const testImport = async (label, rawPath) => {
  const path = resolvePathForScript(rawPath);
  try {
    const mod = await import(path);
    log(`✅  ${label}  -> OK  (${path})`);
    return true;
  } catch (err) {
    log(`❌  ${label}  -> FAILED  (${path})`);
    log("    Error:", err.message);
    return false;
  }
};

const run = async () => {
  log("======================================");
  log("  MyMentalHealthBuddy — Backend Check ");
  log("======================================\n");

  let ok = true;

  // ---- Core ----
  for (const [key, p] of Object.entries(BACKEND_IMPORTS.core)) {
    if (!(await testImport(`core.${key}`, p))) ok = false;
  }

  // ---- Middleware ----
  for (const [key, p] of Object.entries(BACKEND_IMPORTS.middleware)) {
    if (!(await testImport(`middleware.${key}`, p))) ok = false;
  }

  // ---- DB ----
  for (const [key, p] of Object.entries(BACKEND_IMPORTS.db)) {
    if (!(await testImport(`db.${key}`, p))) ok = false;
  }

  // ---- Routes ----
  for (const [key, p] of Object.entries(BACKEND_IMPORTS.routes)) {
    if (!(await testImport(`routes.${key}`, p))) ok = false;
  }

  // ---- AI ----
  for (const [key, p] of Object.entries(BACKEND_IMPORTS.ai)) {
    if (!(await testImport(`ai.${key}`, p))) ok = false;
  }

  log("\n======================================");
  if (ok) {
    log("  ✅ Backend import validation PASSED");
  } else {
    log("  ❌ Backend import validation FAILED");
    log("  (See ❌ lines above for exact module problems)");
  }
  log("======================================");
};

run().catch((err) => {
  console.error("Unexpected validation error:", err);
  process.exit(1);
});