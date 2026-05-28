import http from "node:http";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT) || 5000;
const NEEDS_INSTALL = !existsSync(path.join(REPO_ROOT, "node_modules", "express"));

let phase = "boot";

const bootstrapServer = http.createServer((req, res) => {
  const status = phase === "swapping" ? 503 : 200;
  res.writeHead(status, {
    "Content-Type": "text/plain",
    "Cache-Control": "no-store",
    "X-Bootstrap-Phase": phase,
  });
  res.end(`MMHB bootstrap (${phase})\n`);
});

bootstrapServer.listen(PORT, "0.0.0.0", () => {
  console.log(`[bootstrap] listening on 0.0.0.0:${PORT} needs_install=${NEEDS_INSTALL}`);
  if (!NEEDS_INSTALL) {
    handoff();
    return;
  }
  phase = "installing";
  console.log("[bootstrap] running npm install --omit=dev");
  const install = spawn(
    "npm",
    ["install", "--omit=dev", "--no-audit", "--no-fund", "--prefer-offline"],
    { stdio: "inherit", cwd: REPO_ROOT }
  );
  install.on("exit", (code) => {
    if (code !== 0) {
      console.error(`[bootstrap] npm install failed code=${code}`);
      process.exit(1);
    }
    console.log("[bootstrap] npm install complete");
    handoff();
  });
});

function handoff() {
  phase = "swapping";
  bootstrapServer.close(() => {
    console.log("[bootstrap] handing off to server/app.mjs");
    import("./app.mjs").catch((err) => {
      console.error("[bootstrap] failed to start real server:", err);
      process.exit(1);
    });
  });
}
