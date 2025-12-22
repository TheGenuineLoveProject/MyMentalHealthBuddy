/**
 * healer-orchestrator.mjs
 * QuantumBrain Safe Edition — 100% Replit + MJS Only
 * Called by GitHub Actions (healer.yml)
 */

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Resolve directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Load Modules ---- //
async function safeImport(modulePath) {
  try {
    return await import(modulePath);
  } catch (err) {
    console.error(`[HEALER] Failed to load module: ${modulePath}`);
    console.error(err);
    return null;
  }
}

// Load all your scan modules
const core = await safeImport('./autoheal-core.mjs');
const project = await safeImport('./autoheal-project.mjs');
const autoheal = await safeImport('./autoheal.mjs');
const scanApi = await safeImport('./scan-api.mjs');
const scanCritical = await safeImport('./scan-critical.mjs');
const scanTypes = await safeImport('./scan-types.mjs');
const scanUi = await safeImport('./scan-ui.mjs');

// ---- Runner ---- //
console.log("\n🔮 QuantumBrain Healer — Safe Edition");
console.log("-------------------------------------\n");

async function runHealer() {
  console.log("🟣 Starting Healing Sequence...");

  if (core?.run) await core.run();
  if (project?.run) await project.run();
  if (autoheal?.run) await autoheal.run();

  console.log("🔵 Running API scan...");
  if (scanApi?.run) await scanApi.run();

  console.log("🟠 Running Critical scan...");
  if (scanCritical?.run) await scanCritical.run();

  console.log("🟡 Running Types scan...");
  if (scanTypes?.run) await scanTypes.run();

  console.log("🟢 Running UI scan...");
  if (scanUi?.run) await scanUi.run();

  console.log("\n✨ Healing Complete — GitHub Workflow Safe.\n");
}

runHealer().catch(err => {
  console.error("❌ Healer crashed:", err);
  process.exit(1);
});