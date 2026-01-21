// tools/governance-loop.mjs
import { spawn } from "node:child_process";

function run(cmd, args = [], opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit", shell: false, ...opts });
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(" ")} failed (${code})`))));
  });
}

async function main() {
  // Best-effort port cleanup (non-fatal)
  await run("bash", ["-lc", "lsof -i :5000 || true"]).catch(() => {});
  await run("bash", ["-lc", "kill -9 $(lsof -t -i :5000) 2>/dev/null || true"]).catch(() => {});
  await run("bash", ["-lc", "lsof -i :3000 || true"]).catch(() => {});
  await run("bash", ["-lc", "kill -9 $(lsof -t -i :3000) 2>/dev/null || true"]).catch(() => {});

  await run("node", ["-v"]);
  await run("npm", ["-v"]);
  await run("npm", ["install"]);

  await run("npm", ["run", "test:auth"]).catch(async () => {
    await run("npx", ["vitest", "run", "tests/auth.test.mjs"]);
  });

  await run("npm", ["run", "audit"]);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});