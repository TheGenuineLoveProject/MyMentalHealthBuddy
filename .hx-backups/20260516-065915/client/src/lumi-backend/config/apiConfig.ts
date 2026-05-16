/**
 * @fileoverview API Configuration
 * @module lumi-backend/config
 *
 * Backend API architecture specification.
 * Express + JWT + PostgreSQL + Redis stack.
 * All endpoints follow REST conventions.
 *
 * @version 1.0.0
 * @since Phase 37
 */

/** --- API Base Configuration --- */
export const API_CONFIG = {
  version: "v1",
  basePath: "/api/v1",
  port: 3001,
  host: "0.0.0.0",
  timeoutMs: 10000,
} as const;

/** --- Authentication --- */
export const AUTH_CONFIG = {
  jwtSecret: process.env.JWT_SECRET || "development-secret-change-in-prod",
  jwtExpiresIn: "7d",
  refreshTokenExpiresIn: "30d",
  bcryptRounds: 12,
  maxLoginAttempts: 5,
  lockoutDurationMs: 15 * 60 * 1000,
} as const;

/** --- Rate Limiting --- */
export const RATE_LIMIT_CONFIG = {
  global: { windowMs: 60 * 1000, max: 100 },
  auth: { windowMs: 15 * 60 * 1000, max: 20 },
  api: { windowMs: 60 * 1000, max: 60 },
  crisis: { windowMs: 60 * 1000, max: 10 },
} as const;

/** --- Database --- */
export const DB_CONFIG = {
  type: "postgresql" as const,
  poolSize: 20,
  ssl: process.env.NODE_ENV === "production",
  connectionTimeoutMs: 5000,
  queryTimeoutMs: 10000,
} as const;

/** --- Redis --- */
export const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
  sessionTtlSeconds: 86400,
  rateLimitPrefix: "ratelimit:",
} as const;

/** --- HIPAA Compliance --- */
export const HIPAA_CONFIG = {
  encryptionAtRest: "AES-256-GCM",
  encryptionInTransit: "TLS 1.3",
  phiFields: [
    "mood_entries",
    "journal_entries",
    "thought_records",
    "crisis_interactions",
    "therapy_notes",
    "medication_history",
  ],
  auditLogRetentionDays: 2555,
  minPasswordEntropy: 50,
  mfaRequired: true,
  sessionTimeoutMinutes: 30,
} as const;

/** --- Health Check --- */
export const HEALTH_CONFIG = {
  endpoint: "/health",
  checkIntervalMs: 30000,
  maxResponseTimeMs: 2000,
  checks: ["database", "redis", "disk", "memory"],
} as const;

/** --- CORS --- */
export const CORS_CONFIG = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
} as const;

/** --- File Upload --- */
export const UPLOAD_CONFIG = {
  maxFileSizeBytes: 10 * 1024 * 1024,
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  scanForMalware: true,
} as const;
