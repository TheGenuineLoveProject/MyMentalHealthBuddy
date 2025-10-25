import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import { exampleSchema } from "../../../packages/shared/schema.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true }));
app.get("/schema", (_, res) => res.json(exampleSchema));

const DEFAULT_PORT = 5000;
const PORT = process.env.PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
}).on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    const alt = Number(PORT) + 1;
    console.log(`⚠️  Port ${PORT} busy — retrying on ${alt}`);
    app.listen(alt, () => console.log(`✅ Server now on port ${alt}`));
  } else {
    console.error("❌ Server error:", err);
  }
});
