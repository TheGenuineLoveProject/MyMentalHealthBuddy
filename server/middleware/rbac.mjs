const ENGINE_AUDIENCES = {
  healing:  new Set(["anonymous", "subscriber", "user"]),
  business: new Set(["admin", "staff"]),
};

export function audienceOf(req) {
  if (!req.user) return "anonymous";
  if (req.user.role === "admin") return "admin";
  if (req.user.role === "staff") return "staff";
  return "subscriber";
}

export function requireEngineAccess(engine) {
  return (req, res, next) => {
    const audience = audienceOf(req);
    const allowed = ENGINE_AUDIENCES[engine];
    if (!allowed || !allowed.has(audience)) {
      return res.status(403).json({
        error: "rbac_forbidden",
        message: `Audience '${audience}' cannot access engine '${engine}'.`,
      });
    }
    req.engineAudience = audience;
    next();
  };
}

export default requireEngineAccess;
