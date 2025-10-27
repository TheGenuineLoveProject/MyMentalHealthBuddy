import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import expressStaticGzip from "express-static-gzip";
import dotenv from "dotenv";
import { registerRoutes } from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const isProduction = process.env.NODE_ENV === "production";

app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true, message: "MyMentalHealthBuddy API is running" }));

registerRoutes(app);

if (isProduction) {
  const clientDistPath = path.join(__dirname, "../../../../../client/dist");
  
  app.use(
    expressStaticGzip(clientDistPath, {
      enableBrotli: true,
      orderPreference: ['br', 'gz'],
      serveStatic: {
        maxAge: '1y',
        immutable: true,
        etag: true,
        lastModified: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
          } else if (filePath.match(/\.(js|css|woff2?|ttf|eot)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          } else if (filePath.match(/\.(jpg|jpeg|png|gif|svg|ico|webp)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=2592000');
          }
        }
      }
    })
  );
  
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      res.status(404).json({ error: "API endpoint not found" });
    } else {
      res.sendFile(path.join(clientDistPath, "index.html"));
    }
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT} (${isProduction ? "production" : "development"} mode)`);
});
