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
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: true,
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
      console.error("[ReplitAuth] Failed to send welcome email:", err);
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
        console.error("[ReplitAuth] Callback error:", err);
        return res.redirect("/api/login");
      }
      if (!user) {
        console.log("[ReplitAuth] No user returned from authentication");
        return res.redirect("/api/login");
      }
      
      console.log("[ReplitAuth] User claims:", user.claims?.sub, user.claims?.email);
      
      req.logIn(user, { session: true }, (loginErr) => {
        if (loginErr) {
          console.error("[ReplitAuth] Login error:", loginErr);
          return res.redirect("/api/login");
        }
        
        // Store user data directly in session as backup
        req.session.userId = user.claims?.sub;
        req.session.userEmail = user.claims?.email;
        req.session.userData = user;
        
        console.log("[ReplitAuth] Session ID:", req.session?.id);
        console.log("[ReplitAuth] req.isAuthenticated():", req.isAuthenticated());
        
        // Force session regeneration and save
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("[ReplitAuth] Session save error:", saveErr);
            return res.redirect("/api/login");
          }
          console.log("[ReplitAuth] User authenticated successfully:", user.claims?.sub);
          return res.redirect("/dashboard");
        });
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
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
    console.error("[ReplitAuth] Token refresh failed:", error.message);
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
    console.log("[ReplitAuth] Restored user from session backup:", user.claims?.sub);
  }

  if (!user?.expires_at) {
    console.log("[ReplitAuth] isAuthenticated failed - no user or expires_at");
    console.log("[ReplitAuth] req.isAuthenticated():", req.isAuthenticated());
    console.log("[ReplitAuth] session keys:", Object.keys(req.session || {}));
    return res.status(401).json({ message: "Unauthorized" });
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
