import { execSync } from "node:child_process";
execSync("node scripts/smoke.mjs", { stdio: "inherit" });
execSync("npm -s run lint || true", { stdio: "inherit", shell: "/bin/bash" });
execSync("npm -s run test || true", { stdio: "inherit", shell: "/bin/bash" });