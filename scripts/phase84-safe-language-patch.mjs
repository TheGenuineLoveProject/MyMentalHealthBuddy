import fs from "node:fs";

const riskFile = "diagnostics/phase84/clinical-claim-active-risks.txt";
const outDir = "diagnostics/phase84";
fs.mkdirSync(outDir, { recursive: true });

if (!fs.existsSync(riskFile)) {
  console.log("NO_RISK_FILE_FOUND");
  process.exit(0);
}

const raw = fs.readFileSync(riskFile, "utf8").trim();
if (!raw) {
  console.log("NO_ACTIVE_CLINICAL_CLAIM_RISKS_TO_PATCH");
  fs.writeFileSync(`${outDir}/safe-language-patched-files.txt`, "");
  process.exit(0);
}

const files = [...new Set(raw.split(/\r?\n/).map(line => {
  const m = line.match(/ (client\/src\/[^:]+):\d+:/);
  return m?.[1];
}).filter(Boolean))];

const replacements = [
  [/\bcures\b/g, "supports"],
  [/\bCures\b/g, "Supports"],
  [/\bcure\b/g, "support"],
  [/\bCure\b/g, "Support"],
  [/\bcured\b/g, "supported"],
  [/\bguarantees\b/g, "is designed to support"],
  [/\bGuarantees\b/g, "Is designed to support"],
  [/\bguarantee\b/g, "support intention"],
  [/\bGuarantee\b/g, "Support intention"],
  [/replacement for therapy/gi, "educational wellness support, not a replacement for therapy"],
  [/substitute for therapy/gi, "educational wellness support, not a substitute for therapy"],
  [/replace therapy/gi, "support reflection alongside appropriate professional care"]
];

const patched = [];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  let after = before;
  for (const [from, to] of replacements) after = after.replace(from, to);
  if (after !== before) {
    fs.copyFileSync(file, `${outDir}/${file.replaceAll("/", "__")}.before`);
    fs.writeFileSync(file, after);
    patched.push(file);
  }
}

fs.writeFileSync(`${outDir}/safe-language-patched-files.txt`, patched.join("\n") + (patched.length ? "\n" : ""));
console.log(`PATCHED_FILES=${patched.length}`);
for (const file of patched) console.log(file);
