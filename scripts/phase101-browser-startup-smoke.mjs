import fs from "node:fs";

const OUT = "diagnostics/phase101";
fs.mkdirSync(OUT, { recursive: true });

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch (error) {
  console.log("PLAYWRIGHT_NOT_AVAILABLE");
  console.log(error.message);
  fs.writeFileSync(`${OUT}/browser-smoke-result.json`, JSON.stringify({
    pass: false,
    reason: "PLAYWRIGHT_NOT_AVAILABLE",
    message: error.message,
  }, null, 2));
  process.exit(2);
}

const baseURL = process.env.PHASE101_BASE_URL || "http://localhost:5000";

const browser = await chromium.launch({
  headless: true,
});

const context = await browser.newContext({
  serviceWorkers: "allow",
});

const page = await context.newPage();

const consoleMessages = [];
const pageErrors = [];
const failedRequests = [];

page.on("console", (msg) => {
  const text = msg.text();
  consoleMessages.push({ type: msg.type(), text });
});

page.on("pageerror", (error) => {
  pageErrors.push(error.message);
});

page.on("requestfailed", (request) => {
  failedRequests.push({
    url: request.url(),
    failure: request.failure()?.errorText || "unknown",
  });
});

await page.goto(baseURL, {
  waitUntil: "networkidle",
  timeout: 60000,
});

await page.waitForSelector("#root", { timeout: 30000 });

const rootInfo = await page.evaluate(() => {
  const root = document.querySelector("#root");
  const text = document.body.innerText || "";
  return {
    rootExists: Boolean(root),
    rootChildCount: root?.childElementCount ?? 0,
    rootTextLength: root?.innerText?.trim()?.length ?? 0,
    bodyTextLength: text.trim().length,
    title: document.title,
    hasCrisisOnlyFallback:
      text.includes("If you are in crisis") &&
      text.length < 2500,
    hasInstallingText:
      /\binstalling\b/i.test(text),
    hasOfflineOnlyText:
      text.includes("You are offline") &&
      text.length < 2500,
  };
});

const serviceWorkerInfo = await page.evaluate(async () => {
  const hasSW = "serviceWorker" in navigator;
  const registrations = hasSW ? await navigator.serviceWorker.getRegistrations() : [];
  const cacheNames = "caches" in window ? await caches.keys() : [];
  const swText = await fetch("/serviceWorker.js", { cache: "no-store" }).then((r) => r.text());
  return {
    hasSW,
    registrationCount: registrations.length,
    cacheNames,
    serviceWorkerHasPhase100Version: swText.includes("mmhb-pwa-phase100-v1"),
    serviceWorkerHasNetworkFirst: swText.includes("networkFirstNavigation"),
    serviceWorkerHasNoStore: swText.includes('cache: "no-store"'),
    serviceWorkerPrecacheMentionsIndexHtml: /PRECACHE_URLS[\s\S]*index\.html[\s\S]*\]/.test(swText),
    serviceWorkerPrecacheMentionsRoot: /PRECACHE_URLS[\s\S]*["'`]\/["'`][\s\S]*\]/.test(swText),
  };
});

const asset404s = failedRequests.filter((item) =>
  item.url.includes("/assets/") ||
  item.url.endsWith(".js") ||
  item.url.endsWith(".css")
);

const failures = [];

if (!rootInfo.rootExists) failures.push("ROOT_MISSING");
if (rootInfo.rootChildCount < 1) failures.push("REACT_ROOT_EMPTY");
if (rootInfo.hasCrisisOnlyFallback) failures.push("CRISIS_ONLY_FALLBACK_VISIBLE_ON_NORMAL_LOAD");
if (rootInfo.hasInstallingText) failures.push("INSTALLING_TEXT_VISIBLE_ON_NORMAL_LOAD");
if (rootInfo.hasOfflineOnlyText) failures.push("OFFLINE_ONLY_SCREEN_VISIBLE_ON_NORMAL_LOAD");
if (asset404s.length > 0) failures.push("ASSET_REQUEST_FAILURES_PRESENT");
if (pageErrors.length > 0) failures.push("PAGE_ERRORS_PRESENT");
if (!serviceWorkerInfo.serviceWorkerHasPhase100Version) failures.push("SERVICE_WORKER_PHASE100_VERSION_MISSING");
if (!serviceWorkerInfo.serviceWorkerHasNetworkFirst) failures.push("SERVICE_WORKER_NETWORK_FIRST_MISSING");
if (!serviceWorkerInfo.serviceWorkerHasNoStore) failures.push("SERVICE_WORKER_NO_STORE_MISSING");
if (serviceWorkerInfo.serviceWorkerPrecacheMentionsIndexHtml) failures.push("SERVICE_WORKER_PRECACHE_INDEX_HTML");
if (serviceWorkerInfo.serviceWorkerPrecacheMentionsRoot) failures.push("SERVICE_WORKER_PRECACHE_ROOT");

const result = {
  generatedAt: new Date().toISOString(),
  baseURL,
  pass: failures.length === 0,
  failures,
  rootInfo,
  serviceWorkerInfo,
  pageErrors,
  asset404s,
  failedRequests,
  consoleMessages: consoleMessages.slice(-80),
};

fs.writeFileSync(`${OUT}/browser-smoke-result.json`, JSON.stringify(result, null, 2));

await browser.close();

if (!result.pass) {
  console.log("PHASE101_BROWSER_STARTUP_SMOKE_FAIL");
  console.log(JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log("PHASE101_BROWSER_STARTUP_SMOKE_PASS");
console.log(JSON.stringify({
  rootChildCount: rootInfo.rootChildCount,
  title: rootInfo.title,
  cacheNames: serviceWorkerInfo.cacheNames,
  registrationCount: serviceWorkerInfo.registrationCount,
}, null, 2));
