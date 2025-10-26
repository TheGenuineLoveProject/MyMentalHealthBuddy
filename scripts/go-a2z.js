import { execSync } from "child_process";
const feature = process.argv[2] || "Auth+Onboarding";
console.log(`🚀 Running GO-A2Z for feature: ${feature}`);
execSync(`echo "GO-A2Z Feature: ${feature}"`, {stdio:"inherit"});
