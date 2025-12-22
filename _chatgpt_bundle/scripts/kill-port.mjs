import { execSync } from "node:child_process";

const port = process.argv[2] || process.env.PORT || "5000";

function run(cmd) {
  try { execSync(cmd, { stdio: "ignore" }); } catch {}
}

// Prefer fuser, fallback lsof if available
run(`bash -lc "command -v fuser >/dev/null 2>&1 && fuser -k ${port}/tcp >/dev/null 2>&1 || true"`);
run(`bash -lc "command -v lsof >/dev/null 2>&1 && (lsof -ti tcp:${port} | xargs -r kill -9) >/dev/null 2>&1 || true"`);

console.log(`✅ Cleared port ${port} (if anything was using it).`);
