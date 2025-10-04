// @ts-check
#!/usr/bin/env node
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

console.log("🚀 Starting MyMentalHealthBuddy Server...");

// Start the server using tsx for development/production
const serverProcess = spawn("npx", ["tsx", "server/index.ts"], {
  cwd: rootDir,
  stdio: "inherit",
  shell: false,
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || "production"
  }
});

serverProcess.on("error", (err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});

serverProcess.on("exit", (code) => {
  if (code !== null && code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n⏹️  Stopping server...");
  serverProcess.kill("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  serverProcess.kill("SIGTERM");
  process.exit(0);
});
