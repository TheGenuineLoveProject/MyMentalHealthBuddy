import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

export function applyHardening(app) {
  const replitDomain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS?.split(",")[0];
  const origin = process.env.CORS_ORIGIN || (replitDomain ? `https://${replitDomain}` : "http://localhost:3000");
  const isProd = process.env.NODE_ENV === "production";

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  );

  app.use(
    helmet({
      contentSecurityPolicy: isProd ? undefined : false,
    })
  );

  app.use(
    "/api/auth",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 60,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.use(
    "/api",
    rateLimit({
      windowMs: 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
}
