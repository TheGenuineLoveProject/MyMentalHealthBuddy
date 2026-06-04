import fs from "fs";
import { execSync } from "child_process";

const now = new Date().toISOString();

function safe(cmd){
  try{
    return execSync(cmd,{encoding:"utf8"}).trim();
  }catch{
    return "FAILED";
  }
}

const snapshot = {
  timestamp: now,
  node: safe("node -v"),
  npm: safe("npm -v"),
  build: safe("npm run build >/dev/null 2>&1 && echo PASS"),
  verify: safe("npm run verify:all >/dev/null 2>&1 && echo PASS"),
  duplicateAudit: safe("npm run audit:duplicates >/dev/null 2>&1 && echo PASS"),
  routeScan: safe("npm run scan:routes >/dev/null 2>&1 && echo PASS"),
  gitBranch: safe("git branch --show-current"),
  gitCommit: safe("git rev-parse --short HEAD"),
  routeCount: safe("grep -R \"path:\" client/src/content/routes | wc -l"),
};

fs.writeFileSync(
  "codex/health/platformSnapshot.json",
  JSON.stringify(snapshot,null,2)
);

console.log("GREEN: platform snapshot generated");
