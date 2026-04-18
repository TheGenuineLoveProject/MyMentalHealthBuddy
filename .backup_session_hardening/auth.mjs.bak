import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET is required and must be at least 32 characters. Refusing to boot."
  );
}

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

export function requireStaff(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const role = req.user.role;
  if (role !== "admin" && role !== "staff") {
    return res.status(403).json({ error: "Staff access required" });
  }
  return next();
}

// Backward-compat alias used by older routes (business, therapy, reflection, gamification, etc.)
export const authGuard = requireAuth;


// ===== STRICT_JWT_CHECK =====
export function requireAuthStrict(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
