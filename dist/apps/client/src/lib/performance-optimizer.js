/**
 * Advanced Performance Optimization Module
 * Implements lazy loading, prefetching, resource hints, and optimization strategies
 */
/**
 * Add DNS prefetch for external domains
 */
export function addDNSPrefetch(domains) {
    domains.forEach((domain) => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
    });
}
/**
 * Add preconnect for critical external resources
 */
export function addPreconnect(origins, crossOrigin = false) {
    origins.forEach((origin) => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = origin;
        if (crossOrigin) {
            link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
    });
}
/**
 * Preload critical resources
 */
export function preloadResource(hints) {
    hints.forEach((hint) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = hint.href;
        if (hint.as)
            link.as = hint.as;
        if (hint.type)
            link.type = hint.type;
        if (hint.priority)
            link.setAttribute('importance', hint.priority);
        document.head.appendChild(link);
    });
}
/**
 * Prefetch resources for next navigation
 */
export function prefetchResource(urls) {
    if ('connection' in navigator && navigator.connection?.saveData) {
        return; // Skip prefetch on data saver mode
    }
    urls.forEach((url) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    });
}
/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImages(selector = '[data-lazy]') {
    const images = document.querySelectorAll(selector);
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    const srcset = img.dataset.srcset;
                    if (src)
                        img.src = src;
                    if (srcset)
                        img.srcset = srcset;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01,
        });
        images.forEach((img) => imageObserver.observe(img));
    }
    else {
        // Fallback for browsers without Intersection Observer
        images.forEach((img) => {
            const src = img.dataset.src;
            const srcset = img.dataset.srcset;
            if (src)
                img.src = src;
            if (srcset)
                img.srcset = srcset;
        });
    }
}
/**
 * Debounce function for performance optimization
 */
export function debounce(func, wait) {
    let timeout = null;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
/**
 * Throttle function for performance optimization
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
/**
 * Request Idle Callback wrapper with fallback
 */
export function runWhenIdle(callback, options) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, options);
    }
    else {
        setTimeout(callback, 1);
    }
}
/**
 * Critical CSS inline injection
 */
export function inlineCriticalCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}
/**
 * Defer non-critical CSS loading
 */
export function loadDeferredCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = function () {
        link.media = 'all';
    };
    document.head.appendChild(link);
}
/**
 * Font loading optimization
 */
export function optimizeFontLoading(fonts) {
    if ('fonts' in document) {
        fonts.forEach((font) => {
            const fontFace = `${font.weight || '400'} ${font.style || 'normal'} ${font.family}`;
            document.fonts.load(fontFace).catch((err) => {
                console.warn(`Failed to load font: ${fontFace}`, err);
            });
        });
    }
}
/**
 * Service Worker registration with error handling
 */
export async function registerServiceWorker(scriptURL) {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register(scriptURL);
            console.log('Service Worker registered:', registration);
            return registration;
        }
        catch (error) {
            console.error('Service Worker registration failed:', error);
            return null;
        }
    }
    return null;
}
/**
 * Cache API wrapper for offline support
 */
export class CacheManager {
    cacheName;
    constructor(cacheName) {
        this.cacheName = cacheName;
    }
    async add(url) {
        if ('caches' in window) {
            const cache = await caches.open(this.cacheName);
            await cache.add(url);
        }
    }
    async addAll(urls) {
        if ('caches' in window) {
            const cache = await caches.open(this.cacheName);
            await cache.addAll(urls);
        }
    }
    async match(request) {
        if ('caches' in window) {
            return await caches.match(request);
        }
        return undefined;
    }
    async delete() {
        if ('caches' in window) {
            return await caches.delete(this.cacheName);
        }
        return false;
    }
}
/**
 * Network quality detection
 */
export function getNetworkQuality() {
    if ('connection' in navigator) {
        const conn = navigator.connection;
        const effectiveType = conn?.effectiveType;
        if (effectiveType === '4g')
            return 'fast';
        if (effectiveType === '3g')
            return 'medium';
        return 'slow';
    }
    return 'medium';
}
/**
 * Adaptive loading based on network quality
 */
export function shouldLoadHighQuality() {
    const quality = getNetworkQuality();
    const saveData = 'connection' in navigator && navigator.connection?.saveData;
    return quality === 'fast' && !saveData;
}
/**
 * Progressive image loading
 */
export function progressiveImageLoad(img, lowQualitySrc, highQualitySrc) {
    img.src = lowQualitySrc;
    img.classList.add('loading');
    const highQualityImg = new Image();
    highQualityImg.src = highQualitySrc;
    highQualityImg.onload = () => {
        img.src = highQualitySrc;
        img.classList.remove('loading');
        img.classList.add('loaded');
    };
}
/**
 * Batch DOM updates for better performance
 */
export function batchDOMUpdates(updates) {
    requestAnimationFrame(() => {
        const fragment = document.createDocumentFragment();
        updates.forEach((update) => update());
    });
}
/**
 * Memory management - Clear unused resources
 */
export function clearUnusedResources() {
    runWhenIdle(() => {
        // Clear unused images
        const images = document.querySelectorAll('img[data-loaded="true"]');
        images.forEach((img) => {
            const rect = img.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (!isVisible && img instanceof HTMLImageElement) {
                img.removeAttribute('src');
                img.dataset.loaded = 'false';
            }
        });
    });
}
/**
 * Initialize all performance optimizations
 */
export function initializePerformanceOptimizations() {
    // Add DNS prefetch for external services
    addDNSPrefetch([
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://api.openai.com',
    ]);
    // Add preconnect for critical services
    addPreconnect([
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
    ], true);
    // Lazy load images
    lazyLoadImages();
    // Clear unused resources periodically
    setInterval(clearUnusedResources, 30000);
    // Listen for route changes to prefetch next pages
    window.addEventListener('popstate', () => {
        runWhenIdle(() => {
            lazyLoadImages();
        });
    });
    console.log('✅ Performance optimizations initialized');
}
