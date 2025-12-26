import crypto from "node:crypto";
import { signAccessToken, verifyToken } from "../utils/jwt.mjs";

const REFRESH_DAYS = 30;

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function makeRefreshToken() {
  return crypto.randomBytes(48).toString("base64url");
}

export const newRefreshToken = makeRefreshToken;

export function refreshExpiryDate() {
  return new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000);
}

export { signAccessToken, verifyToken };
