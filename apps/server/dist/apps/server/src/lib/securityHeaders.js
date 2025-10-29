/**
 * Security Headers - 360° Security Enhancement
 * Configures CSP, HSTS, and other security headers
 */
/**
 * Configure comprehensive security headers
 */
export function configureSecurityHeaders(app) {
    const isProduction = process.env.NODE_ENV === 'production';
    // Content Security Policy
    const cspDirectives = {
        defaultSrc: ["'self'"],
        scriptSrc: [
            "'self'",
            "'unsafe-inline'", // For React inline scripts
            "'unsafe-eval'", // For React DevTools (remove in production)
            "https://js.stripe.com",
            "https://cdn.canva.com"
        ],
        styleSrc: [
            "'self'",
            "'unsafe-inline'", // For styled components
            "https://fonts.googleapis.com"
        ],
        imgSrc: [
            "'self'",
            "data:",
            "blob:",
            "https:",
            "https://*.stripe.com",
            "https://*.canva.com"
        ],
        fontSrc: [
            "'self'",
            "data:",
            "https://fonts.gstatic.com"
        ],
        connectSrc: [
            "'self'",
            "https://api.stripe.com",
            "https://api.canva.com",
            "https://api.openai.com",
            ...(isProduction ? [] : ["ws:", "wss:"]) // WebSocket for HMR in dev
        ],
        frameSrc: [
            "'self'",
            "https://js.stripe.com",
            "https://hooks.stripe.com",
            "https://*.canva.com"
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"], // Prevent clickjacking
        upgradeInsecureRequests: isProduction ? [] : null
    };
    // Build CSP header
    const cspHeader = Object.entries(cspDirectives)
        .filter(([_, value]) => value !== null)
        .map(([key, value]) => {
        const directive = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return Array.isArray(value) && value.length > 0
            ? `${directive} ${value.join(' ')}`
            : value === null
                ? null
                : directive;
    })
        .filter(Boolean)
        .join('; ');
    app.use((req, res, next) => {
        // Content Security Policy
        res.setHeader('Content-Security-Policy', cspHeader);
        // Strict Transport Security (HTTPS only)
        if (isProduction) {
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }
        // Prevent MIME type sniffing
        res.setHeader('X-Content-Type-Options', 'nosniff');
        // Prevent clickjacking
        res.setHeader('X-Frame-Options', 'DENY');
        // Enable XSS filter
        res.setHeader('X-XSS-Protection', '1; mode=block');
        // Referrer policy
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        // Permissions policy
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        // Remove powered-by header
        res.removeHeader('X-Powered-By');
        next();
    });
    console.log('🔒 Security headers configured');
}
/**
 * CORS configuration for production
 */
export function getCorsOptions() {
    const isProduction = process.env.NODE_ENV === 'production';
    const allowedOrigins = isProduction
        ? [
            process.env.PRODUCTION_URL || '',
            process.env.REPLIT_DEV_DOMAIN || ''
        ].filter(Boolean)
        : ['*']; // Allow all in development
    return {
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, Postman, etc.)
            if (!origin)
                return callback(null, true);
            if (!isProduction || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        optionsSuccessStatus: 200
    };
}
