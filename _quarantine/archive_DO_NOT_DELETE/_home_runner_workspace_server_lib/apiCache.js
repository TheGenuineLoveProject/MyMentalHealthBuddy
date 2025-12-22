import crypto from 'crypto';
/**
 * 360° Performance Optimization: API Response Caching Middleware
 *
 * Implements intelligent caching strategies for different API response types:
 * - Public data: Longer cache durations with stale-while-revalidate
 * - User-specific data: Short cache with private directive
 * - Real-time data: No caching
 */
/**
 * Deep stable JSON stringify with recursive key sorting
 * Leverages JSON.stringify for proper type handling (Date, RegExp, etc.)
 * while ensuring deterministic key order for plain objects
 */
function stableStringify(obj) {
    return JSON.stringify(obj, (key, value) => {
        // For non-plain objects (Date, RegExp, etc.), let JSON.stringify handle them
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            // Check if it's a plain object (has Object.prototype or null prototype)
            const proto = Object.getPrototypeOf(value);
            if (proto === Object.prototype || proto === null) {
                // Sort keys for plain objects only
                const sorted = {};
                Object.keys(value).sort().forEach(k => {
                    sorted[k] = value[k];
                });
                return sorted;
            }
        }
        // Return value as-is for primitives, arrays, and special objects (Date, etc.)
        return value;
    });
}
export const CACHE_PRESETS = {
    // Public static content (rarely changes)
    PUBLIC_LONG: {
        maxAge: 3600, // 1 hour
        staleWhileRevalidate: 7200, // 2 hours
    },
    // Public content (changes occasionally)
    PUBLIC_MEDIUM: {
        maxAge: 300, // 5 minutes
        staleWhileRevalidate: 600, // 10 minutes
    },
    // Public content (changes frequently)
    PUBLIC_SHORT: {
        maxAge: 60, // 1 minute
        staleWhileRevalidate: 120, // 2 minutes
    },
    // User-specific content (moderate caching)
    PRIVATE_MEDIUM: {
        maxAge: 180, // 3 minutes
        private: true,
    },
    // User-specific content (minimal caching)
    PRIVATE_SHORT: {
        maxAge: 30, // 30 seconds
        private: true,
    },
    // Real-time or sensitive data (no caching)
    NO_CACHE: {
        maxAge: 0,
        noStore: true,
        mustRevalidate: true,
    },
};
/**
 * Middleware factory for API response caching
 *
 * @example
 * // Long cache for public crisis resources
 * app.get('/api/crisis-resources', apiCache(CACHE_PRESETS.PUBLIC_LONG), handler);
 *
 * // Short cache for user mood entries
 * app.get('/api/moods', requireAuth, apiCache(CACHE_PRESETS.PRIVATE_SHORT), handler);
 *
 * // No cache for real-time chat
 * app.post('/api/chat', requireAuth, apiCache(CACHE_PRESETS.NO_CACHE), handler);
 */
export function apiCache(config) {
    return (req, res, next) => {
        // Build Cache-Control header
        const directives = [];
        if (config.noStore) {
            directives.push('no-store', 'no-cache', 'must-revalidate');
        }
        else {
            if (config.private) {
                directives.push('private');
            }
            else {
                directives.push('public');
            }
            directives.push(`max-age=${config.maxAge}`);
            if (config.staleWhileRevalidate) {
                directives.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
            }
            if (config.mustRevalidate) {
                directives.push('must-revalidate');
            }
        }
        const cacheControlValue = directives.join(', ');
        res.setHeader('Cache-Control', cacheControlValue);
        // Add ETag support for conditional requests (JSON responses only)
        // Only override res.json if not already overridden
        if (!res.locals._apiCacheApplied) {
            res.locals._apiCacheApplied = true;
            const originalJson = res.json.bind(res);
            res.json = function (body) {
                try {
                    // Normalize JSON with deep stable stringify (recursive key sorting)
                    const bodyString = stableStringify(body);
                    // Generate ETag from full response body using SHA-256 for collision-free fingerprinting
                    const hash = crypto.createHash('sha256').update(bodyString).digest('base64');
                    const etag = hash; // Strong ETag without quotes (added by setHeader)
                    // Check if client has cached version (304 Not Modified)
                    // Support both strong and weak ETags by normalizing comparison
                    const clientEtag = req.headers['if-none-match'];
                    if (clientEtag) {
                        // Strip W/ prefix for weak validators and quotes
                        const normalizedClientEtag = clientEtag.replace(/^W\//, '').replace(/"/g, '');
                        const normalizedServerEtag = etag.replace(/"/g, '');
                        if (normalizedClientEtag === normalizedServerEtag) {
                            // CRITICAL: Explicitly re-set headers in 304 response to guarantee persistence
                            res.setHeader('Cache-Control', cacheControlValue);
                            res.setHeader('ETag', `"${etag}"`); // Set with quotes for HTTP spec compliance
                            return res.status(304).end();
                        }
                    }
                    // Set ETag for successful response (with quotes for HTTP spec compliance)
                    res.setHeader('ETag', `"${etag}"`);
                }
                catch (error) {
                    // If ETag generation fails, just continue without it
                    console.warn('[apiCache] ETag generation failed:', error);
                }
                return originalJson(body);
            };
        }
        next();
    };
}
/**
 * Conditional caching based on request context
 *
 * @example
 * app.get('/api/data', conditionalCache({
 *   authenticated: CACHE_PRESETS.PRIVATE_SHORT,
 *   public: CACHE_PRESETS.PUBLIC_MEDIUM
 * }));
 */
export function conditionalCache(options) {
    return (req, res, next) => {
        const isAuthenticated = !!req.session?.userId;
        const config = isAuthenticated ? options.authenticated : options.public;
        return apiCache(config)(req, res, next);
    };
}
/**
 * Vary header middleware to ensure proper cache keying
 * Appends to existing Vary headers instead of overwriting
 *
 * @example
 * app.use('/api', varyHeader(['Authorization', 'Accept-Encoding']));
 */
export function varyHeader(headers) {
    return (req, res, next) => {
        const existing = res.getHeader('Vary');
        const existingHeaders = existing ? String(existing).split(',').map(h => h.trim()) : [];
        const allHeaders = [...new Set([...existingHeaders, ...headers])];
        res.setHeader('Vary', allHeaders.join(', '));
        next();
    };
}
