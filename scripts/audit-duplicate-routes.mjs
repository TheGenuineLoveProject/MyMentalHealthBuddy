import fs from "fs";

const appPath = "client/src/App.jsx";

const src = fs.readFileSync(appPath, "utf8");

const routeRegex = /<Route\s+path="([^"]+)"/g;

const counts = new Map();

let match;

while ((match = routeRegex.exec(src)) !== null) {
  const route = match[1];

  counts.set(route, (counts.get(route) || 0) + 1);
}

const duplicates = [...counts.entries()]
  .filter(([, count]) => count > 1)
  .sort((a, b) => b[1] - a[1]);

console.log("");
console.log("=== Duplicate Route Audit ===");
console.log("");

if (!duplicates.length) {
  console.log("PASS no duplicate routes detected");
  process.exit(0);
}

for (const [route, count] of duplicates) {
  let classification = "REVIEW_REQUIRED";

  if (
    [
      "/about",
      "/features",
      "/healing",
      "/wellbeing",
    ].includes(route)
  ) {
    classification = "SAFE_ALIAS";
  }

  if (
    [
      "/privacy",
      "/therapy",
      "/counseling",
    ].includes(route)
  ) {
    classification = "REVIEW_REQUIRED";
  }

  if (count >= 3) {
    classification = "CRITICAL_CONFLICT";
  }

  console.log(
    `${classification.padEnd(20)} ${route} (${count}x)`
  );
}

console.log("");
console.log(`SUMMARY: ${duplicates.length} duplicate route groups`);
console.log("");
