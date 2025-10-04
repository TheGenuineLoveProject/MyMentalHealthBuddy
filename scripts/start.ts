// @ts-check
// scripts/start.ts
import { spawn } from "child_process";

console.log("🚀 Starting full platform (backend + frontend)...");

const backend = spawn("npx", ["tsx", "server/index.ts"], { stdio: "inherit" });
const frontend = spawn("npm", ["run", "dev", "--prefix", "client"], { stdio: "inherit" });

backend.on("close", (code) => {
  console.log(`💾 Backend exited with code ${code}`);
});
frontend.on("close", (code) => {
  console.log(`💅 Frontend exited with code ${code}`);
});