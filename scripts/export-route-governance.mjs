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
  .sort((a, b) => a[0].localeCompare(b[0]));

const lines = [];

lines.push("# Route Ownership Manifest");
lines.push("");
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push("");

lines.push("| Route | Duplicate Count | Classification |");
lines.push("|---|---|---|");

for (const [route, count] of duplicates) {
  let classification = "REVIEW_REQUIRED";

  if (
    [
      "/about",
      "/features",
      "/healing",
      "/wellbeing"
    ].includes(route)
  ) {
    classification = "SAFE_ALIAS";
  }

  if (count >= 3) {
    classification = "CRITICAL_CONFLICT";
  }

  lines.push(
    `| ${route} | ${count} | ${classification} |`
  );
}

lines.push("");
lines.push("## Governance Notes");
lines.push("");
lines.push("- No runtime behavior modified");
lines.push("- No route deletion performed");
lines.push("- No wrapper removal performed");
lines.push("- Manifest generated for governance visibility only");
lines.push("- Future cleanup must preserve wrappers and body delegation");

fs.writeFileSync(
  "docs/route-ownership-manifest.md",
  lines.join("\n")
);

console.log("");
console.log("PASS governance manifest exported");
console.log(
  "docs/route-ownership-manifest.md"
);
console.log("");
