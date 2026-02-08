import jwt from "jsonwebtoken";
import { logger } from "./logger.mjs";

const isProduction = process.env.NODE_ENV === "production";

function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }
  if (isProduction) {
    logger.error("CRITICAL: JWT_SECRET must be set in production!");
    process.exit(1);
  }
  return "dev-jwt-secret-genuine-love-project-2024";
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