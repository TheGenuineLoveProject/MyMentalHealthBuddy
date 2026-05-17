import jwt from "jsonwebtoken";
import { logger } from "./logger.mjs";

const isProduction = process.env.NODE_ENV === "production";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length > 0) {
    return secret;
  }
  if (isProduction) {
    logger.error("CRITICAL: JWT_SECRET must be set in production!");
    process.exit(1);
  }
  console.warn(
    "[utils/jwt] WARNING: JWT_SECRET is not set. Using insecure development fallback. DO NOT USE IN PRODUCTION."
  );
  return "dev_insecure_secret_change_me";
}

const JWT_SECRET = getJwtSecret();
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "30d";

export function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Aliases for backward compatibility
export { verifyToken as verifyAccessToken };