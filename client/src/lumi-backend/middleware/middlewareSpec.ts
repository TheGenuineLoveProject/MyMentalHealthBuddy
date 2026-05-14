/**
 * @fileoverview Middleware Specification
 * @module lumi-backend/middleware
 *
 * All middleware layers for the Express backend.
 * These are specs -- actual Express middleware would use these configs.
 *
 * @version 1.0.0
 * @since Phase 37
 */

import {
  RATE_LIMIT_CONFIG,
  AUTH_CONFIG,
  HIPAA_CONFIG,
  CORS_CONFIG,
  UPLOAD_CONFIG,
} from "../config/apiConfig";

/** --- JWT Middleware Spec --- */
export interface JWTSpec {
  extractHeader: "Bearer";
  algorithm: "HS256";
  secretEnv: "JWT_SECRET";
  expiresIn: typeof AUTH_CONFIG.jwtExpiresIn;
  refreshExpiresIn: typeof AUTH_CONFIG.refreshTokenExpiresIn;
  attachUserId: true;
  attachRole: true;
}

export const JWT_SPEC: JWTSpec = {
  extractHeader: "Bearer",
  algorithm: "HS256",
  secretEnv: "JWT_SECRET",
  expiresIn: AUTH_CONFIG.jwtExpiresIn,
  refreshExpiresIn: AUTH_CONFIG.refreshTokenExpiresIn,
  attachUserId: true,
  attachRole: true,
};

/** --- Rate Limit Middleware Spec --- */
export interface RateLimitSpec {
  name: string;
  windowMs: number;
  maxRequests: number;
  keyGenerator: string;
  handler: string;
}

export const RATE_LIMIT_SPECS: Record<string, RateLimitSpec> = {
  global: {
    name: "global",
    windowMs: RATE_LIMIT_CONFIG.global.windowMs,
    maxRequests: RATE_LIMIT_CONFIG.global.max,
    keyGenerator: "req.ip",
    handler: "429 Too Many Requests",
  },
  auth: {
    name: "auth",
    windowMs: RATE_LIMIT_CONFIG.auth.windowMs,
    maxRequests: RATE_LIMIT_CONFIG.auth.max,
    keyGenerator: "req.ip",
    handler: "429 Too Many Requests - Login attempts exceeded",
  },
  api: {
    name: "api",
    windowMs: RATE_LIMIT_CONFIG.api.windowMs,
    maxRequests: RATE_LIMIT_CONFIG.api.max,
    keyGenerator: "req.user.id || req.ip",
    handler: "429 Too Many Requests - API limit exceeded",
  },
  crisis: {
    name: "crisis",
    windowMs: RATE_LIMIT_CONFIG.crisis.windowMs,
    maxRequests: RATE_LIMIT_CONFIG.crisis.max,
    keyGenerator: "req.ip",
    handler: "429 Too Many Requests",
  },
};

/** --- HIPAA Compliance Middleware Spec --- */
export interface HIPAASpec {
  encryptAtRest: true;
  encryptInTransit: true;
  auditPhiAccess: true;
  mfaRequired: true;
  sessionTimeoutMinutes: number;
  phiFields: string[];
}

export const HIPAA_SPEC: HIPAASpec = {
  encryptAtRest: true,
  encryptInTransit: true,
  auditPhiAccess: true,
  mfaRequired: true,
  sessionTimeoutMinutes: HIPAA_CONFIG.sessionTimeoutMinutes,
  phiFields: [...HIPAA_CONFIG.phiFields],
};

/** --- Error Handling Spec --- */
export interface ErrorHandlerSpec {
  exposeStackTraces: boolean;
  logErrors: true;
  genericMessage: "Something went wrong. Please try again.";
  categories: {
    validation: 400;
    unauthorized: 401;
    forbidden: 403;
    notFound: 404;
    rateLimited: 429;
    serverError: 500;
    serviceUnavailable: 503;
  };
}

export const ERROR_HANDLER_SPEC: ErrorHandlerSpec = {
  exposeStackTraces: process.env.NODE_ENV !== "production",
  logErrors: true,
  genericMessage: "Something went wrong. Please try again.",
  categories: {
    validation: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    rateLimited: 429,
    serverError: 500,
    serviceUnavailable: 503,
  },
};

/** --- Request Validation Spec (Zod) --- */
export interface ValidationSpec {
  body: true;
  query: true;
  params: true;
  sanitize: true;
  maxStringLength: 10000;
  rejectHtmlTags: true;
}

export const VALIDATION_SPEC: ValidationSpec = {
  body: true,
  query: true,
  params: true,
  sanitize: true,
  maxStringLength: 10000,
  rejectHtmlTags: true,
};

/** --- Logging Middleware Spec --- */
export interface LoggingSpec {
  logRequests: true;
  logResponses: true;
  logResponseTime: true;
  excludeFields: string[];
  format: "json";
}

export const LOGGING_SPEC: LoggingSpec = {
  logRequests: true,
  logResponses: true,
  logResponseTime: true,
  excludeFields: [
    "password",
    "token",
    "refreshToken",
    "mood_entries",
    "journal_entries",
    "thought_records",
    "ssn",
    "dob",
    "phone",
    "address",
  ],
  format: "json",
};

/** --- CORS Middleware Spec --- */
export const CORS_SPEC = {
  ...CORS_CONFIG,
  strictOrigin: true,
  varyOrigin: true,
} as const;

/** --- File Upload Spec --- */
export const UPLOAD_SPEC = {
  ...UPLOAD_CONFIG,
  tempDir: "/tmp/uploads",
  virusScanCommand: "clamscan",
  renameToUuid: true,
  userPrefix: true,
} as const;
