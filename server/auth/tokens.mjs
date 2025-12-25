import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const ACCESS_TTL = "15m";
const REFRESH_DAYS = 30;

function mustEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function makeRefreshToken() {
  return crypto.randomBytes(48).toString("base64url");
}

export function refreshExpiryDate() {
  return new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000);
}

export function signAccessToken(payload) {
  return jwt.sign(payload, mustEnv("JWT_SECRET"), { expiresIn: ACCESS_TTL });
}