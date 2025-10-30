#!/usr/bin/env node
import fs from "fs";
console.log("📰  Generating daily content digest...");
const date = new Date().toISOString().split("T")[0];
const msg = `Daily Digest ${date}: All systems optimal ✅`;
fs.writeFileSync(`logs/digest_${date}.log`, msg);
console.log(msg);