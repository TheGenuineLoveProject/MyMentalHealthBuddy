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

const PORT = Number(process.env.PORT ?? 5000);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});