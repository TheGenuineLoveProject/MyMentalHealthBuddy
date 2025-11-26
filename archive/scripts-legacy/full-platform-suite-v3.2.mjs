// scripts/full-platform-suite-v3.2.mjs
// =======================================
// MyMentalHealthBuddy — AUTO-SUITE v3.2
// Replit-safe unified orchestrator
// - Kills all Node/Vite/TS processes (safe)
// - Runs npm install
// - Validates backend
// - Runs Auto-Heal (frontend + routes + build)
// - Kills ports again (extra safe)
// - Starts dev server (npm run dev)
// =======================================

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// --- Tiny path helper so this works from anywhere ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// assume script lives in /scripts, project root is one level up
const rootDir = path.resolve(__dirname, "..");

// --- Helper: run a command and stream output ---
function run(cmd, args = [], options = {}) {
  return new Promise((resolve) => {
    const pretty = [cmd, ...args].join(" ");
    console.log(`\n▶ Running: ${pretty}\n`);

    const child = spawn(cmd, args, {
      cwd: rootDir,
      stdio: "inherit",
      ...options,
    });

    child.on("close", (code) => {
      if (code !== 0) {
        console.warn(`⚠ Command exited with code ${code}: ${pretty}`);
      } else {
        console.log(`✅ Command finished: ${pretty}`);
      }
      resolve(code);
    });

    child.on("error", (err) => {
      console.error(`⚠ Failed to start command: ${pretty}`);
      console.error(err.message);
      resolve(1);
    });
  });
}

async function main() {
  console.log("\n💙 MyMentalHealthBuddy — FULL PLATFORM AUTO-SUITE v3.2\n");
  console.log("This will:\n");
  console.log("  1) Kill all Node/Vite/TS processes (safe)");
  console.log("  2) Run npm install");
  console.log("  3) Check backend imports (check-backend)");
  console.log("  4) Run Auto-Heal (frontend + routes + build)");
  console.log("  5) Kill ports again (extra safe)");
  console.log("  6) Start dev server on port 5000 (npm run dev)\n");

  // 1) Kill all Node/Vite/TS processes
  console.log("\n🔪 STEP 1 — Kill stray Node/Vite/TS processes (safe)...");
  await run("npm", ["run", "kill-ports"]);
  console.log("✅ STEP 1 complete.\n");

  // 2) npm install
  console.log("\n📦 STEP 2 — npm install (make sure all deps are present)...");
  const installCode = await run("npm", ["install"]);
  if (installCode !== 0) {
    console.log(
      "\n❌ npm install had problems. Fix that first, then re-run: npm run fullsuitev3_2\n"
    );
    return;
  }
  console.log("✅ STEP 2 complete.\n");

  // 3) Backend check
  console.log("\n🧠 STEP 3 — Backend import validation (npm run check-backend)...");
  const backendCode = await run("npm", ["run", "check-backend"]);
  if (backendCode !== 0) {
    console.log(
      "\n❌ Backend validation failed. Read the errors above, fix them, then run:\n" +
        "   npm run check-backend\n" +
        "   npm run fullsuitev3_2\n"
    );
    return;
  }
  console.log("✅ STEP 3 complete (backend is healthy).\n");

  // 4) Auto-Heal (frontend + routes + build)
  console.log(
    "\n💊 STEP 4 — Auto-Heal engine (npm run autoheal: frontend + routes + build)..."
  );
  const autoCode = await run("npm", ["run", "autoheal"]);
  if (autoCode !== 0) {
    console.log(
      "\n❌ Auto-Heal reported issues. Review logs above, fix, then run:\n" +
        "   npm run autoheal\n" +
        "   npm run fullsuitev3_2\n"
    );
    return;
  }
  console.log("✅ STEP 4 complete (auto-heal done).\n");

  // 5) Extra kill before dev (for EADDRINUSE safety)
  console.log(
    "\n🧹 STEP 5 — Extra clean-up kill before starting dev server (npm run kill-ports)..."
  );
  await run("npm", ["run", "kill-ports"]);
  console.log("✅ STEP 5 complete.\n");

  // 6) Start dev server
  console.log(
    "\n🚀 STEP 6 — Start DEV SERVER (npm run dev, port 5000)...\n" +
      "If you *ever* see 'EADDRINUSE: address already in use :::5000', do:\n" +
      "   1) Press Ctrl+C to stop\n" +
      "   2) Run: npm run kill-ports\n" +
      "   3) Run: npm run fullsuitev3_2\n"
  );

  // This will keep running and show your logs
  await run("npm", ["run", "dev"]);
}

main().catch((err) => {
  console.error("\n❌ AUTO-SUITE v3.2 crashed with an unexpected error:\n", err);
  console.error(
    "\nTry running these manually to see where it breaks:\n" +
      "  npm run kill-ports\n" +
      "  npm install\n" +
      "  npm run check-backend\n" +
      "  npm run autoheal\n" +
      "  npm run dev\n"
  );
});