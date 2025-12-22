#!/usr/bin/env node
/**
 * autoheal-core.mjs
 * Must be syntactically valid and safe.
 * No destructive edits. Only detects + reports.
 */

import fs from "node:fs";
import path from "node:path";

// Minimal, crash-proof core module.
// This replaces any broken autoheal-core that caused: "SyntaxError: missing ) after argument list"
export function autohealCore() {
  return {
    ok: true,
    message: "autoheal-core loaded safely",
    timestamp: new Date().toISOString(),
  };
}

export default autohealCore;

export function runAutohealCore({ silent = false } = {}) {
  const root = process.cwd();
  const targets = ["client", "server", "scripts"].filter((p) => fs.existsSync(path.join(root, p)));

  if (!silent) {
    console.log("🧠 Autoheal Core: Started");
    for (const t of targets) console.log(`🔧 Healing folder: ${t}`);
  }

  // Minimal “health” checks (non-destructive)
  const pkgPath = path.join(root, "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.warn("⚠️ package.json not found.");
    return { ok: false, issues: ["missing package.json"] };
  }

  try {
    JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    if (!silent) console.log("✅ package.json is valid JSON.");
  } catch (e) {
    console.warn("❌ package.json invalid JSON:", e?.message || e);
    return { ok: false, issues: ["invalid package.json"] };
  }

  if (!silent) console.log("✅ Autoheal Core: Complete (safe scan).");
  return { ok: true, issues: [] };
}

// Allow running directly: `node scripts/autoheal-core.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  runAutohealCore({ silent: false });
}