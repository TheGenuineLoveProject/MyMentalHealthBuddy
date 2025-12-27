export function requireAuth(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required"
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      error: "Auth middleware failure",
      details: err?.message
    });
  }
}