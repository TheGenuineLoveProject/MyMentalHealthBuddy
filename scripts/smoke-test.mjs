// /scripts/smoke-test.mjs
import http from "http";

const BASE_HOST = "127.0.0.1";
const PORT = process.env.PORT || 5000;

function requestJSON(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;

    const options = {
      method,
      hostname: BASE_HOST,
      port: PORT,
      path,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data ? Buffer.byteLength(data) : 0,
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(raw || "{}") });
        } catch {
          resolve({ status: res.statusCode, json: raw });
        }
      });
    });

    req.on("error", reject);

    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  console.log(`Smoke test starting against http://${BASE_HOST}:${PORT}...`);

  // 1) Health check
  const health = await requestJSON("GET", "/api/health");
  console.log("/api/health", health.status, health.json);
  if (health.status !== 200) {
    console.error("❌ Health check failed");
    process.exit(1);
  }

  // 2) Mirror endpoint - missing text (should return 400)
  const mirrorEmpty = await requestJSON("POST", "/api/mirror", {});
  console.log("/api/mirror (empty)", mirrorEmpty.status, mirrorEmpty.json);
  if (mirrorEmpty.status !== 400 || mirrorEmpty.json?.ok !== false) {
    console.error("❌ Mirror empty check failed");
    process.exit(1);
  }

  // 3) Mirror endpoint - valid text
  const mirror = await requestJSON("POST", "/api/mirror", { 
    text: "I am feeling thoughtful today." 
  });
  console.log("/api/mirror (valid)", mirror.status, mirror.json);
  if (mirror.status !== 200 || !mirror.json?.ok) {
    console.error("❌ Mirror valid check failed");
    process.exit(1);
  }
  if (!mirror.json?.reflection) {
    console.error("❌ Mirror missing reflection");
    process.exit(1);
  }
  if (!mirror.json?.disclaimer) {
    console.error("❌ Mirror missing disclaimer");
    process.exit(1);
  }

  console.log("✅ Smoke test PASSED — health + mirror are working.");
  process.exit(0);
})();