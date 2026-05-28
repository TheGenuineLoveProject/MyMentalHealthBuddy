import fs from "node:fs";
import path from "node:path";

const ROOTS = ["client/src", "legal", "public"];
const risky = [
  "copied from",
  "all rights reserved",
  "lyrics",
  "Getty Images",
  "Shutterstock",
  "copyrighted",
];

const files = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    const st = fs.statSync(p);
    if (st.isDirectory() && !["node_modules", "dist", ".git"].includes(item)) walk(p);
    else if (st.isFile() && /\.(js|jsx|mjs|ts|tsx|md|html|json)$/i.test(p)) files.push(p);
  }
}
ROOTS.forEach(walk);

let fail = 0;
for (const f of files) {
  const txt = fs.readFileSync(f, "utf8");
  for (const term of risky) {
    if (txt.toLowerCase().includes(term.toLowerCase())) {
      console.log(`WARN copyright-risk "${term}" in ${f}`);
    }
  }
}

console.log("PASS copyright scanner completed");
process.exit(fail);
