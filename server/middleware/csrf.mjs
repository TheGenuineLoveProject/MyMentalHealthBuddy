import crypto from "crypto";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";
const TOKEN_LENGTH = 32;

function generateToken() {
  return crypto.randomBytes(TOKEN_LENGTH).toString("hex");
}

export function csrfProtection(options = {}) {
  const {
    cookieName = CSRF_COOKIE_NAME,
    headerName = CSRF_HEADER_NAME,
    ignoreMethods = ["GET", "HEAD", "OPTIONS"],
    cookieOptions = {},
  } = options;

  const isProd = process.env.NODE_ENV === "production";

  return (req, res, next) => {
    if (ignoreMethods.includes(req.method)) {
      if (!req.cookies?.[cookieName]) {
        const token = generateToken();
        res.cookie(cookieName, token, {
          httpOnly: false,
          secure: isProd,
          sameSite: isProd ? "strict" : "lax",
          path: "/",
          maxAge: 24 * 60 * 60 * 1000,
          ...cookieOptions,
        });
      }
      return next();
    }

    const cookieToken = req.cookies?.[cookieName];
    const headerToken = req.headers[headerName.toLowerCase()];

    if (!cookieToken || !headerToken) {
      return res.status(403).json({
        error: "CSRF validation failed",
        message: "Missing CSRF token",
      });
    }

    if (!crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken))) {
      return res.status(403).json({
        error: "CSRF validation failed",
        message: "Invalid CSRF token",
      });
    }

    next();
  };
}

export function refreshCsrfToken(req, res) {
  const token = generateToken();
  const isProd = process.env.NODE_ENV === "production";
  
  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return token;
}
