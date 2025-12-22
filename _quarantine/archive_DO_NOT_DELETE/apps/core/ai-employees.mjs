// server/core/ai-employees.mjs
// Central registry of autonomous AI Employees
// Each entry defines: role, schedule, and the command to run.

export const AI_EMPLOYEES = [
  {
    name: "Content Strategist",
    role: "content",
    description: "Plans, schedules, and coordinates healing content publishing.",
    schedule: "daily",
    command: "npm run diagnose && npm run heal"
  },
  {
    name: "Social Publisher",
    role: "social",
    description: "Handles scheduling and posting of approved social media items.",
    schedule: "daily",
    command: "npm run weekly:chain"
  },
  {
    name: "Compliance Guardian",
    role: "compliance",
    description: "Monitors adherence to clinical and data standards.",
    schedule: "weekly",
    command: "node scripts/audit-compliance.mjs"
  },
  {
    name: "Research Analyst",
    role: "research",
    description: "Analyzes performance and compiles weekly reports.",
    schedule: "weekly",
    command: "npm run verify"
  },
  {
    name: "Growth Manager",
    role: "analytics",
    description: "Tracks metrics, engagement, and optimizes strategy.",
    schedule: "hourly",
    command: "node scripts/metrics.mjs"
  },
  {
    name: "Ethics Guardian",
    role: "ethics",
    description: "Ensures ethical use of AI and validates all generated outputs.",
    schedule: "weekly",
    command: "node scripts/audit-compliance.mjs"
  }
];