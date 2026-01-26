# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

- **Email**: security@genuineloveproject.com
- **Response Time**: We aim to respond within 48 hours
- **Do Not**: Publicly disclose vulnerabilities before they are patched

## Security Measures

### Authentication
- Passwords hashed with bcrypt (cost factor 10)
- JWT tokens with short expiration (15 minutes)
- Refresh token rotation
- Rate limiting on authentication endpoints
- Account lockout after failed attempts

### Data Protection
- TLS 1.3 encryption for all traffic
- AES-256 encryption for sensitive data at rest
- Secrets managed via environment variables
- No secrets logged or exposed in error messages

### Infrastructure
- Helmet.js security headers
- Content Security Policy (CSP)
- Strict CORS policy
- SQL injection prevention via parameterized queries (Drizzle ORM)
- XSS prevention via React's default escaping

### Monitoring
- Request ID tracing for audit trails
- Centralized error logging (no stack traces in production)
- Rate limiting on API endpoints
- Audit logs for sensitive actions

## Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: [configured per environment]
```

## Secure Development

- Zod validation on all write endpoints
- Input sanitization and validation
- Regular dependency updates
- Code reviews for security-sensitive changes

## Compliance

- GDPR-ready data handling
- User data export capability
- Right to deletion support
- Transparent privacy practices

---

*Last updated: January 2026*
