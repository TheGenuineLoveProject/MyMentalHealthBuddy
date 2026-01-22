const http = require("http");
const https = require("https");

const BASE = process.env.SMOKE_BASE_URL || "http://127.0.0.1:5000";
const PATHS = ["/api/health-check", "/api/health", "/health", "/"];

function get(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, (res) => {
      res.resume();
      resolve({ url, status: res.statusCode || 0 });
    });
    req.on("error", () => resolve({ url, status: 0 }));
    req.setTimeout(2500, () => {
      req.destroy();
      resolve({ url, status: 0 });
    });
  });
}

(async () => {
  console.log("== SMOKE HTTP ==");
  console.log("BASE:", BASE);

  let ok = false;
  for (const p of PATHS) {
    const r = await get(BASE + p);
    console.log(r.status, r.url);
    if (r.status === 200) ok = true;
  }

  if (!ok) {
    console.log("FAIL: No endpoint returned 200. Check routes and health endpoint.");
    process.exit(1);
  }

  console.log("PASS: Smoke check ok.");
})();
