app.get('/healthz', (_, res) => res.status(200).json({ status: 'ok', uptime: process.uptime() }));
import aiRouter from "./routes/ai.js";
app.use("/api/ai", aiRouter);