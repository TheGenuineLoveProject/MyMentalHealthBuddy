import fs from "fs";
import path from "path";

const ROOT = "client/src";
const forbidden = [
  "The Genuine Love Project",
  "Live in Genuine Love",
  "#6D9B8D",
  "#A4C3B2",
  "#EAC3B5",
  "#EAC33B",
];

function walk(dir, out = []) {
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|jsx|css|html)$/.test(p)) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
let bad = 0;

for (const f of files) {
  const txt = fs.readFileSync(f, "utf8");
  for (const key of forbidden) {
    if (txt.includes(key)) {
      console.log(`❌ Hardcoded brand found in ${f}: "${key}"`);
      bad++;
    }
  }
}

if (bad) process.exit(1);
console.log("✅ Brand guard passed (no hardcoded brand strings/colors in client/src)");