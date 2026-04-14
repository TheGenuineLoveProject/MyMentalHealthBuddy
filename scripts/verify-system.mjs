#!/usr/bin/env node
import { execSync } from "child_process";

const PASS = "✅";
const FAIL = "❌";
let failures = 0;

function check(label, fn) {
  try {
    const result = fn();
    if (result === true || result === undefined) {
      console.log(`  ${PASS} ${label}`);
    } else {
      console.log(`  ${FAIL} ${label}: ${result}`);
      failures++;
    }
  } catch (e) {
    console.log(`  ${FAIL} ${label}: ${e.message}`);
    failures++;
  }
}

function run(cmd) {
  return execSync(cmd, { encoding: "utf-8", timeout: 90000 }).trim();
}

function httpCode(url, method = "GET", body = null) {
  let cmd = `curl -s -o /dev/null -w "%{http_code}" "${url}"`;
  if (method !== "GET") cmd = `curl -s -o /dev/null -w "%{http_code}" -X ${method} -H "Content-Type: application/json" ${body ? `-d '${body}'` : ""} "${url}"`;
  return run(cmd);
}

console.log("=============================================");
console.log("  SYSTEM VERIFICATION — verify:system");
console.log("=============================================");
console.log("");

console.log("--- BUILD ---");
check("Build passes", () => {
  const output = run("npm run build 2>&1");
  if (!output.includes("built in")) return "Build did not complete";
});

console.log("");
console.log("--- ENDPOINTS (public) ---");
const publicEndpoints = [
  "/api/health",
  "/api/system",
  "/api/kernel/version",
  "/api/health-check",
  "/healthz",
];
for (const ep of publicEndpoints) {
  check(`GET ${ep} → 200`, () => {
    const code = httpCode(`http://localhost:5000${ep}`);
    if (code !== "200") return `got ${code}`;
  });
}

console.log("");
console.log("--- ENDPOINTS (auth-protected) ---");
const protectedEndpoints = [
  "/api/system/history",
  "/api/kernel/health",
  "/api/kernel/schema",
];
for (const ep of protectedEndpoints) {
  check(`GET ${ep} → 401`, () => {
    const code = httpCode(`http://localhost:5000${ep}`);
    if (code !== "401") return `got ${code}`;
  });
}
check("POST /api/kernel/validate → 401", () => {
  const code = httpCode("http://localhost:5000/api/kernel/validate", "POST", "{}");
  if (code !== "401") return `got ${code}`;
});

console.log("");
console.log("--- TELEMETRY ---");
check("/api/system returns valid telemetry", () => {
  const data = JSON.parse(run("curl -sf http://localhost:5000/api/system"));
  if (typeof data.totalRequests !== "number") return "missing totalRequests";
  if (typeof data.errors5xx !== "number") return "missing errors5xx";
  if (data.errors5xx > 0) return `${data.errors5xx} server errors detected`;
  if (!data.uptime) return "missing uptime";
  if (!data.node) return "missing node version";
});

console.log("");
console.log("--- KERNEL ---");
check("/api/kernel/version returns v8.0.0", () => {
  const data = JSON.parse(
    run("curl -sf http://localhost:5000/api/kernel/version")
  );
  if (data.version !== "8.0.0") return `got ${data.version}`;
  if (data.domains !== 6) return `expected 6 domains, got ${data.domains}`;
});

console.log("");
console.log("--- HEALTH ---");
check("/api/health shows healthy + DB connected", () => {
  const data = JSON.parse(run("curl -sf http://localhost:5000/api/health"));
  if (data.status !== "healthy") return `status: ${data.status}`;
  if (!data.database?.connected) return "database not connected";
});

console.log("");
console.log("=============================================");
if (failures === 0) {
  console.log("  RESULT: ALL CHECKS PASSED");
} else {
  console.log(`  RESULT: ${failures} CHECK(S) FAILED`);
}
console.log("=============================================");

process.exit(failures > 0 ? 1 : 0);
