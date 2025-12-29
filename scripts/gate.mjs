import { execSync } from "node:child_process";

const run = (cmd) => {
  console.log("\n> " + cmd);
  execSync(cmd, { stdio: "inherit" });
};

try {
  run("npm run smoke");
  run("npm run build");
  run("npm test");
  run("npm run audit:platform");
  console.log("\n✅ GATE PASSED: platform is healthy");
} catch (e) {
  console.error("\n❌ GATE FAILED: fix above errors then rerun");
  process.exit(1);
}