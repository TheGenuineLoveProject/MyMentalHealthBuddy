import { execSync } from "node:child_process";
execSync("node scripts/smoke.mjs", { stdio: "inherit" });
execSync("npm -s audit --audit-level=high || true", { stdio: "inherit", shell: "/bin/bash" });