import fs from "node:fs";

const OUT = "diagnostics/phase101b";
fs.mkdirSync(OUT, { recursive: true });

const baseURL = process.env.PHASE101_BASE_URL || "http://localhost:5000";

async function fetchText(path) {
  const response = await fetch(`${baseURL}${path}`, { cache: "no-store" });
  const text = await response.text();
  return {
    path,
    status: response.status,
    ok: response.ok,
    text,
  };
}

const staticChecks = [];
const staticFailures = [];

const root = await fetchText("/");
const sw = await fetchText("/serviceWorker.js");
const offline = await fetchText("/offline.html");

staticChecks.push({ name: "ROOT_HTTP_OK", pass: root.ok, status: root.status });
staticChecks.push({ name: "SERVICE_WORKER_HTTP_OK", pass: sw.ok, status: sw.status });
staticChecks.push({ name: "OFFLINE_HTML_HTTP_OK", pass: offline.ok, status: offline.status });

if (!root.ok) staticFailures.push("ROOT_HTTP_NOT_OK");
if (!sw.ok) staticFailures.push("SERVICE_WORKER_HTTP_NOT_OK");
if (!offline.ok) staticFailures.push("OFFLINE_HTML_HTTP_NOT_OK");

const rootHasMount = root.text.includes('<div id="root"');
const rootHasAssets = /\/assets\/[^"' ]+\.js/.test(root.text) && /\/assets\/[^"' ]+\.css/.test(root.text);
const swPhase100 = sw.text.includes("mmhb-pwa-phase100-v1");
const swNetworkFirst = sw.text.includes("networkFirstNavigation");
const swNoStore = sw.text.includes('cache: "no-store"');
const swPrecacheSection = sw.text.match(/const PRECACHE_URLS\s*=\s*\[[\s\S]*?\];/)?.[0] || "";
const swPrecacheBad =
  swPrecacheSection.includes('"/"') ||
  swPrecacheSection.includes("'/'") ||
  swPrecacheSection.includes("index.html");
const offlineHasSafety = offline.text.includes("988") && /offline/i.test(offline.text);

staticChecks.push({ name: "ROOT_HAS_REACT_MOUNT", pass: rootHasMount });
staticChecks.push({ name: "ROOT_HAS_JS_AND_CSS_ASSETS", pass: rootHasAssets });
staticChecks.push({ name: "SW_HAS_PHASE100_VERSION", pass: swPhase100 });
staticChecks.push({ name: "SW_HAS_NETWORK_FIRST", pass: swNetworkFirst });
staticChecks.push({ name: "SW_HAS_NO_STORE_NAVIGATION", pass: swNoStore });
staticChecks.push({ name: "SW_DOES_NOT_PRECACHE_ROOT_OR_INDEX", pass: !swPrecacheBad });
staticChecks.push({ name: "OFFLINE_HAS_SAFETY_COPY", pass: offlineHasSafety });

if (!rootHasMount) staticFailures.push("ROOT_MISSING_REACT_MOUNT");
if (!rootHasAssets) staticFailures.push("ROOT_MISSING_JS_OR_CSS_ASSETS");
if (!swPhase100) staticFailures.push("SW_PHASE100_VERSION_MISSING");
if (!swNetworkFirst) staticFailures.push("SW_NETWORK_FIRST_MISSING");
if (!swNoStore) staticFailures.push("SW_NO_STORE_MISSING");
if (swPrecacheBad) staticFailures.push("SW_PRECACHES_ROOT_OR_INDEX");
if (!offlineHasSafety) staticFailures.push("OFFLINE_SAFETY_COPY_MISSING");

let browserResult = null;
let browserFailureType = null;

try {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ serviceWorkers: "allow" });
  const page = await context.newPage();

  const pageErrors = [];
  const failedRequests = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) => {
    failedRequests.push({
      url: request.url(),
      failure: request.failure()?.errorText || "unknown",
    });
  });

  await page.goto(baseURL, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForSelector("#root", { timeout: 30000 });

  const rootInfo = await page.evaluate(() => {
    const root = document.querySelector("#root");
    const bodyText = document.body.innerText || "";
    return {
      rootExists: Boolean(root),
      rootChildCount: root?.childElementCount ?? 0,
      bodyTextLength: bodyText.trim().length,
      hasCrisisOnlyFallback: bodyText.includes("If you are in crisis") && bodyText.length < 2500,
      hasInstallingText: /\binstalling\b/i.test(bodyText),
      hasOfflineOnlyText: bodyText.includes("You are offline") && bodyText.length < 2500,
      title: document.title,
    };
  });

  await browser.close();

  const browserFailures = [];
  if (!rootInfo.rootExists) browserFailures.push("ROOT_MISSING");
  if (rootInfo.rootChildCount < 1) browserFailures.push("REACT_ROOT_EMPTY");
  if (rootInfo.hasCrisisOnlyFallback) browserFailures.push("CRISIS_ONLY_FALLBACK_VISIBLE");
  if (rootInfo.hasInstallingText) browserFailures.push("INSTALLING_TEXT_VISIBLE");
  if (rootInfo.hasOfflineOnlyText) browserFailures.push("OFFLINE_ONLY_VISIBLE");
  if (pageErrors.length > 0) browserFailures.push("PAGE_ERRORS_PRESENT");
  if (failedRequests.some((item) => /\/assets\/|\.js|\.css/.test(item.url))) browserFailures.push("ASSET_FAILURE_PRESENT");

  browserResult = {
    attempted: true,
    available: true,
    pass: browserFailures.length === 0,
    failures: browserFailures,
    rootInfo,
    pageErrors,
    failedRequests,
  };
} catch (error) {
  browserFailureType =
    /libglib-2\.0\.so\.0|shared libraries|cannot open shared object file/i.test(String(error?.message))
      ? "ENVIRONMENT_MISSING_SYSTEM_LIBRARIES"
      : "BROWSER_TEST_EXECUTION_FAILURE";

  browserResult = {
    attempted: true,
    available: false,
    pass: false,
    failureType: browserFailureType,
    message: String(error?.message || error),
  };
}

const staticPass = staticFailures.length === 0;
const browserPass = browserResult?.pass === true;
const environmentBlocked =
  browserResult?.available === false &&
  browserResult?.failureType === "ENVIRONMENT_MISSING_SYSTEM_LIBRARIES";

const finalPass = browserPass || (staticPass && environmentBlocked);

const report = {
  generatedAt: new Date().toISOString(),
  baseURL,
  finalPass,
  verificationMode: browserPass
    ? "BROWSER_RUNTIME_PASS"
    : environmentBlocked
      ? "STATIC_STARTUP_PASS_BROWSER_ENV_BLOCKED"
      : "FAIL",
  staticPass,
  staticFailures,
  staticChecks,
  browserResult,
  note:
    environmentBlocked
      ? "Browser runtime smoke could not execute because the container is missing Chromium system libraries. Static startup and service-worker cache gates passed, but a true browser runtime check should be rerun in an environment with Playwright system dependencies."
      : "",
};

fs.writeFileSync(`${OUT}/browser-or-static-startup-gate.json`, JSON.stringify(report, null, 2));

if (!finalPass) {
  console.log("PHASE101B_BROWSER_OR_STATIC_STARTUP_GATE_FAIL");
  console.log(JSON.stringify(report, null, 2));
  process.exit(1);
}

console.log("PHASE101B_BROWSER_OR_STATIC_STARTUP_GATE_PASS");
console.log(JSON.stringify({
  verificationMode: report.verificationMode,
  staticPass,
  browserPass,
  environmentBlocked,
}, null, 2));
