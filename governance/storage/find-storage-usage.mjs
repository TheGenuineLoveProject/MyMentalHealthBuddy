import fs from "fs";
import path from "path";

const ROOT = "./client/src";

const matches = [];

function walk(dir) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      if (
        item === "node_modules" ||
        item === "dist" ||
        item === ".git"
      ) {
        continue;
      }

      walk(full);
      continue;
    }

    if (!/\.(ts|tsx|js|jsx)$/.test(item)) {
      continue;
    }

    const content = fs.readFileSync(full, "utf8");

    const lines = content.split("\n");

    lines.forEach((line, index) => {
      if (line.includes("localStorage")) {
        matches.push({
          file: full,
          line: index + 1,
          text: line.trim(),
        });
      }
    });
  }
}

walk(ROOT);

const grouped = {};

for (const entry of matches) {
  if (!grouped[entry.file]) {
    grouped[entry.file] = [];
  }

  grouped[entry.file].push(entry);
}

console.log("");
console.log("==== STORAGE USAGE REPORT ====");
console.log("");

Object.keys(grouped)
  .sort()
  .forEach((file) => {
    console.log(file);

    grouped[file].forEach((entry) => {
      console.log(`  L${entry.line}: ${entry.text}`);
    });

    console.log("");
  });

console.log(`TOTAL_MATCHES=${matches.length}`);
console.log(`TOTAL_FILES=${Object.keys(grouped).length}`);
