/**
 * Replit Auth OIDC Integration
 * Integration: blueprint:javascript_log_in_with_replit
 */

import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage.mjs";
import { sendWelcomeEmail } from "../../services/email.mjs";
import { logger } from "../../utils/logger.mjs";
import { isSameOriginAuthRequest } from "../../security/csrf.mjs";
import {
  getPostgresConnectionString,
  getPostgresSslConfig,
} from "../../db/sslConfig.mjs";

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conObject: {
      connectionString: getPostgresConnectionString(process.env.DATABASE_URL),
      ssl: getPostgresSslConfig(),
    },
    createTableIfMissing: false,
    ttl: Math.ceil(sessionTtl / 1000),
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims) {
  const user = await authStorage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
  
  if (user?.isNewUser && claims["email"]) {
    const fullName = claims["first_name"] 
      ? `${claims["first_name"]}${claims["last_name"] ? ' ' + claims["last_name"] : ''}`
      : null;
    sendWelcomeEmail(claims["email"], fullName).catch(err => {
      logger.error("[ReplitAuth] Failed to send welcome email");
    });
  }
}

export async function setupAuth(app) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  const registeredStrategies = new Set();

  const ensureStrategy = (domain) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };

  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, (err, user, info) => {
      if (err) {
        logger.error("[ReplitAuth] Callback error");
        return res.redirect("/api/login");
      }
      if (!user) {
        logger.warn("[ReplitAuth] No user returned from authentication");
        return res.redirect("/api/login");
      }
      
      logger.info("[ReplitAuth] User claims received");
      
      req.logIn(user, { session: true }, (loginErr) => {
        if (loginErr) {
          logger.error("[ReplitAuth] Login error");
          return res.redirect("/api/login");
        }
        
        req.session.userId = user.claims?.sub;
        req.session.userEmail = user.claims?.email;
        req.session.userData = user;
        
        logger.debug("[ReplitAuth] Session established");
        
        req.session.save((saveErr) => {
          if (saveErr) {
            logger.error("[ReplitAuth] Session save error");
            return res.redirect("/api/login");
          }
          logger.info("[ReplitAuth] User authenticated successfully");
          return res.redirect("/dashboard");
        });
      });
    })(req, res, next);
  });

  const logoutHeaders = (res) => {
    res.set("Cache-Control", "no-store");
    // No scripts or remote assets. The fixed form posts here; the identity provider
    // may then redirect across origins, so do not constrain form-action to self.
    res.set("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'self' https://replit.com https://*.replit.com");
    res.set("Referrer-Policy", "same-origin");
  };
  const logoutPage = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sign out | MyMentalHealthBuddy</title>
<style>body{margin:0;padding:2rem;background:#faf9f7;color:#253b3b;font:1.125rem/1.6 system-ui,sans-serif}main{max-width:34rem;margin:8vh auto;padding:2rem;background:white;border:1px solid #ccd8d3;border-radius:1rem}h1{line-height:1.2}button{font:inherit;background:#2f5d5d;color:white;border:0;border-radius:.5rem;padding:.75rem 1.5rem;cursor:pointer}a{color:#2f5d5d}button:focus-visible,a:focus-visible{outline:3px solid #8b4700;outline-offset:4px}</style>
</head><body><main><p>MyMentalHealthBuddy</p><h1>Ready to sign out?</h1>
<p>Confirm to finish signing out. Your saved work will stay in your account.</p>
<form method="post" action="/api/logout"><button type="submit">Sign out</button></form>
<p><a href="/dashboard">Return to dashboard</a></p></main></body></html>`;
  const logoutErrorPage = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Sign-out incomplete | MyMentalHealthBuddy</title></head><body><main><h1>Sign-out could not be completed</h1><p>Please try again. We could not confirm that your session was closed.</p><a href="/api/logout">Try signing out again</a></main></body></html>`;

  // Preserve the existing client navigation without changing session state on GET/HEAD.
  app.get("/api/logout", (_req, res) => {
    logoutHeaders(res);
    return res.type("html").send(logoutPage);
  });

  app.post("/api/logout", (req, res) => {
    logoutHeaders(res);
    // This route is registered before global CSRF middleware: guard it here.
    if (!isSameOriginAuthRequest(req)) {
      return res.status(403).type("html").send(logoutErrorPage);
    }
    const failLogout = () => {
      logger.warn("[ReplitAuth] Logout could not be completed");
      return res.status(500).type("html").send(logoutErrorPage);
    };
    let endSessionUrl;
    try {
      // Prepare the existing provider redirect before changing the session.
      endSessionUrl = client.buildEndSessionUrl(config, {
        client_id: process.env.REPL_ID,
        post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
      }).href;
      req.logout((logoutErr) => {
        if (logoutErr) return failLogout();
        try {
          if (!req.session || typeof req.session.destroy !== "function") return failLogout();
          req.session.destroy((destroyErr) => {
            if (destroyErr) return failLogout();
            try {
              res.clearCookie("connect.sid", {
                path: "/", httpOnly: true, secure: true, sameSite: "none",
              });
              return res.redirect(303, endSessionUrl);
            } catch {
              return failLogout();
            }
          });
        } catch {
          return failLogout();
        }
      });
    } catch {
      return failLogout();
    }
  });
}

export async function refreshUserToken(user, req) {
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    return false;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    if (req.session) {
      req.session.userData = user;
      req.session.save(() => {});
    }
    return true;
  } catch (error) {
    logger.error("[ReplitAuth] Token refresh failed");
    return false;
  }
}

export const isAuthenticated = async (req, res, next) => {
  // Check for passport user or backup userData in session
  let user = req.user;
  
  // Fallback: check for backup userData stored directly in session
  if (!user && req.session?.userData) {
    user = req.session.userData;
    req.user = user; // Restore to req.user for downstream use
    logger.debug("[ReplitAuth] Restored user from session backup");
  }

  if (!user?.expires_at) {
    logger.debug("[ReplitAuth] isAuthenticated failed");
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Resolve Replit ID → internal DB UUID (cached in session)
  const replitId = String(user.claims?.sub || "");
  if (replitId && !req.dbUserId) {
    if (req.session?.dbUserId) {
      req.dbUserId = req.session.dbUserId;
    } else {
      try {
        const dbUser = await authStorage.getUserByReplitId(replitId);
        if (dbUser) {
          req.dbUserId = dbUser.id;
          req.session.dbUserId = dbUser.id;
        }
      } catch (e) {
        logger.error("[ReplitAuth] Failed to resolve DB user");
      }
    }
  }

  if (!req.dbUserId) {
    logger.error("[ReplitAuth] Could not resolve DB user");
    return res.status(401).json({ message: "User account not found" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
