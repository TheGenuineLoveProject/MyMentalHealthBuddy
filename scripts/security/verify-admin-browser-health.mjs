import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import vm from "node:vm";

if (process.argv[2] !== "--synthetic-child") {
  // Never inherit live credentials or database URLs into the regression process.
  const result = spawnSync(process.execPath, [new URL(import.meta.url).pathname, "--synthetic-child"], {
    cwd: new URL("../../", import.meta.url).pathname,
    env: {
      PATH: process.env.PATH || "",
      NODE_ENV: "test",
      DATABASE_URL: "synthetic://never-connect",
      JWT_SECRET: "synthetic-jwt-secret-for-browser-health-regression-0001",
      OPENAI_API_KEY: "synthetic-openai-never-echo",
      STRIPE_SECRET_KEY: "synthetic-stripe-never-echo",
      ADMIN_API_TOKEN: "synthetic-internal-only-token",
    },
    encoding: "utf8",
    timeout: 12000,
  });
  if (result.status !== 0) {
    throw new Error(`Synthetic browser-health regression failed: ${result.stderr || result.error || result.stdout}`);
  }
  console.log(result.stdout.trim());
} else {
  const { default: express } = await import("express");
  const { default: jwt } = await import("jsonwebtoken");
  const { signUserToken } = await import("../../server/middleware/auth.mjs");
  const { registerBrowserHealth } = await import("../../server/routes/adminBrowserHealth.mjs");

  const appSource = readFileSync(new URL("../../server/app.mjs", import.meta.url), "utf8");
  const adminSource = readFileSync(new URL("../../server/routes/admin.mjs", import.meta.url), "utf8");
  assert.match(adminSource, /registerBrowserHealth\(router\)/);
  assert.match(appSource, /app\.use\("\/api\/admin", adminRoutes\)/);

  // Execute the real pre-route guards, not a reimplementation, against synthetic endpoints.
  const exactGuardSource = appSource.match(/app\.use\(\(req, res, next\) => \{\s*const blockedAdminDiagnosticPaths[\s\S]*?\n\}\);/)?.[0];
  const prefixGuardSource = appSource.match(/const phase113jgV2AdminDiagnosticGuard = \(req, res, next\) => \{[\s\S]*?\n\};\s*app\.use\("\/api\/admin\/health", phase113jgV2AdminDiagnosticGuard\);\s*app\.use\("\/api\/admin\/diagnostics", phase113jgV2AdminDiagnosticGuard\);/)?.[0];
  assert.ok(exactGuardSource && prefixGuardSource, "internal diagnostic guards must remain mounted");

  const app = express();
  vm.runInNewContext(`${exactGuardSource}\n${prefixGuardSource}`, { app, process });
  let query = async () => ({ rows: [{ "?column?": 1 }] });
  let calls = 0;
  const router = express.Router();
  registerBrowserHealth(router, {
    query: sql => { calls++; assert.equal(sql, "SELECT 1"); return query(); },
    uptime: () => 90061,
  });
  app.use("/api/admin", router);
  app.get("/api/admin/health", (_req, res) => res.json({ internal: true }));
  app.get("/api/admin/diagnostics", (_req, res) => res.json({ internal: true }));
  const server = app.listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/admin`;
  const get = async (path, token, headers = {}) => {
    const response = await fetch(base + path, {
      headers: { ...(token ? { authorization: `Bearer ${token}` } : {}), ...headers },
    });
    return { status: response.status, cache: response.headers.get("cache-control"), body: await response.json() };
  };

  try {
    const ordinary = signUserToken({ id: "synthetic-user", role: "user" });
    const admin = signUserToken({ id: "synthetic-admin", role: "admin" });
    const adminSession = jwt.sign({ role: "admin", timestamp: Date.now() }, process.env.JWT_SECRET, { expiresIn: "4h" });
    const expired = jwt.sign({ role: "admin", exp: Math.floor(Date.now() / 1000) - 10 }, process.env.JWT_SECRET);
    for (const [token, expected] of [[null, 401], [ordinary, 403], [expired, 401]]) {
      const response = await get("/browser-health", token);
      assert.equal(response.status, expected);
      assert.equal(response.cache, "no-store");
      assert.equal("database" in response.body, false);
    }
    assert.equal(calls, 0, "unauthorized callers must never probe the database");
    for (const token of [adminSession, admin]) {
      const response = await get("/browser-health", token);
      assert.equal(response.status, 200);
      assert.equal(response.cache, "no-store");
      assert.deepEqual(Object.keys(response.body).sort(), ["ok", "status", "buildVersion", "timestamp", "uptime", "uptimeSeconds", "database", "environment", "system"].sort());
      assert.deepEqual(Object.keys(response.body.database).sort(), ["status", "latencyMs"].sort());
      assert.deepEqual(Object.keys(response.body.environment).sort(), ["NODE_ENV", "DATABASE_URL", "JWT_SECRET", "OPENAI_API_KEY", "STRIPE_SECRET_KEY"].sort());
      assert.deepEqual(Object.keys(response.body.system).sort(), ["nodeVersion", "platform", "heapUsed", "heapTotal", "freeMemory", "totalMemory"].sort());
      assert.equal(response.body.ok, true);
      assert.equal(response.body.status, "healthy");
      assert.equal(response.body.database.status, "connected");
      assert.equal(typeof response.body.database.latencyMs, "number");
      assert.equal(response.body.uptime, "1d 1h 1m 1s");
      assert.equal(response.body.uptimeSeconds, 90061);
      assert.match(response.body.buildVersion, /^\d+\.\d+\.\d+/);
      assert.ok(Object.values(response.body.environment).every(value => value === true));
      assert.ok(Object.values(response.body.system).every(value => typeof value === "string"));
      assert.doesNotMatch(JSON.stringify(response.body), /synthetic-(jwt|openai|stripe|internal|never-connect)/);
    }
    query = async () => { throw new Error("synthetic-sensitive-database-error"); };
    const unavailable = await get("/browser-health", admin);
    assert.equal(unavailable.status, 200);
    assert.equal(unavailable.body.ok, false);
    assert.equal(unavailable.body.status, "degraded");
    assert.deepEqual(unavailable.body.database, { status: "disconnected", latencyMs: null });
    assert.doesNotMatch(JSON.stringify(unavailable.body), /synthetic-sensitive-database-error/);

    query = () => new Promise(() => {});
    const started = Date.now();
    const hanging = await get("/browser-health", admin);
    assert.ok(Date.now() - started < 4000, "hanging database probe must be bounded");
    assert.deepEqual(hanging.body.database, { status: "disconnected", latencyMs: null });
    assert.equal(hanging.cache, "no-store");
    delete process.env.DATABASE_URL;
    const missing = await get("/browser-health", admin);
    assert.equal(missing.body.environment.DATABASE_URL, false);
    assert.deepEqual(missing.body.database, { status: "disconnected", latencyMs: null });

    for (const path of ["/health", "/diagnostics"]) {
      for (const token of [null, ordinary, expired, adminSession, admin]) {
        const response = await get(path, token);
        assert.equal(response.status, 404, `${path} must stay concealed without internal token`);
        assert.deepEqual(response.body, { ok: false, error: "not_found" });
      }
    }
    for (const path of ["/health", "/diagnostics"]) {
      const response = await get(path, null, { "x-admin-token": process.env.ADMIN_API_TOKEN });
      assert.equal(response.status, 200, "internal token keeps existing guard behavior");
    }
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
  console.log("PASS: synthetic browser health auth, shape, DB failures/timeouts, and internal guard concealment");
}