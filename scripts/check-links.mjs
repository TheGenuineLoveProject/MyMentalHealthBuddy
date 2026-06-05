#!/usr/bin/env node
const baseUrl = process.env.CHECK_LINKS_BASE_URL || "http://localhost:5000";

const routes = [
  "/",
  "/pricing",
  "/premium",
  "/account/billing",
  "/account/subscription",
  "/login",
  "/register",
  "/safety",
  "/privacy",
  "/terms",
  "/admin",
  "/admin/billing",
  "/admin/revenue",
  "/admin/security",
  "/admin/health",
  "/api/health",
  "/api/ready"
];

let failures = 0;

for (const route of routes) {
  const url = `${baseUrl}${route}`;
  try {
    const response = await fetch(url, { method: "GET" });
    const ok = response.status >= 200 && response.status < 400;
    console.log(`${ok ? "PASS" : "FAIL"} ${response.status} ${route}`);
    if (!ok) failures++;
  } catch (error) {
    failures++;
    console.log(`FAIL 000 ${route} ${error.message}`);
  }
}

if (failures > 0) {
  console.error(`Link check failed: ${failures} route(s) failed.`);
  process.exit(1);
}

console.log("Link check passed.");
