/**
 * requireAdult.mjs
 * 
 * Server middleware to verify 18+ age confirmation for wellness endpoints.
 * Checks for:
 *   1. Header "x-age-confirmed: true"
 *   2. Session flag req.session.ageConfirmed === true
 * 
 * Returns 403 with safe message if neither is present.
 * Educational wellness tools only - not medical/mental health treatment.
 */

export function requireAdult(req, res, next) {
  const headerConfirmed = req.headers["x-age-confirmed"] === "true";
  const sessionConfirmed = req.session?.ageConfirmed === true;

  if (headerConfirmed || sessionConfirmed) {
    return next();
  }

  return res.status(403).json({
    error: "Age verification required",
    message: "This content requires confirmation that you are 18 years or older.",
    educationalNotice: "These are educational wellness tools designed for self-guided personal growth. " +
                       "This is not medical advice, mental health treatment, or a substitute for professional care. " +
                       "If you are in crisis, please visit our crisis resources page immediately.",
    action: "Please confirm your age on the wellness page to continue.",
    disclaimerUrl: "/legal/disclaimer",
    crisisUrl: "/crisis",
    code: "AGE_CONFIRMATION_REQUIRED"
  });
}

export function setAgeConfirmed(req) {
  if (req.session) {
    req.session.ageConfirmed = true;
  }
}

export function clearAgeConfirmed(req) {
  if (req.session) {
    req.session.ageConfirmed = false;
  }
}
