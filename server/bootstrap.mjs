import http from "node:http";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const PORT = Number(process.env.PORT || 5000);
const HOST = "0.0.0.0";

// Resolve from this module's own location, NOT process.cwd(). In the production
// VM the working directory is not the repo root, so a cwd-relative check like
// existsSync("node_modules/express") falsely reports the dependency missing —
// which triggered a needless, slow runtime `npm install` that kept the app stuck
// on the "bootstrap (installing)" placeholder. __dirname/createRequire are
// cwd-independent. (server/app.mjs already resolves its asset paths the same way.)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

const hasExpress = () => {
  try {
    require.resolve("express");
    return true;
  } catch {
    return existsSync(path.join(ROOT, "node_modules", "express"));
  }
};

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
      cwd: ROOT,
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
