import fs from "fs";
import path from "path";

const routeDir = "client/src/content/routes";
const mainFile = "client/src/content/routes.js";

const files = [
  mainFile,
  ...fs.readdirSync(routeDir)
    .filter(f => f.endsWith(".js"))
    .map(f => path.join(routeDir, f))
];

const paths = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(/path:\s*['"`]([^'"`]+)['"`]/g)) {
    paths.push(m[1]);
  }
}

const dupes = paths.filter((p, i) => paths.indexOf(p) !== i);

console.log("\n===== ROUTE AUDIT =====");
console.log("Files scanned:", files.length);
console.log("Total Routes:", paths.length);

if (dupes.length) {
  console.log("DUPLICATES:");
  [...new Set(dupes)].forEach(d => console.log("-", d));
  process.exit(1);
}

console.log("No duplicate routes.");

const required = ["/", "/about", "/blog", "/chat", "/journal", "/crisis", "/tools", "/pricing"];

for (const p of required) {
  console.log(paths.includes(p) ? "PASS" : "FAIL", p);
}

console.log("\nGREEN: route audit complete");
