#!/usr/bin/env node
import fs from "fs";
import path from "path";

const checks = { routes: [], pages: [], envVars: [], todos: [] };

// Check routes
const routesDir = "server/routes";
for (const f of fs.readdirSync(routesDir)) {
  const content = fs.readFileSync(path.join(routesDir, f), "utf8");
  const isEmpty = content.trim().length === 0;
  checks.routes.push({ file: f, empty: isEmpty, hasTodo: content.includes("TODO") });
}

// Check pages
const pagesDir = "client/src/pages";
for (const f of fs.readdirSync(pagesDir).filter(f => f.endsWith(".jsx") || f.endsWith(".tsx"))) {
  const content = fs.readFileSync(path.join(pagesDir, f), "utf8");
  checks.pages.push({ file: f, hasTodo: content.includes("TODO") });
}

// Check env vars
const requiredEnvs = ["DATABASE_URL", "SESSION_SECRET", "OPENAI_API_KEY", "STRIPE_SECRET_KEY"];
checks.envVars = requiredEnvs.map(k => ({ key: k, set: !!process.env[k] }));

// Find TODOs
const { execSync } = await import("child_process");
const todoOutput = execSync('grep -rn "TODO\\|FIXME" server client --include="*.mjs" --include="*.jsx" --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v node_modules || true', { encoding: "utf8" });
checks.todos = todoOutput.split("\n").filter(Boolean);

// Output
fs.writeFileSync("audit-report.json", JSON.stringify(checks, null, 2));
console.log("Audit complete. See audit-report.json");
console.log(`Routes: ${checks.routes.length}, Pages: ${checks.pages.length}, TODOs: ${checks.todos.length}`);
