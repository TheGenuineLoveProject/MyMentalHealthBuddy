import fs from "node:fs";

const out = "diagnostics/phase100";
fs.mkdirSync(out, { recursive: true });

const file = "client/public/serviceWorker.js";
const text = fs.readFileSync(file, "utf8");

const failures = [];

if (!text.includes('CACHE_VERSION = "mmhb-pwa-phase100-v1"')) {
  failures.push("CACHE_VERSION_NOT_BUMPED");
}

const precacheSection = text.match(/const PRECACHE_URLS\s*=\s*\[[\s\S]*?\];/)?.[0] || "";
if (precacheSection.includes('"/"') || precacheSection.includes("'/'") || precacheSection.includes("index.html")) {
  failures.push("PRECACHE_STILL_INCLUDES_APP_SHELL_OR_INDEX");
}

if (!text.includes("networkFirstNavigation") || !text.includes('cache: "no-store"')) {
  failures.push("NAVIGATION_NOT_NETWORK_FIRST_NO_STORE");
}

if (!text.includes('const OFFLINE_URL = "/offline.html"') || !text.includes("caches.match(OFFLINE_URL)")) {
  failures.push("OFFLINE_HTML_FALLBACK_MISSING");
}

if (!text.includes('url.pathname.startsWith("/api/")')) {
  failures.push("API_BYPASS_MISSING");
}

if (!text.includes("caches.delete(key)")) {
  failures.push("OLD_CACHE_PURGE_MISSING");
}

const report = {
  generatedAt: new Date().toISOString(),
  failures,
  pass: failures.length === 0
};

fs.writeFileSync(`${out}/service-worker-cache-gate.json`, JSON.stringify(report, null, 2));

if (failures.length) {
  console.error("PHASE100_SERVICE_WORKER_CACHE_GATE_FAIL");
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("PHASE100_SERVICE_WORKER_CACHE_GATE_PASS");
