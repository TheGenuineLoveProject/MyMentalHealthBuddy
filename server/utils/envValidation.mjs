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
    console.error("=== ENVIRONMENT VALIDATION FAILED ===");
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    if (isProduction) {
      console.error("DEPLOY BLOCKED: Cannot start in production without required secrets.");
      process.exit(1);
    } else {
      console.warn("Warning: Running in development mode with missing variables.");
    }
  }

  const warnings = OPTIONAL_VARS.filter((key) => !process.env[key]);
  if (warnings.length > 0) {
    console.log(`Optional variables not configured: ${warnings.join(", ")}`);
  }

  if (!isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes("dev"))) {
    console.warn("Warning: Using development JWT secret. Do not use in production.");
  }

  console.log(`Environment validation passed for ${env} mode.`);
  return true;
}

export function validateSecretStrength(secret, name) {
  if (!secret) return false;
  if (secret.length < 32) {
    console.warn(`Warning: ${name} should be at least 32 characters for security.`);
    return false;
  }
  return true;
}
