import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import { registerRoutes } from "./routes.js";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true, message: "MyMentalHealthBuddy API is running" }));

registerRoutes(app);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
