"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAnalytics = registerAnalytics;
/**
 * Lightweight, safe Analytics endpoints.
 * Replace in the future with DB-backed snapshots (analyticsSnapshots table).
 */
function registerAnalytics(app) {
    // GET current snapshot(s)
    app.get("/api/analytics/snapshots", async (_req, res) => {
        try {
            const now = new Date();
            // Stub data; wire to DB when ready
            const payload = [{
                    id: `snap_${now.getTime()}`,
                    createdAt: now.toISOString(),
                    dau: 0,
                    wau: 0,
                    mau: 0,
                    engagementScore: 0
                }];
            res.json(payload);
        }
        catch (err) {
            console.error("analytics/snapshots error:", err);
            res.status(500).json({ error: "Failed to load analytics" });
        }
    });
    // POST create a snapshot (stub)
    app.post("/api/analytics/snapshots", async (_req, res) => {
        res.status(201).json({ ok: true });
    });
}
