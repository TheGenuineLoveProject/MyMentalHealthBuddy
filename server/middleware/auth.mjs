import jwt from "jsonwebtoken";

export default function authGuard(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Not authorized" });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
