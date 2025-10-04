#!/usr/bin/env node

/**
 * Production start script for deployment
 * Runs the application in production mode
 */

import { spawn } from "child_process";
import { existsSync } from "fs";

console.log("🚀 Starting production server...");

// Set production environment
process.env.NODE_ENV = "production";

// Determine the entry point
let entryPoint = "dist/index.js";
if (!existsSync(entryPoint)) {
  // Fallback to tsx if JavaScript build doesn't exist
  console.log("⚠️ JavaScript build not found, using tsx runtime fallback");
  entryPoint = "server/index.ts";
}

console.log(`📄 Starting from: ${entryPoint}`);

// Start the server
const isJavaScript = entryPoint.endsWith(".js");
const command = isJavaScript ? "node" : "npx";
const args = isJavaScript ? [entryPoint] : ["tsx", entryPoint];

const server = spawn(command, args, {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "production"
  }
});

server.on("error", (error) => {
  console.error("❌ Failed to start server:", error.message);
  process.exit(1);
});

server.on("exit", (code) => {
  if (code !== 0 && code !== null) {
    console.error(`❌ Server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Gracefully shutting down...");
  server.kill("SIGINT");
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Gracefully shutting down...");
  server.kill("SIGTERM");
});
