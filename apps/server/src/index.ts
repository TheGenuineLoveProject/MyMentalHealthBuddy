import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.get("/health", (_, res) => res.json({ ok: true }));

const start = (port = 5000) => {
  const server = app.listen(port, () => console.log(`✅ Server running on ${port}`));
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`⚠️ Port ${port} busy → retrying ${port + 1}`);
      start(port + 1);
    } else {
      console.error("❌ Server error:", err);
    }
  });
};
start();
