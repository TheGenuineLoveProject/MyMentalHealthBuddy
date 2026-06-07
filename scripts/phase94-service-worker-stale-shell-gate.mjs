import fs from "node:fs";

const sw = fs.existsSync("client/public/serviceWorker.js")
  ? fs.readFileSync("client/public/serviceWorker.js", "utf8")
  : "";
const offline = fs.existsSync("client/public/offline.html")
  ? fs.readFileSync("client/public/offline.html", "utf8")
  : "";
const main = fs.existsSync("client/src/main.jsx")
  ? fs.readFileSync("client/src/main.jsx", "utf8")
  : "";
const failures = [];

if (!sw.includes('CACHE_VERSION = "mmhb-pwa-v94-stale-shell-safe"')) failures.push("CACHE_VERSION_NOT_BUMPED");
if (sw.includes('"/index.html"') || sw.includes("'/index.html'")) failures.push("INDEX_HTML_PRECACHE_PRESENT");
if (sw.includes('"/"') || sw.includes("'/'")) failures.push("ROOT_HTML_PRECACHE_PRESENT");
if (!sw.includes("networkFirstNavigation")) failures.push("NETWORK_FIRST_NAVIGATION_MISSING");
if (!sw.includes('fetch(request, { cache: "no-store" })')) failures.push("NO_STORE_NAVIGATION_FETCH_MISSING");
if (!sw.includes('cache.match("/offline.html")')) failures.push("OFFLINE_ONLY_FALLBACK_MISSING");
if (!sw.includes("staleWhileRevalidateAsset")) failures.push("ASSET_CACHE_STRATEGY_MISSING");
if (!sw.includes("CLEAR_MHB_CACHES")) failures.push("CACHE_CLEAR_MESSAGE_MISSING");
if (!offline.includes("You are offline")) failures.push("OFFLINE_HTML_MISSING_EXPECTED_COPY");

if (main.includes("controllerchange") && main.includes("window.location.reload")) {
  failures.push("MAIN_CONTROLLERCHANGE_FORCE_RELOAD_PRESENT_REVIEW_RECOMMENDED");
}

if (failures.length) {
  console.log("SERVICE_WORKER_STALE_SHELL_GATE_FAIL");
  for (const failure of failures) console.log(failure);
  process.exit(1);
}

console.log("SERVICE_WORKER_STALE_SHELL_GATE_PASS");
