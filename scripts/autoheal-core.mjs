// scripts/autoheal-core.mjs
// Minimal, safe core for healer-orchestrator to import without syntax errors.
// Keep it dependency-light and ESM-safe.

import fs from "node:fs";
import path from "node:path";

const ok = (msg) => console.log(`✅ ${msg}`);
const warn = (msg) => console.log(`⚠️ ${msg}`);
const fail = (msg) => console.log(`❌ ${msg}`);

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

export function platformSnapshot() {
  const root = process.cwd();
  const scriptsDir = path.join(root, "scripts");
  const serverDir = path.join(root, "server");
  const clientDir = path.join(root, "client");

  return {
    node: process.version,
    cwd: root,
    hasPackageJson: exists(path.join(root, "package.json")),
    hasScripts: exists(scriptsDir),
    hasServer: exists(serverDir),
    hasClient: exists(clientDir),
  };
}

/**
 * Safe core entrypoint.
 * healer-orchestrator can call this without crashing.
 */
export async function runAutohealCore({ mode = "silent" } = {}) {
  const snap = platformSnapshot();
  ok(`Autoheal core loaded (${mode}). Node ${snap.node}`);

  if (!snap.hasPackageJson) {
    fail("package.json missing at repo root.");
    return { ok: false, reason: "NO_PACKAGE_JSON" };
  }

  if (!snap.hasScripts) warn("scripts/ folder not found.");
  if (!snap.hasServer) warn("server/ folder not found.");
  if (!snap.hasClient) warn("client/ folder not found.");

  // Non-destructive by default:
  ok("Autheal core completed (non-destructive).");
  return { ok: true, snapshot: snap };
}

export default { runAutohealCore, platformSnapshot };