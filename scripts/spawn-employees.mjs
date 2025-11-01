#!/usr/bin/env node
import { AI_EMPLOYEES } from "../server/core/ai-employees.mjs";

console.log("🧠 Spawning AI Employees...");
for (const emp of AI_EMPLOYEES) {
  console.log(`🤖 ${emp.name} (${emp.role}) → runs "${emp.command}" on ${emp.schedule}`);
}
console.log("✅ All employees registered.");