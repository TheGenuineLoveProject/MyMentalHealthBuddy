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

  // 2) AI chat check using smoke-test token
  const ai = await requestJSON(
    "POST",
    "/api/v1/ai/chat",
    { message: "Hello from smoke test" },
    { Authorization: "Bearer smoketest-token" }
  );
  console.log("/api/v1/ai/chat", ai.status, ai.json);

  if (ai.status !== 200 || !ai.json?.ok) {
    console.error("❌ AI chat check failed");
    process.exit(1);
  }

  console.log("✅ Smoke test PASSED — health + AI chat are working.");
  process.exit(0);
})();