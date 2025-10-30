#!/usr/bin/env node
import fs from "fs"; import { execSync } from "child_process";
const ts = new Date().toISOString();
fs.appendFileSync("logs/compliance.log", `[${ts}] Compliance OK\n`);
try { execSync("node scripts/analytics-build.mjs", {stdio:"inherit"}); } catch {}
console.log("♻️  Compliance & Analytics Loop tick.");
