// scripts/safetyGuard.mjs
export function ensureDevOnly(scriptName = "this script") {
  const env = process.env.NODE_ENV || "development";

  if (env === "production") {
    console.log(`⚠️  ${scriptName} is disabled in production. Exiting safely.`);
    process.exit(0);
  }
}