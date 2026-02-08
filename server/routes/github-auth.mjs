import express from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../db/client.mjs";
import { users } from "../../shared/schema.mjs";
import { logAudit, getClientIp, AUDIT_ACTIONS } from "../services/auditLog.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const isProduction = process.env.NODE_ENV === "production";

const ACCESS_SECRET = process.env.JWT_SECRET || (isProduction ? null : "dev_secret_not_for_production");
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || (isProduction ? null : "dev_refresh_secret_not_for_production");

function getCallbackURL() {
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/github/callback`;
  }
  if (process.env.REPLIT_DOMAINS) {
    const domain = process.env.REPLIT_DOMAINS.split(",")[0];
    return `https://${domain}/api/auth/github/callback`;
  }
  return `http://localhost:5000/api/auth/github/callback`;
}

if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: getCallbackURL(),
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;
          const name = profile.displayName || profile.username;
          const githubId = profile.id;

          let user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (!user) {
            const newUser = {
              id: crypto.randomUUID(),
              email,
              name,
              githubId,
              role: "user",
              subscriptionStatus: "free",
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            await db.insert(users).values(newUser);
            user = newUser;
          } else if (!user.githubId) {
            await db
              .update(users)
              .set({ githubId, updatedAt: new Date() })
              .where(eq(users.id, user.id));
            user.githubId = githubId;
          }

          return done(null, user);
        } catch (error) {
          logger.error("GitHub auth error", { error: error?.message || error });
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // Handle case where id might be an object (legacy sessions)
      const userId = typeof id === 'object' && id !== null ? id.id : id;
      if (!userId || typeof userId !== 'string') {
        return done(null, null);
      }
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

function signAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || "user",
      subscription_status: user.subscriptionStatus || "free",
    },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );
}

function signRefreshToken(user) {
  return jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: "7d" });
}

function setRefreshCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

router.get("/github", (req, res, next) => {
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return res.status(503).json({ 
      message: "GitHub authentication is not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET." 
    });
  }
  passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
});

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/login?error=github_failed" }),
  async (req, res) => {
    try {
      const user = req.user;

      await logAudit({
        userId: user.id,
        action: AUDIT_ACTIONS.LOGIN_SUCCESS,
        metadata: { provider: "github" },
        resourceType: "user",
        resourceId: user.id,
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
      });

      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);

      setRefreshCookie(res, refreshToken);

      res.redirect(`/login/callback?token=${encodeURIComponent(accessToken)}`);
    } catch (error) {
      logger.error("GitHub callback error", { error: error?.message || error });
      res.redirect("/login?error=github_callback_failed");
    }
  }
);

export default router;
