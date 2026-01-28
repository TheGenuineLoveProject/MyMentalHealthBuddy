// tests/vitest.setup.mjs
import { spawn } from "node:child_process";

const PORT = process.env.PORT || "5000";
const BASE_URL = process.env.BASE_URL || `http://127.0.0.1:${PORT}`;

let serverProc;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer() {
  const healthPaths = ["/api/health", "/health", "/api/admin/health"];
  const deadline = Date.now() + 25_000;

  while (Date.now() < deadline) {
    for (const p of healthPaths) {
      try {
        const res = await fetch(`${BASE_URL}${p}`);
        if (res && res.ok) return;
      } catch (_) {
        // ignore until ready
      }
    }
    await sleep(250);
  }

  throw new Error(
    `Test server did not become ready at ${BASE_URL}. ` +
      `Make sure your server exposes one of: ${healthPaths.join(", ")}`
  );
}

beforeAll(async () => {
  // Ensure tests know where to call
  process.env.BASE_URL = BASE_URL;
  process.env.PORT = PORT;
  process.env.NODE_ENV = "test";

  // Start your server entrypoint in the background
  // If your entry file is different, change only the next line.
  serverProc = spawn("node", ["server/index.mjs"], {
    env: { ...process.env, PORT, NODE_ENV: "test" },
    stdio: "inherit",
  });

  await waitForServer();
}, 30_000);

afterAll(async () => {
  if (serverProc) {
    serverProc.kill("SIGTERM");
  }
});