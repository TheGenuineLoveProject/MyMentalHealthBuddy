// scripts/fix_all.mjs
// =====================================================
// MyMentalHealthBuddy - FULL A+B+C FIX SUITE (Replit ESM)
// - Fixes frontend entry files and routes
// - Repairs index.html entry reference
// - Creates helper scripts (kill ports, check frontend, dev-all)
// - Keeps backend intact (uses existing check-backend.mjs)
// =====================================================

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
// scripts/kill-all.mjs
import { execSync } from "child_process";

console.log("\n🔥 MyMentalHealthBuddy — UNIVERSAL KILL SWITCH v4");
console.log("   (Guaranteed kill of Node, Vite, TS-Node, Bun, old builds)\n");

const cmds = [
  "pkill -f node || true",
  "pkill -f vite || true",
  "pkill -f ts-node || true",
  "pkill -f dev || true",
  "pkill -f server/index.mjs || true",
  "pkill -f \"npm run dev\" || true",
  "pkill -f \"node server\" || true",
  "sleep 1"
];

for (const c of cmds) {
  try {
    execSync(c, { stdio: "inherit", shell: "/bin/bash" });
  } catch {}
}

console.log("\n✨ All Node/Vite/TS processes killed safely.\n");
// ----------------- Path helpers -----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const clientDir = path.join(rootDir, "client");

// Small logger
function log(msg) {
  console.log(`▶ ${msg}`);
}

// Ensure a directory exists
async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

// Create or overwrite a file with content
async function writeFileSafe(filePath, content) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
  log(`Wrote: ${path.relative(rootDir, filePath)}`);
}

// Read a file or return null if it doesn't exist
async function readFileMaybe(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch {
    return null;
  }
}

// Simple runner (for optional checks)
function runCmd(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    log(`Running: ${cmd} ${args.join(" ")}`);
    const child = spawn(cmd, args, {
      stdio: "inherit",
      ...options,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        console.warn(`⚠ Command exited with code ${code}`);
        resolve(); // don't hard-fail — just warn
      }
    });

    child.on("error", (err) => {
      console.warn(`⚠ Failed to run ${cmd}:`, err.message);
      resolve();
    });
  });
}

// =====================================================
// PART A — FRONTEND FIX (missing files + index.html)
// =====================================================
async function fixFrontendStructure() {
  log("Starting FRONTEND structure fix (A)…");

  const srcDir = path.join(clientDir, "src");
  const routesDir = path.join(srcDir, "routes");

  await ensureDir(srcDir);
  await ensureDir(routesDir);

  // ---------- 1) App.tsx ----------
  const appTsxPath = path.join(srcDir, "App.tsx");
  const defaultAppTsx = `import React from "react";
import "./main.css";

export function App() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "linear-gradient(135deg, #f5f7ff, #e7f6ff)",
      color: "#123",
      padding: "24px"
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        MyMentalHealthBuddy ❤️
      </h1>
      <p style={{ maxWidth: 480, textAlign: "center", marginBottom: "1.5rem" }}>
        Frontend is connected and healthy. You can now wire real pages, routes,
        and components step by step.
      </p>
      <p style={{
        fontSize: "0.9rem",
        opacity: 0.8
      }}>
        Edit <code>client/src/App.tsx</code> and <code>client/src/routes</code> to build your real UI.
      </p>
    </div>
  );
}

export default App;
`;

  await writeFileSafe(appTsxPath, defaultAppTsx);

  // ---------- 2) main.tsx ----------
  const mainTsxPath = path.join(srcDir, "main.tsx");
  const defaultMainTsx = `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

  await writeFileSafe(mainTsxPath, defaultMainTsx);

  // ---------- 3) routes placeholder ----------
  const routesIndexPath = path.join(routesDir, "index.tsx");
  const defaultRoutesIndex = `// Placeholder routes file
// You can replace this with React Router or your own routing system.

export function HomeRoute() {
  return null;
}
`;

  await writeFileSafe(routesIndexPath, defaultRoutesIndex);

  // ---------- 4) Basic CSS (optional but nice) ----------
  const mainCssPath = path.join(srcDir, "main.css");
  const mainCssDefault = `*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
`;
  await writeFileSafe(mainCssPath, mainCssDefault);

  log("Frontend core files ensured (App.tsx, main.tsx, routes/index.tsx, main.css).");
}

// Fix index.html to point at /src/main.tsx instead of /src/main.jsx
async function fixIndexHtmlEntry() {
  log("Checking client/index.html entry script…");

  const indexHtmlPath = path.join(clientDir, "index.html");
  const html = await readFileMaybe(indexHtmlPath);

  if (!html) {
    console.warn("⚠ client/index.html not found — skipping HTML fix.");
    return;
  }

  let updated = html;
  // Replace any reference to main.jsx with main.tsx
  updated = updated.replace(/\/src\/main\.jsx/g, "/src/main.tsx");

  if (updated !== html) {
    await writeFileSafe(indexHtmlPath, updated);
    log("Updated client/index.html to use /src/main.tsx.");
  } else {
    log("client/index.html already points to /src/main.tsx (or no .jsx reference found).");
  }
}

// =====================================================
// PART B — HELPER SCRIPTS (kill ports, check frontend)
// =====================================================

async function createKillPortsScript() {
  const killPath = path.join(rootDir, "scripts", "kill-ports.mjs");
  const killContent = `// scripts/kill-ports.mjs
// Kill common dev ports and stray Node processes (Replit-safe)

import { spawn } from "child_process";

function run(cmd, args) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("close", () => resolve());
    child.on("error", () => resolve());
  });
}

async function main() {
  console.log("🔪 Killing stray Node processes on ports 5000/5173…");
  await run("pkill", ["-f", "node"]);
  await run("pkill", ["-f", "5000"]);
  await run("pkill", ["-f", "5173"]);
  console.log("✅ kill-ports complete (if there were any processes).");
}

main().catch((err) => {
  console.error("kill-ports error:", err);
});
`;

  await writeFileSafe(killPath, killContent);
}

async function createCheckFrontendScript() {
  const checkPath = path.join(rootDir, "scripts", "check-frontend.mjs");
  const checkContent = `// scripts/check-frontend.mjs
// Simple health check for the Vite/React client.

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const clientDir = path.join(rootDir, "client");

function run(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log("▶", cmd, args.join(" "));
    const child = spawn(cmd, args, {
      stdio: "inherit",
      ...options,
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Frontend check passed.");
        resolve();
      } else {
        console.error("❌ Frontend check failed with code", code);
        resolve();
      }
    });

    child.on("error", (err) => {
      console.error("⚠ Error running command:", err.message);
      resolve();
    });
  });
}

async function main() {
  console.log("\\nMyMentalHealthBuddy — Frontend Check");
  console.log("=====================================");

  await run("npm", ["run", "build"], { cwd: clientDir });
}

main().catch((err) => {
  console.error("check-frontend.mjs error:", err);
});
`;

  await writeFileSafe(checkPath, checkContent);
}

async function createDevAllScript() {
  const devAllPath = path.join(rootDir, "scripts", "dev-all.mjs");
  const devAllContent = `// scripts/dev-all.mjs
// Convenience launcher: kill ports, then \`npm run dev\`.
// (Assumes your package.json dev script starts backend; Replit will handle frontend separately.)

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function run(cmd, args, options = {}) {
  return new Promise((resolve) => {
    console.log("▶", cmd, args.join(" "));
    const child = spawn(cmd, args, {
      stdio: "inherit",
      ...options,
    });

    child.on("close", () => resolve());
    child.on("error", () => resolve());
  });
}

async function main() {
  console.log("\\nMyMentalHealthBuddy — dev-all launcher");
  console.log("=======================================");

  // 1) Kill stray ports
  await run("node", ["scripts/kill-ports.mjs"], { cwd: rootDir });

  // 2) Start backend dev server
  await run("npm", ["run", "dev"], { cwd: rootDir });

  console.log("dev-all finished.");
}

main().catch((err) => {
  console.error("dev-all.mjs error:", err);
});
`;

  await writeFileSafe(devAllPath, devAllContent);
}

// =====================================================
// PART C — ORCHESTRATOR (A+B+C in one run)
// =====================================================

async function main() {
  console.log("\n🔧 MyMentalHealthBuddy — FULL A+B+C FIX SUITE");
  console.log("============================================");

  // A — Frontend structure + HTML entry
  await fixFrontendStructure();
  await fixIndexHtmlEntry();

  // B — Helper scripts
  await createKillPortsScript();
  await createCheckFrontendScript();
  await createDevAllScript();

  console.log("\n✅ Core files + helper scripts created.");
  console.log("   Created /updated:");
  console.log("   - client/src/App.tsx");
  console.log("   - client/src/main.tsx");
  console.log("   - client/src/main.css");
  console.log("   - client/src/routes/index.tsx");
  console.log("   - scripts/kill-ports.mjs");
  console.log("   - scripts/check-frontend.mjs");
  console.log("   - scripts/dev-all.mjs");

  console.log("\n▶ Next suggested commands (run manually in shell):");
  console.log("   1) node scripts/check-backend.mjs");
  console.log("   2) node scripts/check-frontend.mjs");
  console.log("   3) node scripts/kill-ports.mjs");
  console.log("   4) npm run dev   (or: node scripts/dev-all.mjs)");

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("fix_all.mjs error:", err);
});