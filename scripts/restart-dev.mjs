import { execSync } from "node:child_process";

const cmds = [
  `pkill -f "server/dev.mjs" || true`,
  `pkill -f "node server" || true`,
  `pkill -f "vite" || true`,
  `pkill -f "npm run dev" || true`,
  `sleep 1`,
  `npm run dev`,
];

for (const c of cmds) execSync(c, { stdio: "inherit", shell: "/bin/bash" });