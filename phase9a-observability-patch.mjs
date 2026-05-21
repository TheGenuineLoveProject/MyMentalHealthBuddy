import fs from "fs";

const candidates = [
  "server/index.ts",
  "server/index.js",
  "server/app.mjs",
  "server.js",
  "index.js",
  "index.mjs"
];

const file = candidates.find((p) => fs.existsSync(p) && fs.readFileSync(p, "utf8").includes("listen"));
if (!file) {
  console.error("FAIL: Could not find active server file containing listen().");
  process.exit(1);
}

let src = fs.readFileSync(file, "utf8");

if (src.includes("PHASE_9A_OBSERVABILITY")) {
  console.log(`Already patched: ${file}`);
  process.exit(0);
}

const observability = `

// ===== PHASE_9A_OBSERVABILITY START =====
const __phase9aStartTime = Date.now();

function __phase9aRequestId() {
  return "req_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
}

if (typeof app !== "undefined" && app && typeof app.use === "function") {
  app.use((req, res, next) => {
    const start = Date.now();
    req.requestId = req.headers["x-request-id"] || __phase9aRequestId();
    res.setHeader("x-request-id", req.requestId);

    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(JSON.stringify({
        level: "info",
        type: "request",
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl || req.url,
        status: res.statusCode,
        durationMs: duration,
        timestamp: new Date().toISOString()
      }));
    });

    next();
  });

  app.get("/ready", (_req, res) => {
    res.status(200).json({
      status: "ready",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  app.get("/metrics", (_req, res) => {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      node_version: process.version,
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString()
    });
  });

  app.use((err, req, res, next) => {
    console.error(JSON.stringify({
      level: "error",
      type: "server_error",
      requestId: req?.requestId || null,
      message: err?.message || "Unknown error",
      stack: process.env.NODE_ENV === "production" ? undefined : err?.stack,
      timestamp: new Date().toISOString()
    }));

    if (res.headersSent) return next(err);

    res.status(err?.status || 500).json({
      error: "Internal Server Error",
      requestId: req?.requestId || null
    });
  });

  console.log(JSON.stringify({
    level: "info",
    type: "startup",
    phase: "PHASE_9A_OBSERVABILITY",
    node_version: process.version,
    node_env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    timestamp: new Date(__phase9aStartTime).toISOString()
  }));
}
// ===== PHASE_9A_OBSERVABILITY END =====
`;

const listenIndex = src.search(/app\\.listen\\s*\\(/);

if (listenIndex === -1) {
  console.error(`FAIL: Found ${file}, but could not locate app.listen(`);
  process.exit(1);
}

src = src.slice(0, listenIndex) + observability + "\n" + src.slice(listenIndex);

fs.writeFileSync(file, src);
console.log(`PASS: Patched observability into ${file}`);
