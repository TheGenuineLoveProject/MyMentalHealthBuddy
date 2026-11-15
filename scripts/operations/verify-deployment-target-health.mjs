#!/usr/bin/env node

function readOrigin(value) {
  // Accept a site origin, not a URL carrying credentials, a path or secrets.
  // Checking the original shape also rejects empty query/fragment delimiters.
  if (!value || !/^https?:\/\/[^/?#@\\\s]+\/?$/i.test(value)) throw new Error();
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password ||
      url.search || url.hash || url.pathname !== "/" || url.hostname.includes("your-")) {
    throw new Error();
  }
  return url.origin;
}

function readTimeout(value) {
  if (value === undefined) return 5000;
  // Keep overrides bounded, including those used by offline loopback tests.
  if (!/^\d+$/.test(value)) throw new Error();
  const timeout = Number(value);
  if (!Number.isSafeInteger(timeout) || timeout < 100 || timeout > 30000) throw new Error();
  return timeout;
}

let base;
let timeoutMs;
try {
  base = readOrigin(process.env.APP_BASE_URL);
} catch {
  console.error("FAIL APP_BASE_URL must be an HTTP(S) site origin without credentials, path, query or fragment");
  process.exit(1);
}
try {
  timeoutMs = readTimeout(process.env.DEPLOYMENT_PROBE_TIMEOUT_MS);
} catch {
  console.error("FAIL DEPLOYMENT_PROBE_TIMEOUT_MS must be an integer from 100 to 30000");
  process.exit(1);
}

const checks = ["/api/health", "/healthz", "/readyz", "/api/health/detailed"];

async function check(path) {
  const controller = new AbortController();
  // The same deadline covers connecting, response headers and the entire body.
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(new URL(path, base), {
      redirect: "manual",
      signal: controller.signal,
      headers: { Accept: "application/json, text/plain", "Cache-Control": "no-cache" },
    });
    if (res.status !== 200) throw new Error(`HTTP ${res.status}; expected 200 without redirects`);
    const type = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    const text = await res.text();
    if (path === "/healthz" && type === "text/plain" && text.trim() === "ok") return;
    if (type !== "application/json") throw new Error("expected JSON health response");
    let data;
    try { data = JSON.parse(text); } catch { throw new Error("malformed JSON health response"); }
    if (!data || typeof data !== "object" || Array.isArray(data) || data.ok === false) {
      throw new Error("negative or invalid health response");
    }
    const valid = path === "/api/health/detailed"
      ? data.status === "ok" && data.ready === true && data.checks?.db?.ok === true
      : data.status === (path === "/readyz" ? "ready" : "healthy");
    if (!valid) throw new Error("required health/readiness status not satisfied");
  } catch (error) {
    if (controller.signal.aborted) throw new Error(`probe timeout after ${timeoutMs}ms`);
    // Never print fetch error causes, response bodies or the supplied base URL.
    if (error instanceof TypeError) throw new Error("request failed");
    throw error;
  } finally {
    clearTimeout(timer);
    controller.abort();
  }
}

for (const path of checks) {
  try {
    await check(path);
    console.log(`PASS ${path} -> 200, verified health response`);
  } catch (error) {
    console.error(`FAIL ${path}: ${error.message}`);
    process.exit(1);
  }
}

// This verifies endpoint contracts and database readiness, not release identity
// or payment processing correctness.
console.log("DEPLOYMENT_TARGET_HEALTH_VERIFY_PASS");
