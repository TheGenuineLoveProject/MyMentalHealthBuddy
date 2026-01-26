# Security Documentation

## Overview

The Genuine Love Project implements defense-in-depth security practices suitable for a mental wellness platform handling sensitive user data.

## Authentication & Authorization

### Session Management
- **Location:** `server/middleware/session.mjs`
- **Strategy:** Express sessions with secure cookies
- **Flags:** `httpOnly`, `secure` (production), `sameSite: 'lax'`

### Role-Based Access Control (RBAC)
- **Roles:** `user`, `admin`
- **Middleware:** `server/middleware/requireRole.mjs`
- **Admin routes:** Protected by `requireAdmin.mjs`

## Security Headers

Implemented via Helmet.js (`server/middleware/security.mjs`):
- Content-Security-Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy

## Rate Limiting

- **Location:** `server/middleware/rateLimit.mjs`
- **Strategy:** Per-IP and per-user limits
- **Exempt paths:** `/api/health`, `/api/webhooks`

## Input Validation

- **Library:** Zod
- **Coverage:** All API endpoints validated
- **Sanitization:** XSS prevention via input escaping

## CSRF Protection

- **Location:** `server/middleware/csrf.mjs`
- **Strategy:** Token-based CSRF protection for state-changing requests

## Secrets Management

- **Storage:** Replit Secrets (never hardcoded)
- **Rotation:** Documented in `.env.example`
- **Audit:** No secrets in git history

## Audit Logging

- **Location:** `server/middleware/audit.mjs`
- **Events:** Login, logout, admin actions, data access
- **Storage:** Database `audit_logs` table
- **PII:** Minimal, no sensitive content logged

## Threat Model

See `docs/security/THREAT_MODEL.md` for detailed threat analysis.

## Vulnerability Reporting

Contact: security@thegenuineloveproject.com
