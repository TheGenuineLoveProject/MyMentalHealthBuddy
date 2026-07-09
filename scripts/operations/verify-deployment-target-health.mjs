#!/usr/bin/env node

const base = process.env.APP_BASE_URL;

if (!base || base.includes("your-") || !base.startsWith("http")) {
  console.error("FAIL APP_BASE_URL missing or placeholder");
  process.exit(1);
}

const checks = [
  "/api/health",
  "/healthz",
  "/readyz"
];

for (const path of checks) {
  const url = new URL(path, base).toString();
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAIL ${url} -> ${res.status}`);
    process.exit(1);
  }
  console.log(`PASS ${url} -> ${res.status}`);
}

console.log("DEPLOYMENT_TARGET_HEALTH_VERIFY_PASS");
