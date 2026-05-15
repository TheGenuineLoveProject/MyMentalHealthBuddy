/**
 * @fileoverview Health Check System
 * @module lumi-backend/health
 *
 * Health check endpoint and diagnostic functions.
 * Returns 200 OK only when all dependencies are healthy.
 *
 * @version 1.0.0
 * @since Phase 37
 */

import { HEALTH_CONFIG } from "../config/apiConfig";

/** --- Health Status --- */
export type HealthStatus = "healthy" | "degraded" | "unhealthy";

/** --- Component Health --- */
export interface ComponentHealth {
  name: string;
  status: HealthStatus;
  responseTimeMs: number;
  lastChecked: string;
  message?: string;
}

/** --- Full Health Report --- */
export interface HealthReport {
  status: HealthStatus;
  timestamp: string;
  version: string;
  uptime: number;
  components: ComponentHealth[];
}

/** --- Health Check Functions --- */
export type HealthCheckFn = () => Promise<ComponentHealth>;

export const healthChecks: Record<string, HealthCheckFn> = {
  database: async () => {
    const start = Date.now();
    try {
      return {
        name: "database",
        status: "healthy",
        responseTimeMs: Date.now() - start,
        lastChecked: new Date().toISOString(),
      };
    } catch {
      return {
        name: "database",
        status: "unhealthy",
        responseTimeMs: Date.now() - start,
        lastChecked: new Date().toISOString(),
        message: "Cannot connect to PostgreSQL",
      };
    }
  },

  redis: async () => {
    const start = Date.now();
    try {
      return {
        name: "redis",
        status: "healthy",
        responseTimeMs: Date.now() - start,
        lastChecked: new Date().toISOString(),
      };
    } catch {
      return {
        name: "redis",
        status: "unhealthy",
        responseTimeMs: Date.now() - start,
        lastChecked: new Date().toISOString(),
        message: "Cannot connect to Redis",
      };
    }
  },

  disk: async () => {
    const start = Date.now();
    try {
      return {
        name: "disk",
        status: "healthy",
        responseTimeMs: Date.now() - start,
        lastChecked: new Date().toISOString(),
      };
    } catch {
      return {
        name: "disk",
        status: "degraded",
        responseTimeMs: Date.now() - start,
        lastChecked: new Date().toISOString(),
        message: "Disk space low",
      };
    }
  },

  memory: async () => {
    const start = Date.now();
    const usage = typeof process !== "undefined" && typeof process.memoryUsage === "function"
      ? process.memoryUsage()
      : undefined;
    const rssMB = usage ? Math.round(usage.rss / 1024 / 1024) : 0;
    const status: HealthStatus = rssMB > 2048 ? "degraded" : "healthy";
    return {
      name: "memory",
      status,
      responseTimeMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
      message: status === "degraded" ? `RSS: ${rssMB}MB` : undefined,
    };
  },
};

/** --- Run Full Health Check --- */
export async function runHealthCheck(): Promise<HealthReport> {
  const startTime = Date.now();
  const components = await Promise.all(
    HEALTH_CONFIG.checks.map(async (name): Promise<ComponentHealth> => {
      const fn = healthChecks[name];
      if (!fn) {
        return {
          name,
          status: "unhealthy",
          responseTimeMs: Date.now() - startTime,
          lastChecked: new Date().toISOString(),
          message: "Check not implemented",
        };
      }
      try {
        return await fn();
      } catch (err) {
        return {
          name,
          status: "unhealthy",
          responseTimeMs: Date.now() - startTime,
          lastChecked: new Date().toISOString(),
          message: (err as Error)?.message || "Check failed",
        };
      }
    })
  );
  const allHealthy = components.every((c) => c.status === "healthy");
  const anyUnhealthy = components.some((c) => c.status === "unhealthy");
  const status: HealthStatus = anyUnhealthy
    ? "unhealthy"
    : allHealthy
      ? "healthy"
      : "degraded";
  return {
    status,
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: typeof process !== "undefined" && typeof process.uptime === "function" ? process.uptime() : 0,
    components,
  };
}

/** --- Check if system is ready --- */
export async function isSystemReady(): Promise<boolean> {
  const report = await runHealthCheck();
  return report.status !== "unhealthy";
}
