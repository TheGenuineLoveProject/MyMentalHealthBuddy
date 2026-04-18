import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

function getBearerToken(req) {
  const auth = req.headers?.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  return auth.slice("Bearer ".length).trim();
}

export function signUserToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || "user"
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function optionalAuth(req, _res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) return next();
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.dbUserId = decoded.id;
    return next();
  } catch {
    return next();
  }
}

export function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.dbUserId = decoded.id;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  return next();
}
