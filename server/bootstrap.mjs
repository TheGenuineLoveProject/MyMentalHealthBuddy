import http from "node:http";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const PORT = Number(process.env.PORT || 5000);
const HOST = "0.0.0.0";

const hasExpress = () => existsSync("node_modules/express");

const bootstrapServer = http.createServer((_req, res) => {
  res.writeHead(200, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(hasExpress() ? "MMHB bootstrap (starting app)" : "MMHB bootstrap (installing)");
});

bootstrapServer.listen(PORT, HOST, async () => {
  console.log(`[bootstrap] listening on ${HOST}:${PORT} needs_install=${!hasExpress()}`);

  if (!hasExpress()) {
    console.log("[bootstrap] running npm install --omit=dev");
    const child = spawn("npm", ["install", "--omit=dev"], {
      stdio: "inherit",
      shell: false,
      env: process.env,
    });

    child.on("exit", async (code) => {
      if (code !== 0) {
        console.error(`[bootstrap] npm install failed with code ${code}`);
        process.exit(1);
      }

      console.log("[bootstrap] npm install complete");
      handoff();
    });
  } else {
    console.log("[bootstrap] express already present; skipping install");
    handoff();
  }
});

function handoff() {
  console.log("[bootstrap] handing off to server/app.mjs");
  bootstrapServer.close(async () => {
    await import("./app.mjs");
  });
}
