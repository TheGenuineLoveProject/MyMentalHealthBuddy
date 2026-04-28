// server/biometrics/scheduler.mjs
//
// Opt-in 6-hour polling loop for active biometric connections.
// Disabled by default. Enable with BIOMETRICS_SCHEDULER_ENABLED=true
// (and optional BIOMETRICS_SCHEDULER_INTERVAL_MS for custom cadence).
//
// Per the platform's "no surprise traffic" principle, this never runs
// in tests and never auto-syncs HealthKit/manual sources (those are
// pull-on-write only).

import { getIngestionService } from "./pipeline.mjs";
import { NotConfiguredError } from "./providers.mjs";

const DEFAULT_INTERVAL_MS = 6 * 60 * 60 * 1000;   // 6 hours
const PER_CONNECTION_DELAY_MS = 750;              // gentle pacing

let _timer = null;
let _running = false;

export function startBiometricScheduler({ logger = console } = {}) {
  if (process.env.BIOMETRICS_SCHEDULER_ENABLED !== "true") {
    logger.info?.("[biometrics] scheduler disabled (set BIOMETRICS_SCHEDULER_ENABLED=true to enable)");
    return { started: false, reason: "disabled" };
  }
  if (_timer) return { started: true, alreadyRunning: true };

  const intervalMs = Number(process.env.BIOMETRICS_SCHEDULER_INTERVAL_MS) || DEFAULT_INTERVAL_MS;
  logger.info?.(`[biometrics] scheduler enabled, interval=${intervalMs}ms`);

  const tick = async () => {
    if (_running) return;
    _running = true;
    try {
      const svc = getIngestionService();
      const connections = await svc.listActiveConnections();
      logger.info?.(`[biometrics] scheduler tick: ${connections.length} connections`);
      let totalStored = 0;
      let errors = 0;
      for (const c of connections) {
        try {
          const r = await svc.syncProvider(c);
          totalStored += r.stored;
        } catch (err) {
          errors++;
          if (err instanceof NotConfiguredError) {
            logger.warn?.(`[biometrics] ${c.deviceSource} not configured — skipping`);
          } else {
            logger.warn?.(`[biometrics] sync failed for ${c.deviceSource}/${c.userId}: ${err.message}`);
          }
        }
        await new Promise((r) => setTimeout(r, PER_CONNECTION_DELAY_MS));
      }
      logger.info?.(`[biometrics] scheduler tick complete: stored=${totalStored} errors=${errors}`);
    } catch (err) {
      logger.error?.(`[biometrics] scheduler tick crashed: ${err.message}`);
    } finally {
      _running = false;
    }
  };

  _timer = setInterval(tick, intervalMs);
  if (typeof _timer.unref === "function") _timer.unref();
  // Run a first tick on next macrotask so boot isn't blocked.
  setTimeout(tick, 5000).unref?.();
  return { started: true, intervalMs };
}

export function stopBiometricScheduler() {
  if (_timer) { clearInterval(_timer); _timer = null; }
  return { stopped: true };
}
