const http = require("http");
const https = require("https");

const base = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
const candidates = ["/api/auth/session", "/api/auth/signin", "/api/login", "/api/admin"];

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
  console.log("== AUTH SMOKE ==");
  console.log(`Base: ${base}`);
  for (const p of candidates) {
    const r = await get(base + p);
    const ok = [200, 302, 401, 403].includes(r.status);
    console.log(`${ok ? "OK " : "?? "} ${r.status} ${r.url}`);
  }
})();
