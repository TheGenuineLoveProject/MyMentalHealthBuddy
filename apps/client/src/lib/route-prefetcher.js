/**
 * Intelligent Route Prefetching with Markov Chain Prediction
 * Data-driven prediction model that learns from actual user navigation patterns
 */
import { prefetchResource, runWhenIdle, getNetworkQuality } from './performance-optimizer';
/**
 * Markov Chain based route predictor
 * Uses first-order Markov chain to predict next route based on current route
 */
class MarkovPredictor {
    transitionMatrix = new Map();
    minSampleSize = 3; // Minimum transitions before trusting prediction
    /**
     * Record a transition from one route to another
     */
    recordTransition(from, to) {
        if (!this.transitionMatrix.has(from)) {
            this.transitionMatrix.set(from, new Map());
        }
        const fromTransitions = this.transitionMatrix.get(from);
        const existing = fromTransitions.get(to) || { count: 0, probability: 0 };
        existing.count++;
        fromTransitions.set(to, existing);
        // Recalculate probabilities for this state
        this.updateProbabilities(from);
    }
    /**
     * Update transition probabilities for a given state
     */
    updateProbabilities(from) {
        const transitions = this.transitionMatrix.get(from);
        if (!transitions)
            return;
        const total = Array.from(transitions.values()).reduce((sum, data) => sum + data.count, 0);
        for (const [to, data] of transitions.entries()) {
            data.probability = data.count / total;
        }
    }
    /**
     * Predict next routes with confidence scores
     */
    predict(currentRoute, minConfidence = 0.2) {
        const transitions = this.transitionMatrix.get(currentRoute);
        if (!transitions) {
            return [];
        }
        // Only predict if we have enough samples
        const totalSamples = Array.from(transitions.values()).reduce((sum, data) => sum + data.count, 0);
        if (totalSamples < this.minSampleSize) {
            return [];
        }
        const predictions = Array.from(transitions.entries())
            .map(([route, data]) => ({
            route,
            confidence: data.probability
        }))
            .filter(pred => pred.confidence >= minConfidence)
            .sort((a, b) => b.confidence - a.confidence);
        return predictions;
    }
    /**
     * Get prediction confidence for a specific transition
     */
    getConfidence(from, to) {
        const transitions = this.transitionMatrix.get(from);
        return transitions?.get(to)?.probability || 0;
    }
    /**
     * Export transition matrix for persistence
     */
    export() {
        const data = {};
        for (const [from, transitions] of this.transitionMatrix.entries()) {
            data[from] = {};
            for (const [to, transData] of transitions.entries()) {
                data[from][to] = {
                    count: transData.count,
                    probability: transData.probability
                };
            }
        }
        return data;
    }
    /**
     * Import transition matrix from storage
     */
    import(data) {
        this.transitionMatrix.clear();
        for (const [from, transitions] of Object.entries(data)) {
            const transMap = new Map();
            for (const [to, transData] of Object.entries(transitions)) {
                transMap.set(to, transData);
            }
            this.transitionMatrix.set(from, transMap);
        }
    }
    /**
     * Get statistics about the model
     */
    getStats() {
        const totalStates = this.transitionMatrix.size;
        let totalTransitions = 0;
        for (const transitions of this.transitionMatrix.values()) {
            totalTransitions += transitions.size;
        }
        return {
            totalStates,
            totalTransitions,
            avgTransitionsPerState: totalStates > 0 ? totalTransitions / totalStates : 0
        };
    }
}
class RoutePrefetcher {
    metrics = new Map();
    predictor = new MarkovPredictor();
    currentRoute = '/';
    routeStartTime = Date.now();
    prefetchedRoutes = new Set();
    prefetchStats = {
        prefetched: 0,
        hits: 0,
        misses: 0
    };
    constructor() {
        this.loadMetrics();
        this.loadPredictor();
    }
    /**
     * Track route visit
     */
    trackRouteVisit(route) {
        const now = Date.now();
        const timeSpent = now - this.routeStartTime;
        // Check if this was a successful prefetch
        if (this.prefetchedRoutes.has(route)) {
            this.prefetchStats.hits++;
        }
        else if (this.prefetchedRoutes.size > 0) {
            this.prefetchStats.misses++;
        }
        // Update previous route metrics
        if (this.currentRoute && this.currentRoute !== route) {
            const metrics = this.metrics.get(this.currentRoute) || {
                visits: 0,
                avgTimeSpent: 0,
                lastVisited: 0,
            };
            metrics.visits++;
            metrics.avgTimeSpent = (metrics.avgTimeSpent * (metrics.visits - 1) + timeSpent) / metrics.visits;
            metrics.lastVisited = now;
            this.metrics.set(this.currentRoute, metrics);
            // Train the Markov model with this transition
            this.predictor.recordTransition(this.currentRoute, route);
        }
        // Update current route
        this.currentRoute = route;
        this.routeStartTime = now;
        // Clear prefetch cache and predict next routes
        this.prefetchedRoutes.clear();
        this.prefetchLikelyRoutes(route);
        // Save metrics and model
        this.saveMetrics();
        this.savePredictor();
    }
    /**
     * Prefetch likely next routes using Markov prediction
     */
    prefetchLikelyRoutes(currentRoute) {
        const networkQuality = getNetworkQuality();
        // Skip prefetching on slow networks
        if (networkQuality === 'slow') {
            return;
        }
        // Get predictions from Markov model
        const predictions = this.predictor.predict(currentRoute, 0.2);
        if (predictions.length === 0) {
            // Fall back to high-priority routes if no predictions available
            this.fallbackPrefetch(currentRoute);
            return;
        }
        runWhenIdle(() => {
            // Prefetch top predictions based on confidence and network quality
            const maxPrefetch = networkQuality === 'fast' ? 3 : 2;
            const topPredictions = predictions.slice(0, maxPrefetch);
            topPredictions.forEach(({ route, confidence }) => {
                this.prefetchRoute(route);
                this.prefetchedRoutes.add(route);
                this.prefetchStats.prefetched++;
            });
        });
    }
    /**
     * Fallback prefetch for critical routes when no model data exists
     */
    fallbackPrefetch(currentRoute) {
        const fallbacks = {
            '/': ['/chat', '/mood'],
            '/chat': ['/mood', '/resources'],
            '/mood': ['/journal', '/analytics'],
            '/crisis': ['/chat', '/resources']
        };
        const routes = fallbacks[currentRoute];
        if (routes) {
            runWhenIdle(() => {
                routes.forEach(route => {
                    this.prefetchRoute(route);
                    this.prefetchedRoutes.add(route);
                });
            });
        }
    }
    /**
     * Prefetch a single route
     */
    prefetchRoute(route) {
        // Note: Removed chunk prefetching as Vite generates dynamic hashed filenames,
        // not static wildcard paths. Pages are lazy-loaded automatically via React.lazy()
        
        // Prefetch route data API endpoint (skip auth-protected endpoints)
        const apiEndpoint = this.getRouteDataEndpoint(route);
        if (apiEndpoint && !this.isProtectedEndpoint(apiEndpoint)) {
            fetch(apiEndpoint, { method: 'HEAD', credentials: 'include' }).catch(() => {
                // Silent fail for prefetch
            });
        }
    }
    /**
     * Check if endpoint requires authentication
     */
    isProtectedEndpoint(endpoint) {
        const protectedEndpoints = [
            '/api/moods',
            '/api/journals',
            '/api/analytics',
            '/api/chat',
            '/api/designs',
        ];
        return protectedEndpoints.includes(endpoint);
    }
    /**
     * Get API endpoint for route data
     */
    getRouteDataEndpoint(route) {
        const endpointMap = {
            '/chat': '/api/chat',
            '/mood': '/api/moods',
            '/journal': '/api/journals',
            '/analytics': '/api/analytics',
            '/resources': '/api/resources',
            '/designs': '/api/designs',
        };
        return endpointMap[route] || null;
    }
    /**
     * Load metrics from localStorage
     */
    loadMetrics() {
        try {
            const stored = localStorage.getItem('route-metrics');
            if (stored) {
                const data = JSON.parse(stored);
                this.metrics = new Map(Object.entries(data));
            }
        }
        catch (error) {
            console.warn('Failed to load route metrics:', error);
        }
    }
    /**
     * Save metrics to localStorage
     */
    saveMetrics() {
        try {
            const data = Object.fromEntries(this.metrics);
            localStorage.setItem('route-metrics', JSON.stringify(data));
        }
        catch (error) {
            console.warn('Failed to save route metrics:', error);
        }
    }
    /**
     * Load Markov predictor from localStorage
     */
    loadPredictor() {
        try {
            const stored = localStorage.getItem('markov-predictor');
            if (stored) {
                const data = JSON.parse(stored);
                this.predictor.import(data);
            }
        }
        catch (error) {
            console.warn('Failed to load predictor:', error);
        }
    }
    /**
     * Save Markov predictor to localStorage
     */
    savePredictor() {
        try {
            const data = this.predictor.export();
            localStorage.setItem('markov-predictor', JSON.stringify(data));
        }
        catch (error) {
            console.warn('Failed to save predictor:', error);
        }
    }
    /**
     * Get route analytics
     */
    getRouteAnalytics() {
        return Array.from(this.metrics.entries()).map(([route, metrics]) => ({
            route,
            visits: metrics.visits,
            avgTimeSpent: Math.round(metrics.avgTimeSpent / 1000), // Convert to seconds
        }));
    }
    /**
     * Get prefetch performance statistics
     */
    getPrefetchStats() {
        const total = this.prefetchStats.hits + this.prefetchStats.misses;
        const hitRate = total > 0 ? this.prefetchStats.hits / total : 0;
        return {
            ...this.prefetchStats,
            hitRate,
            modelStats: this.predictor.getStats()
        };
    }
    /**
     * Get predictions for current route (for debugging)
     */
    getPredictions(route) {
        return this.predictor.predict(route || this.currentRoute, 0.1);
    }
    /**
     * Clear prefetch cache
     */
    clearCache() {
        this.prefetchedRoutes.clear();
    }
    /**
     * Reset predictor model (for testing or reset)
     */
    resetModel() {
        this.predictor = new MarkovPredictor();
        this.metrics.clear();
        this.prefetchStats = { prefetched: 0, hits: 0, misses: 0 };
        localStorage.removeItem('markov-predictor');
        localStorage.removeItem('route-metrics');
    }
}
// Export singleton instance
export const routePrefetcher = new RoutePrefetcher();
