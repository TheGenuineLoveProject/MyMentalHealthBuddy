import fs from "node:fs";

const checks = [];
const add = (name, pass, detail = "") => checks.push({ name, pass, detail });

const tsxPath = "client/src/components/lumi/LumiPresenceLayer.tsx";
const cssPath = "client/src/components/lumi/LumiPresenceLayer.css";
const mainPath = "client/src/main.jsx";

const tsx = fs.readFileSync(tsxPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const main = fs.readFileSync(mainPath, "utf8");

add("main imports LumiPresenceLayer", /import\s+LumiPresenceLayer/.test(main));
add("main renders LumiPresenceLayer", /<LumiPresenceLayer\s*\/?>/.test(main));
add("lumi presence test hook exists", /data-lumi-presence="kinetic"/.test(tsx));
add("lumi avatar alive hook exists", /data-lumi-avatar="alive"/.test(tsx));

for (const cls of [
  "lumi-eye",
  "lumi-pupil",
  "lumi-mouth",
  "lumi-arm",
  "lumi-leg",
  "lumi-belly",
  "lumi-heart-core",
  "lumi-emotion-orb",
  "lumi-halo",
  "lumi-aura"
]) {
  add(`tsx contains ${cls}`, tsx.includes(cls));
}

for (const keyframe of [
  "lumiWholeFloat",
  "lumiWholeSway",
  "lumiBodyBreathe",
  "lumiBellyBreathe",
  "lumiFaceMicroTilt",
  "lumiBlink",
  "lumiPupilTrack",
  "lumiMouthExpression",
  "lumiLeftArmWave",
  "lumiRightArmWave",
  "lumiLeftLegWiggle",
  "lumiRightLegWiggle",
  "lumiHaloFloat",
  "lumiAuraPulse",
  "lumiSparkDrift"
]) {
  add(`css contains @keyframes ${keyframe}`, css.includes(`@keyframes ${keyframe}`));
}

for (const token of [
  "--lumi-serenity-sage-100",
  "--lumi-serenity-sage-200",
  "--lumi-eternal-cream-100",
  "--lumi-healing-gold-200",
  "--lumi-compassion-rose-100",
  "--lumi-hope-sky-200",
  "--lumi-readable-ink"
]) {
  add(`css token ${token}`, css.includes(token));
}

add("visibility lock exists", css.includes("PHASE 68 : LUMI VISIBILITY LOCK"));
add("z-index lock exists", /z-index:\s*2147483000\s*!important/.test(css));
add("pointer events disabled", /pointer-events:\s*none\s*!important/.test(css));
add("button contrast patch exists", css.includes("--lumi-button-text-on-sage"));
add("mobile scaling exists", /@media\s*\(max-width:\s*760px\)/.test(css));
add("reduced motion support exists", /prefers-reduced-motion:\s*reduce/.test(css));

const failed = checks.filter(c => !c.pass);

for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.name}${check.detail ? ` ${check.detail}` : ""}`);
}

console.log(`SUMMARY passed=${checks.length - failed.length} failed=${failed.length}`);

if (failed.length) process.exit(1);
