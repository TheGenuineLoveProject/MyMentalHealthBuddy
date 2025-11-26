// automation/orchestrator.mjs
// v2.1 — QuantumBrain Safe Orchestrator

import { execSync } from "node:child_process";
import { assertNotProduction, logSection } from "./automationCore.mjs";

assertNotProduction();

logSection("QuantumBrain Orchestrator v2.1 (Safe Edition)");

const TASKS = [
  "automation/scanErrors.mjs",
  "automation/folderCheck.mjs"
];

for (const task of TASKS) {
  logSection(`Running: ${task}`);
  try {
    execSync(`node ${task}`, { stdio: "inherit" });
  } catch (err) {
    console.log("⚠️ Task failed:", task);
    console.log("Error:", err.message);
  }
}

logSection("All orchestrated tasks complete.");
console.log("No files were modified. All actions were read-only.");