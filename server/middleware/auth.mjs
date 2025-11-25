// server/middleware/auth.mjs
import jwt from "jsonwebtoken";

// Strict auth - requires valid token
export function authGuard(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SESSION_SECRET || "dev-secret");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Optional auth - continues even without token
export function optionalAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SESSION_SECRET || "dev-secret");
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }
  
  next();
}