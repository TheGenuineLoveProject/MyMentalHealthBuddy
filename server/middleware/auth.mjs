// ---- AUTH MIDDLEWARE (REPLIT-SAFE) ----
import jwt from "jsonwebtoken";

export default function authGuard(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header)
      return res.status(401).json({ error: "Missing token" });

    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default-secret"
    );

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}