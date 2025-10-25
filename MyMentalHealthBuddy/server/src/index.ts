import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import { health } from "./health.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true
  })
);
app.use(compression());
app.use(express.json());

app.get("/healthz", (_req, res) => res.json(health()));

app.get("/api/status", (_req, res) =>
  res.json({ ok: true, message: "Backend reachable" })
);

app.listen(PORT, () => {
  console.log(JSON.stringify({ msg: "Server ready", port: PORT }));
});