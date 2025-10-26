import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(compression());
app.use(helmet());
app.get("/", (_req, res) => res.send("✅ MyMentalHealthBuddy backend running perfectly!"));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
