import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

  export function applyHardening(app) {
    app.disable("x-powered-by");
  }
const origin = process.env.CORS_ORIGIN || "http://localhost:3000";
  const isProd = process.env.NODE_ENV === "production";

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

  // basic rate limits
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