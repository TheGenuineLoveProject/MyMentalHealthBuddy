/**
 * Comprehensive Security Hardening Module
 * Implements input sanitization, XSS prevention, and security best practices
 */
/**
 * HTML Entity encoding for XSS prevention
 */
export function escapeHtml(unsafe) {
    const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    return String(unsafe).replace(/[&<>"'`=\/]/g, (char) => entityMap[char]);
}
/**
 * Sanitize user input for safe display
 */
export function sanitizeInput(input, options) {
    let sanitized = input.trim();
    // Apply max length
    if (options?.maxLength) {
        sanitized = sanitized.slice(0, options.maxLength);
    }
    // Remove dangerous tags by default
    const dangerousTags = ['script', 'iframe', 'object', 'embed', 'link', 'style'];
    dangerousTags.forEach((tag) => {
        const regex = new RegExp(`<${tag}[^>]*>.*?<\/${tag}>`, 'gi');
        sanitized = sanitized.replace(regex, '');
        // Also remove self-closing tags
        const selfClosing = new RegExp(`<${tag}[^>]*\/>`, 'gi');
        sanitized = sanitized.replace(selfClosing, '');
    });
    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');
    // Remove data: protocol (except safe data URIs for images)
    sanitized = sanitized.replace(/data:(?!image\/)/gi, '');
    // Remove on* event handlers
    sanitized = sanitized.replace(/\son\w+\s*=/gi, ' ');
    return sanitized;
}
/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url) {
    try {
        const urlObj = new URL(url);
        // Only allow http, https, and mailto protocols
        const allowedProtocols = ['http:', 'https:', 'mailto:'];
        if (!allowedProtocols.includes(urlObj.protocol)) {
            return null;
        }
        return urlObj.toString();
    }
    catch {
        return null;
    }
}
/**
 * Validate email format
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}
/**
 * Validate phone number (basic)
 */
export function validatePhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 10 && digitsOnly.length <= 15;
}
/**
 * Password strength validation
 */
export function validatePasswordStrength(password) {
    const feedback = [];
    let score = 0;
    // Length check
    if (password.length >= 8) {
        score += 1;
    }
    else {
        feedback.push('Password must be at least 8 characters long');
    }
    if (password.length >= 12) {
        score += 1;
    }
    // Complexity checks
    if (/[a-z]/.test(password)) {
        score += 1;
    }
    else {
        feedback.push('Include lowercase letters');
    }
    if (/[A-Z]/.test(password)) {
        score += 1;
    }
    else {
        feedback.push('Include uppercase letters');
    }
    if (/\d/.test(password)) {
        score += 1;
    }
    else {
        feedback.push('Include numbers');
    }
    if (/[^a-zA-Z\d]/.test(password)) {
        score += 1;
    }
    else {
        feedback.push('Include special characters');
    }
    // Common passwords check (basic)
    const commonPasswords = ['password', '123456', 'qwerty', 'admin'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
        score = Math.max(0, score - 2);
        feedback.push('Avoid common passwords');
    }
    return {
        isValid: score >= 4,
        score: Math.min(score, 6),
        feedback
    };
}
/**
 * Content Security Policy helpers
 */
export function generateCSPNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
/**
 * Secure local storage wrapper
 */
export class SecureStorage {
    prefix;
    constructor(prefix = 'app_') {
        this.prefix = prefix;
    }
    /**
     * Set item with optional expiration
     */
    setItem(key, value, expiresInMs) {
        try {
            const data = {
                value,
                timestamp: Date.now(),
                expires: expiresInMs ? Date.now() + expiresInMs : null
            };
            localStorage.setItem(this.prefix + key, JSON.stringify(data));
        }
        catch (error) {
            console.error('Failed to set secure storage item:', error);
        }
    }
    /**
     * Get item with expiration check
     */
    getItem(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            if (!item)
                return null;
            const data = JSON.parse(item);
            // Check expiration
            if (data.expires && Date.now() > data.expires) {
                this.removeItem(key);
                return null;
            }
            return data.value;
        }
        catch (error) {
            console.error('Failed to get secure storage item:', error);
            return null;
        }
    }
    /**
     * Remove item
     */
    removeItem(key) {
        localStorage.removeItem(this.prefix + key);
    }
    /**
     * Clear all items with prefix
     */
    clear() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
}
/**
 * Rate limiting for client-side actions
 */
export class RateLimiter {
    attempts = new Map();
    maxAttempts;
    windowMs;
    constructor(maxAttempts = 5, windowMs = 60000) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }
    /**
     * Check if action is allowed
     */
    isAllowed(key) {
        const now = Date.now();
        const attempts = this.attempts.get(key) || [];
        // Filter out old attempts
        const recentAttempts = attempts.filter(timestamp => now - timestamp < this.windowMs);
        if (recentAttempts.length >= this.maxAttempts) {
            return false;
        }
        // Add new attempt
        recentAttempts.push(now);
        this.attempts.set(key, recentAttempts);
        return true;
    }
    /**
     * Get remaining attempts
     */
    getRemainingAttempts(key) {
        const now = Date.now();
        const attempts = this.attempts.get(key) || [];
        const recentAttempts = attempts.filter(timestamp => now - timestamp < this.windowMs);
        return Math.max(0, this.maxAttempts - recentAttempts.length);
    }
    /**
     * Reset attempts for a key
     */
    reset(key) {
        this.attempts.delete(key);
    }
}
/**
 * Secure random token generation
 */
export function generateSecureToken(length = 32) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
/**
 * Prevent clickjacking by checking if in iframe
 */
export function preventClickjacking() {
    if (window.self !== window.top) {
        // Page is in an iframe
        console.warn('Potential clickjacking detected');
        // Option 1: Bust out of iframe (aggressive)
        // window.top.location = window.self.location;
        // Option 2: Show warning (less disruptive)
        document.body.style.display = 'none';
        alert('For your security, this application cannot be displayed in a frame.');
    }
}
/**
 * Secure form submission helper
 */
export function secureFormSubmit(form, onSubmit) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        // Sanitize all text inputs
        const sanitizedData = new FormData();
        formData.forEach((value, key) => {
            if (typeof value === 'string') {
                sanitizedData.append(key, sanitizeInput(value));
            }
            else {
                sanitizedData.append(key, value);
            }
        });
        try {
            await onSubmit(sanitizedData);
        }
        catch (error) {
            console.error('Form submission error:', error);
        }
    });
}
/**
 * Initialize security hardening
 */
export function initializeSecurityHardening() {
    // Prevent clickjacking
    preventClickjacking();
    // Disable right-click in production (optional)
    if (process.env.NODE_ENV === 'production') {
        document.addEventListener('contextmenu', (e) => {
            if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
                // Allow right-click on input fields for accessibility
                // e.preventDefault();
            }
        });
    }
    // Clear sensitive data on page unload
    window.addEventListener('beforeunload', () => {
        // Clear any sensitive in-memory data
        sessionStorage.removeItem('temp_data');
    });
    console.log('✅ Security hardening initialized');
}
/**
 * SQL Injection prevention for client-side query building
 */
export function escapeSQLString(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
        switch (char) {
            case '\0': return '\\0';
            case '\x08': return '\\b';
            case '\x09': return '\\t';
            case '\x1a': return '\\z';
            case '\n': return '\\n';
            case '\r': return '\\r';
            case '"':
            case "'":
            case '\\':
            case '%': return '\\' + char;
            default: return char;
        }
    });
}
