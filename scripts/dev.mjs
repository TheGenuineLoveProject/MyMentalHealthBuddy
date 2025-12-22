// scripts/dev.mjs
import { spawn } from "node:child_process";

function run(cmd, args, label) {
  const p = spawn(cmd, args, { stdio: "inherit", shell: true });
  p.on("exit", (code) => process.exit(code ?? 0));
  console.log(`[dev] started ${label}`);
}

const PORT = process.env.PORT || "5000";
process.env.PORT = PORT;
process.env.HOST = "0.0.0.0";

run("npm", ["run", "start"], "server");