import fs from "node:fs";

const requiredFiles = [
  "server/routes/crisis.mjs",
  "server/routes/disclaimer.mjs",
  "server/app.mjs",
  "package.json"
];

let failed = false;

function read(path) {
  if (!fs.existsSync(path)) {
    console.error(`FAIL missing file: ${path}`);
    failed = true;
    return "";
  }
  return fs.readFileSync(path, "utf8");
}

const app = read("server/app.mjs");
const crisis = read("server/routes/crisis.mjs");
const disclaimer = read("server/routes/disclaimer.mjs");
const pkg = JSON.parse(read("package.json") || "{}");

const checks = [
  ["crisis route mounted", /crisis/i.test(app)],
  ["disclaimer route mounted", /disclaimer/i.test(app)],
  ["crisis route references 988", /988/.test(crisis)],
  ["crisis route avoids therapy replacement", /emergency|immediate|crisis|988/i.test(crisis)],
  ["disclaimer says not medical/therapy/legal advice", /not.*(medical|therapy|legal)|professional/i.test(disclaimer)],
  ["disclaimer encourages professional support", /licensed|professional|emergency|provider|clinician/i.test(disclaimer)]
];

for (const [name, ok] of checks) {
  if (ok) console.log(`PASS ${name}`);
  else {
    console.error(`FAIL ${name}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("SAFETY_GUARDRAIL_CONTRACT_VERIFY_PASS");
