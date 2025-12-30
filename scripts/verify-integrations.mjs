#!/usr/bin/env node
import { config } from "dotenv";
config();

const CHECKS = [];
const ERRORS = [];

function logCheck(name, status, message = "") {
  const icon = status ? "✓" : "✗";
  const color = status ? "\x1b[32m" : "\x1b[31m";
  console.log(`${color}${icon}\x1b[0m ${name}${message ? `: ${message}` : ""}`);
  CHECKS.push({ name, status, message });
  if (!status) ERRORS.push(name);
}

async function checkDatabaseConnection() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    logCheck("Database URL", false, "DATABASE_URL not set");
    return;
  }
  try {
    const { default: pg } = await import("pg");
    const pool = new pg.Pool({ connectionString: dbUrl, connectionTimeoutMillis: 5000 });
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    await pool.end();
    logCheck("Database Connection", true, "PostgreSQL connected");
  } catch (err) {
    logCheck("Database Connection", false, err.message);
  }
}

function checkOpenAIKey() {
  const key = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  if (key && key.startsWith("sk-")) {
    logCheck("OpenAI API Key", true, "Key present and valid format");
  } else if (key) {
    logCheck("OpenAI API Key", true, "Key present (custom format)");
  } else {
    logCheck("OpenAI API Key", false, "No OpenAI API key found");
  }
}

function checkStripeKeys() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (secretKey && secretKey.startsWith("sk_")) {
    logCheck("Stripe Secret Key", true, "Key present and valid format");
  } else if (secretKey) {
    logCheck("Stripe Secret Key", true, "Key present");
  } else {
    logCheck("Stripe Secret Key", false, "Not configured");
  }
  
  if (webhookSecret && webhookSecret.startsWith("whsec_")) {
    logCheck("Stripe Webhook Secret", true, "Present and valid format");
  } else if (webhookSecret) {
    logCheck("Stripe Webhook Secret", true, "Present");
  } else {
    logCheck("Stripe Webhook Secret", false, "Not configured");
  }
}

function checkJWTSecrets() {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefresh = process.env.JWT_REFRESH_SECRET;
  
  logCheck("JWT_SECRET", !!jwtSecret, jwtSecret ? "Configured" : "Missing");
  logCheck("JWT_REFRESH_SECRET", !!jwtRefresh, jwtRefresh ? "Configured" : "Missing");
}

async function checkHealthEndpoint() {
  try {
    const port = process.env.PORT || 5000;
    const response = await fetch(`http://localhost:${port}/api/health-check`);
    const data = await response.json();
    logCheck("Health Endpoint", data.ok === true, `Status: ${JSON.stringify(data)}`);
  } catch (err) {
    logCheck("Health Endpoint", false, `Server may not be running: ${err.message}`);
  }
}

function checkRequiredEnvVars() {
  const required = ["NODE_ENV"];
  const optional = ["SESSION_SECRET", "SENTRY_DSN"];
  
  required.forEach(key => {
    logCheck(`Env: ${key}`, !!process.env[key], process.env[key] || "Missing");
  });
  
  optional.forEach(key => {
    if (process.env[key]) {
      logCheck(`Env: ${key}`, true, "Configured");
    }
  });
}

async function main() {
  console.log("\n========================================");
  console.log("  TGLP Integration Verification");
  console.log("========================================\n");
  
  console.log("📋 Environment Variables:");
  checkRequiredEnvVars();
  checkJWTSecrets();
  
  console.log("\n🔐 External Services:");
  checkOpenAIKey();
  checkStripeKeys();
  
  console.log("\n💾 Database:");
  await checkDatabaseConnection();
  
  console.log("\n🌐 Health Check:");
  await checkHealthEndpoint();
  
  console.log("\n========================================");
  if (ERRORS.length === 0) {
    console.log("\x1b[32m✓ All checks passed!\x1b[0m");
    process.exit(0);
  } else {
    console.log(`\x1b[31m✗ ${ERRORS.length} check(s) failed:\x1b[0m`);
    ERRORS.forEach(e => console.log(`  - ${e}`));
    process.exit(1);
  }
}

main();
