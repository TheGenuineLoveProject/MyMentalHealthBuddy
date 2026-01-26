# Security Testing Guide

## Overview

This document outlines security testing practices for The Genuine Love Project.

## OWASP Top 10 Checklist

### 1. Injection (A03:2021)
- [x] SQL injection: Using Drizzle ORM (parameterized queries)
- [x] XSS: React escapes by default
- [x] Command injection: Not executing user input

### 2. Broken Authentication (A07:2021)
- [x] Password hashing: bcrypt with cost 10+
- [x] Session management: Secure cookies
- [x] Rate limiting: Auth endpoints protected

### 3. Sensitive Data Exposure (A02:2021)
- [x] HTTPS enforced
- [x] Passwords not logged
- [x] PII redacted in logs

### 4. XML External Entities (A05:2021)
- [x] Not using XML parsing

### 5. Broken Access Control (A01:2021)
- [x] RBAC middleware
- [x] Route protection
- [x] Resource ownership checks

### 6. Security Misconfiguration (A05:2021)
- [x] Helmet middleware
- [x] CSP headers
- [x] Error messages don't leak info

### 7. Cross-Site Scripting (A03:2021)
- [x] React escaping
- [x] Content-Type headers
- [x] No dangerouslySetInnerHTML

### 8. Insecure Deserialization (A08:2021)
- [x] JSON only
- [x] Zod validation

### 9. Using Components with Known Vulnerabilities (A06:2021)
- [ ] Run npm audit monthly
- [ ] Review dependency updates

### 10. Insufficient Logging & Monitoring (A09:2021)
- [x] Audit logs for sensitive actions
- [x] Request ID tracking
- [x] Error reporting

## Automated Testing

### npm audit

```bash
# Check for vulnerabilities
npm audit

# Fix automatically if possible
npm audit fix
```

### Manual Checks

#### Authentication Testing
```bash
# Test password requirements
curl -X POST /api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"weak"}'
# Should fail with 400

# Test rate limiting
for i in {1..20}; do
  curl -X POST /api/auth/login \
    -d '{"email":"test@test.com","password":"wrong"}'
done
# Should see 429 after limit
```

#### Authorization Testing
```bash
# Test admin route without auth
curl /api/admin/stats
# Should return 401

# Test admin route with user token
curl /api/admin/stats -H "Authorization: Bearer $USER_TOKEN"
# Should return 403
```

## Security Review Schedule

| Check | Frequency |
|-------|-----------|
| npm audit | Monthly |
| Dependency updates | Monthly |
| Access review | Quarterly |
| Full security review | Quarterly |

## Vulnerability Reporting

If you discover a security vulnerability:

1. Do NOT create a public issue
2. Contact the maintainers directly
3. Allow time for fix before disclosure
