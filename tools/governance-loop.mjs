// tools/governance-loop.mjs
// Pure Node governance loop - no bash, no new deps
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";

function run(cmd, args = []) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit", shell: false });
    p.on("error", reject);
    p.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${cmd} ${args.join(" ")} exited with code ${code}`))
    );
  });
}

function hasBuildScript() {
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    return Boolean(pkg.scripts?.build);
  } catch {
    return false;
  }
}

async function main() {
  console.log("\n=== GOVERNANCE LOOP ===\n");

  console.log("1. Node version:");
  await run("node", ["-v"]);

  console.log("\n2. npm version:");
  await run("npm", ["-v"]);

  console.log("\n3. Installing dependencies...");
  await run("npm", ["install"]);

  console.log("\n4. Running auth tests...");
  try {
    await run("npm", ["run", "test:auth"]);
  } catch {
    console.log("   Fallback: running vitest directly...");
    await run("npx", ["vitest", "run", "tests/auth.test.mjs"]);
  }

  console.log("\n5. Running platform audits...");
  await run("npm", ["run", "audit"]);

  if (hasBuildScript()) {
    console.log("\n6. Running production build...");
    await run("npm", ["run", "build"]);
  } else {
    console.log("\n6. No build script found, skipping...");
  }

  console.log("\n=== ALL GATES PASSED ===\n");
}

main().catch((err) => {
  console.error("\n=== GOVERNANCE FAILED ===");
  console.error(err.message);
  process.exit(1);
});
