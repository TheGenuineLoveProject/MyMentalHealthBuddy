import jwt from "jsonwebtoken";
import crypto from "crypto";

export function requireEnv(name) {
  if (!process.env[name]) throw new Error(`Missing env: ${name}`);
  return process.env[name];
}

export function signAccessToken(payload) {
  const secret = requireEnv("JWT_SECRET");
  return jwt.sign(payload, secret, { expiresIn: "15m" });
}

export function signRefreshToken(payload) {
  const secret = requireEnv("JWT_REFRESH_SECRET");
  return jwt.sign(payload, secret, { expiresIn: "30d" });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, requireEnv("JWT_SECRET"));
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, requireEnv("JWT_REFRESH_SECRET"));
}

export function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}