import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
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
  app.use(express.static(clientDistPath, {
  maxAge: isProduction ? '1y' : 0,
  immutable: isProduction,
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    } else if (path.match(/\.(js|css|woff2?|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (path.match(/\.(jpg|jpeg|png|gif|svg|ico|webp)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    }
  }
}));
  
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
