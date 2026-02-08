import { logger } from "./logger.mjs";

const REQUIRED_VARS = {
  production: [
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "DATABASE_URL",
    "SESSION_SECRET",
  ],
  development: [],
};

const OPTIONAL_VARS = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "OPENAI_API_KEY",
  "SENTRY_DSN",
];

export function validateEnv() {
  const env = process.env.NODE_ENV || "development";
  const isProduction = env === "production";
  const required = REQUIRED_VARS[isProduction ? "production" : "development"];
  
  const missing = required.filter((key) => !process.env[key]);
  
  if (missing.length > 0) {
    logger.error("=== ENVIRONMENT VALIDATION FAILED ===");
    logger.error("Missing required environment variables", { missing: missing.join(", ") });
    if (isProduction) {
      logger.error("DEPLOY BLOCKED: Cannot start in production without required secrets.");
      process.exit(1);
    } else {
      logger.warn("Running in development mode with missing variables.");
    }
  }

  const warnings = OPTIONAL_VARS.filter((key) => !process.env[key]);
  if (warnings.length > 0) {
    logger.info("Optional variables not configured", { variables: warnings.join(", ") });
  }

  if (!isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes("dev"))) {
    logger.warn("Using development JWT secret. Do not use in production.");
  }

  logger.info("Environment validation passed", { mode: env });
  return true;
}

export function validateSecretStrength(secret, name) {
  if (!secret) return false;
  if (secret.length < 32) {
    logger.warn(`${name} should be at least 32 characters for security.`);
    return false;
  }
  return true;
}
