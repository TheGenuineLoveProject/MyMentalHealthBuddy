/**
 * @fileoverview Lumi Backend -- Barrel Export
 * @module lumi-backend
 *
 * Backend API architecture specification.
 *
 * @version 1.0.0
 * @since Phase 37
 */

export {
  API_CONFIG,
  AUTH_CONFIG,
  RATE_LIMIT_CONFIG,
  DB_CONFIG,
  REDIS_CONFIG,
  HIPAA_CONFIG,
  HEALTH_CONFIG,
  CORS_CONFIG,
  UPLOAD_CONFIG,
} from "./config/apiConfig";

export {
  type ApiRoute,
  AUTH_ROUTES,
  USER_ROUTES,
  TRACKER_ROUTES,
  THERAPY_ROUTES,
  AGENT_ROUTES,
  CRISIS_ROUTES,
  NOTIFICATION_ROUTES,
  LIBRARY_ROUTES,
  HEALTH_ROUTE,
  ALL_ROUTES,
  getRouteStats,
} from "./routes/apiRoutes";

export {
  type JWTSpec,
  JWT_SPEC,
  type RateLimitSpec,
  RATE_LIMIT_SPECS,
  type HIPAASpec,
  HIPAA_SPEC,
  type ErrorHandlerSpec,
  ERROR_HANDLER_SPEC,
  type ValidationSpec,
  VALIDATION_SPEC,
  type LoggingSpec,
  LOGGING_SPEC,
  CORS_SPEC,
  UPLOAD_SPEC,
} from "./middleware/middlewareSpec";

export {
  type HealthStatus,
  type ComponentHealth,
  type HealthReport,
  healthChecks,
  runHealthCheck,
  isSystemReady,
} from "./health/healthCheck";
