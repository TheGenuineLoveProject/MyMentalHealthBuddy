// server/auth/passport.ts
import bcrypt from "bcryptjs";
import { Request } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    async (req: Request, username: string, password: string, done: any) => {
      try {
        // Get database from app locals (set in server/index.ts)
        const db = req.app.locals.db;

        // If database is available, use it for authentication
        if (db) {
          const { drizzle } = await import("drizzle-orm/postgres-js");
          const { users } = await import("../../shared/schema");
          const { eq } = await import("drizzle-orm");

          const user = await db
            .select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1);

          if (!user || !user.length) {
            return done(null, false, { message: "Incorrect username." });
          }

          const isValidPassword = await bcrypt.compare(
            password,
            user[0].password
          );
          if (!isValidPassword) {
            return done(null, false, { message: "Incorrect password." });
          }

          return done(null, user[0]);
        } else {
          // Fallback to in-memory authentication for development
          // Default test user
          if (username === "admin" && password === "admin123") {
            return done(null, {
              id: "1",
              username: "admin",
              email: "admin@example.com"
            });
          }
          return done(null, false, { message: "Invalid credentials." });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (req: any, id: any, done: any) => {
  try {
    // Get database from app locals
    const db = req.app?.locals?.db;

    if (db) {
      const { users } = await import("../../shared/schema");
      const { eq } = await import("drizzle-orm");

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      if (user && user.length) {
        done(null, user[0]);
      } else {
        done(null, false);
      }
    } else {
      // Fallback to in-memory user for development
      if (id === "1") {
        done(null, { id: "1", username: "admin", email: "admin@example.com" });
      } else {
        done(null, false);
      }
    }
  } catch (err) {
    done(err);
  }
});

export default passport;
