export const AI_EMPLOYEES = [
  { role: "ContentStrategist", schedule: "daily", run: "npm run diagnose && npm run heal" },
  { role: "Researcher", schedule: "weekly", run: "npm run verify" },
  { role: "Publisher", schedule: "daily", run: "npm run deploy" }
];

// Central registry of autonomous AI Employees
export const AI_EMPLOYEES = [
  { role: "ContentStrategist", schedule: "daily", script: "npm run diagnose" },
  { role: "ResearchAnalyst", schedule: "weekly", script: "npm run verify" },
  { role: "Publisher", schedule: "daily", script: "npm run optimize" },
  { role: "GrowthManager", schedule: "hourly", script: "node scripts/metrics.mjs" },
  { role: "EthicsGuardian", schedule: "weekly", script: "node scripts/audit-compliance.mjs" }
];