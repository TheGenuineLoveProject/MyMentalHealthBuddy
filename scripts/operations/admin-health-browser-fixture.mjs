// Disposable browser qualification. Never start the application or load live secrets.
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { build } from "esbuild";

if (!process.argv.includes("--synthetic-child")) {
  const child = spawn(process.execPath, [new URL(import.meta.url).pathname, "--synthetic-child"], {
    env: { PATH: process.env.PATH, NODE_ENV: "test", JWT_SECRET: "synthetic-browser-health-secret-not-live",
      DATABASE_URL: "synthetic://never-connect", ADMIN_TOKEN: "synthetic-admin-login" },
    stdio: "inherit",
  });
  process.on("SIGTERM", () => child.kill("SIGTERM"));
  child.on("exit", code => { process.exitCode = code || 0; });
} else {
  const { default: express } = await import("express");
  const { default: jwt } = await import("jsonwebtoken");
  const { registerBrowserHealth } = await import("../../server/routes/adminBrowserHealth.mjs");
  const dir = await fs.mkdtemp(path.resolve("node_modules/.health-browser-fixture-"));
  await build({
    stdin: {
      contents: `
        import React, {useState} from "react";
        import {createRoot} from "react-dom/client";
        import {QueryClientProvider} from "@tanstack/react-query";
        import {queryClient} from "./client/src/lib/queryClient.js";
        import HealthDashboard from "./client/src/pages/admin/HealthDashboard.jsx";
        function App() {
          const [ready,setReady] = useState(false);
          async function login() {
            const response = await fetch("/api/admin/verify-token", {method:"POST",
              headers:{"Content-Type":"application/json"}, body: JSON.stringify({token:"synthetic-admin-login"})});
            const data = await response.json();
            if (!response.ok) throw new Error("Synthetic login failed");
            sessionStorage.setItem("adminSessionToken",data.sessionToken);
            setReady(true);
          }
          return <><p>ISOLATED SYNTHETIC HEALTH TEST - NO LIVE DATA</p>
            {ready ? <HealthDashboard/> : <button onClick={login}>Synthetic admin login</button>}</>;
        }
        createRoot(document.getElementById("root")).render(<QueryClientProvider client={queryClient}><App/></QueryClientProvider>);
      `,
      resolveDir: process.cwd(), loader: "jsx",
    },
    outfile: path.join(dir, "browser.js"), bundle: true, platform: "browser",
    jsx: "automatic", alias: { "@": path.resolve("client/src") },
    loader: { ".css": "empty" }, define: { "process.env.NODE_ENV": '"test"' },
    plugins: [{
      name: "isolate-unrelated-panels",
      setup(b) {
        b.onResolve({ filter: /Top50ProcessTracker|ReflectionFooter/ }, () => ({ path: "panel", namespace: "stub" }));
        b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({ contents: "export default function Panel(){return null}" }));
      },
    }],
  });
  const app = express();
  app.use(express.json());
  const router = express.Router();
  // Run the existing login handler unchanged, with a synthetic operational token
  // confined to this isolated test process.
  const source = await fs.readFile("server/routes/admin.mjs", "utf8");
  const loginSource = source.match(/router\.post\("\/verify-token",[\s\S]*?\n\}\);/)?.[0];
  if (!loginSource) throw new Error("Admin login handler not found");
  vm.runInNewContext(loginSource, { router, jwt, crypto, Buffer,
    ADMIN_TOKEN: process.env.ADMIN_TOKEN, ACCESS_SECRET: process.env.JWT_SECRET,
    logger: { warn() {}, info() {} } });
  let failure = false;
  app.post("/fixture/failure/:enabled", (req, res) => {
    failure = req.params.enabled === "true"; res.json({ ok: true });
  });
  app.get("/fixture/account/:role", (req, res) => {
    const role = req.params.role === "admin" ? "admin" : "user";
    res.json({ token: jwt.sign({ sub: "synthetic-account", role }, process.env.JWT_SECRET) });
  });
  router.use("/browser-health", (_req, res, next) => {
    if (failure) return res.status(503).json({ message: "Synthetic unavailable" });
    next();
  });
  registerBrowserHealth(router, { query: async () => ({ rows: [{ result: 1 }] }) });
  router.use("/health-deep", (_req, res) => res.status(503).json({ message: "Synthetic optional section unavailable" }));
  app.use("/api/admin", router);
  app.get("/browser.js", (_req, res) => res.sendFile(path.join(dir, "browser.js")));
  app.get("/", (_req, res) => res.type("html").send(`<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:system-ui;background:#f8faf9;color:#173d37;margin:24px}svg{width:20px;height:20px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}button{padding:12px}.glp-pane{padding:16px}</style></head><body><div id="root"></div><script src="/browser.js"></script></body></html>`));
  const server = app.listen(5001, "0.0.0.0", () => console.log("Synthetic browser health fixture ready on 5001"));
  process.on("SIGTERM", () => server.close(async () => {
    await fs.rm(dir, { recursive: true, force: true }); process.exit(0);
  }));
}