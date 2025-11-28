import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "development-secret";

export function signToken(payload, expires = "7d") {
  return jwt.sign(payload, SECRET, { expiresIn: expires });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}