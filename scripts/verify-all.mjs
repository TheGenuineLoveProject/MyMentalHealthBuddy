import { spawnSync } from "node:child_process";

const steps = [
  ["npm", ["run", "build"]],
  ["npm", ["run", "audit:duplicates"]],
  ["npm", ["run", "scan:routes"]],
  ["node", ["governance/copyrightScanner.mjs"]],
];

for (const [cmd, args] of steps) {
  console.log(`\n===== RUN ${cmd} ${args.join(" ")} =====`);
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: true });
  if (r.status !== 0) {
    console.error(`FAIL: ${cmd} ${args.join(" ")}`);
    process.exit(r.status || 1);
  }
}

console.log("\nPASS verify-all completed");
