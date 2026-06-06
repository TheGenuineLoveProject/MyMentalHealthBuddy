import fs from "fs";

const failures = [];

function read(path) {
  if (!fs.existsSync(path)) {
    failures.push(`MISSING_FILE ${path}`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
}

const app = read("client/src/App.jsx");
const layer = read("client/src/components/coherence/ContentCoherenceLayer.jsx");
const css = read("client/src/components/coherence/ContentCoherenceLayer.css");

const requiredLayerMarkers = [
  "data-content-coherence-layer=\"client-clarity\"",
  "Plain language page guide",
  "Educational support only",
  "Not diagnosis",
  "not a replacement for licensed care",
  "/pricing",
  "/premium",
  "/account/billing",
  "/account/subscription",
  "Purpose",
  "Best next step",
];

const requiredCssMarkers = [
  ".mmhb-content-coherence-layer",
  ".mmhb-content-coherence-card",
  ".mmhb-content-coherence-primary",
  ".mmhb-content-coherence-secondary",
  "--mmhb-coherence-sage",
  "--mmhb-coherence-gold",
  "prefers-reduced-motion",
];

if (!app.includes("ContentCoherenceLayer")) failures.push("CONTENT_COHERENCE_LAYER_NOT_IMPORTED_OR_MOUNTED");
if (!app.includes("<ContentCoherenceLayer")) failures.push("CONTENT_COHERENCE_LAYER_NOT_RENDERED");

for (const marker of requiredLayerMarkers) {
  if (!layer.includes(marker)) failures.push(`CONTENT_MARKER_MISSING ${marker}`);
}

for (const marker of requiredCssMarkers) {
  if (!css.includes(marker)) failures.push(`CSS_MARKER_MISSING ${marker}`);
}

const bannedClaims = [
  /guaranteed healing/i,
  /guaranteed cure/i,
  /diagnose you/i,
  /replace therapy/i,
  /replace emergency/i,
  /million dollars/i,
];

for (const claim of bannedClaims) {
  if (claim.test(layer)) failures.push(`BANNED_CLAIM_FOUND ${claim}`);
}

if (failures.length) {
  console.error("CONTENT_COHERENCE_GATE_FAIL");
  for (const failure of failures) console.error(failure);
  process.exit(1);
}

console.log("CONTENT_COHERENCE_GATE_PASS");
