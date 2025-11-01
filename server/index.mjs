import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import analyticsRoutes from "./routes/analytics.mjs";

const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

app.get("/", (req, res) => res.send("✅ MyMentalHealthBuddy API running"));
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
