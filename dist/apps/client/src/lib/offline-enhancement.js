/**
 * Enhanced Offline Support System
 * Advanced service worker integration, background sync, and conflict resolution
 */
/**
 * Background Sync Manager
 */
export class BackgroundSyncManager {
    syncQueue = new Map();
    processing = false;
    syncInterval;
    constructor() {
        this.loadQueue();
        this.startAutoSync();
        this.registerServiceWorkerSync();
    }
    /**
     * Add item to sync queue
     */
    enqueue(item) {
        const queueItem = {
            ...item,
            id: this.generateId(),
            timestamp: Date.now(),
            retryCount: 0
        };
        this.syncQueue.set(queueItem.id, queueItem);
        this.saveQueue();
        // Try immediate sync if online
        if (navigator.onLine) {
            this.processQueue();
        }
    }
    /**
     * Process sync queue
     */
    async processQueue() {
        if (this.processing || this.syncQueue.size === 0) {
            return;
        }
        this.processing = true;
        // Sort by priority and timestamp
        const items = Array.from(this.syncQueue.values()).sort((a, b) => {
            const priorityOrder = { high: 0, normal: 1, low: 2 };
            const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
            return priorityDiff || a.timestamp - b.timestamp;
        });
        for (const item of items) {
            try {
                await this.syncItem(item);
                this.syncQueue.delete(item.id);
            }
            catch (error) {
                item.retryCount++;
                if (item.retryCount >= item.maxRetries) {
                    console.error(`Max retries reached for sync item ${item.id}:`, error);
                    this.syncQueue.delete(item.id);
                    // Notify user of failure
                    this.notifyError(item, error instanceof Error ? error.message : 'Sync failed');
                }
            }
        }
        this.saveQueue();
        this.processing = false;
    }
    /**
     * Sync single item
     */
    async syncItem(item) {
        const endpoint = this.getEndpoint(item.resource);
        let response;
        switch (item.type) {
            case 'CREATE':
                response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item.data)
                });
                break;
            case 'UPDATE':
                response = await fetch(`${endpoint}/${item.data.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item.data)
                });
                break;
            case 'DELETE':
                response = await fetch(`${endpoint}/${item.data.id}`, {
                    method: 'DELETE'
                });
                break;
        }
        if (!response.ok) {
            throw new Error(`Sync failed: ${response.statusText}`);
        }
    }
    /**
     * Get API endpoint for resource
     */
    getEndpoint(resource) {
        const baseUrl = '/api';
        const endpoints = {
            'journals': `${baseUrl}/journals`,
            'moods': `${baseUrl}/moods`,
            'conversations': `${baseUrl}/conversations`,
            'designs': `${baseUrl}/designs`
        };
        return endpoints[resource] || `${baseUrl}/${resource}`;
    }
    /**
     * Start automatic sync
     */
    startAutoSync() {
        // Try to sync every 30 seconds when online
        this.syncInterval = setInterval(() => {
            if (navigator.onLine) {
                this.processQueue();
            }
        }, 30000);
        // Also sync when coming back online
        window.addEventListener('online', () => {
            this.processQueue();
        });
    }
    /**
     * Register service worker background sync
     */
    registerServiceWorkerSync() {
        // Guard against browsers without service worker support
        if ('serviceWorker' in navigator &&
            typeof window !== 'undefined' &&
            'ServiceWorkerRegistration' in window &&
            window.ServiceWorkerRegistration.prototype &&
            'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                // Register background sync
                registration.sync.register('sync-queue').catch((err) => {
                    console.warn('Background sync registration failed:', err);
                });
            }).catch(() => {
                // Silent fail if service worker not available
            });
        }
    }
    /**
     * Notify error
     */
    notifyError(item, message) {
        // In real implementation, show user notification
        console.error(`Sync error for ${item.resource}:`, message);
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('sync-error', {
            detail: { item, message }
        }));
    }
    /**
     * Get queue status
     */
    getStatus() {
        const items = Array.from(this.syncQueue.values());
        return {
            total: items.length,
            pending: items.filter(i => i.retryCount === 0).length,
            highPriority: items.filter(i => i.priority === 'high').length
        };
    }
    /**
     * Clear queue
     */
    clear() {
        this.syncQueue.clear();
        this.saveQueue();
    }
    /**
     * Load queue from storage
     */
    loadQueue() {
        try {
            const stored = localStorage.getItem('sync-queue');
            if (stored) {
                const items = JSON.parse(stored);
                items.forEach(item => this.syncQueue.set(item.id, item));
            }
        }
        catch (error) {
            console.warn('Failed to load sync queue:', error);
        }
    }
    /**
     * Save queue to storage
     */
    saveQueue() {
        try {
            const items = Array.from(this.syncQueue.values());
            localStorage.setItem('sync-queue', JSON.stringify(items));
        }
        catch (error) {
            console.warn('Failed to save sync queue:', error);
        }
    }
    /**
     * Generate unique ID
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Cleanup
     */
    destroy() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
    }
}
/**
 * Conflict Resolution Manager
 */
export class ConflictResolver {
    /**
     * Detect conflicts between local and remote data
     */
    detectConflict(local, remote) {
        // If timestamps are available, use them
        if (local.updatedAt && remote.updatedAt) {
            return new Date(local.updatedAt).getTime() !== new Date(remote.updatedAt).getTime();
        }
        // Otherwise, do deep comparison
        return JSON.stringify(local) !== JSON.stringify(remote);
    }
    /**
     * Resolve conflict using specified strategy
     */
    resolve(local, remote, strategy = 'remote-wins') {
        switch (strategy) {
            case 'local-wins':
                return local;
            case 'remote-wins':
                return remote;
            case 'merge':
                return this.mergeData(local, remote);
            case 'manual':
                // Return both for manual resolution
                return { local, remote };
            default:
                return remote;
        }
    }
    /**
     * Merge local and remote data intelligently
     */
    mergeData(local, remote) {
        const merged = { ...remote };
        // Merge strategies for specific fields
        for (const key in local) {
            if (local[key] && remote[key]) {
                // For arrays, merge unique items
                if (Array.isArray(local[key]) && Array.isArray(remote[key])) {
                    merged[key] = [...new Set([...local[key], ...remote[key]])];
                }
                // For objects, recursively merge
                else if (typeof local[key] === 'object' && typeof remote[key] === 'object') {
                    merged[key] = this.mergeData(local[key], remote[key]);
                }
                // For primitives, prefer newer (remote in this case)
                else {
                    merged[key] = remote[key];
                }
            }
            else if (local[key] && !remote[key]) {
                // If only exists locally, keep it
                merged[key] = local[key];
            }
        }
        return merged;
    }
    /**
     * Get conflict resolution options
     */
    getResolutionOptions(local, remote) {
        return [
            {
                strategy: 'remote-wins',
                label: 'Use Server Version',
                description: 'Discard local changes and use the version from the server',
                preview: remote
            },
            {
                strategy: 'local-wins',
                label: 'Keep Local Version',
                description: 'Keep your local changes and overwrite the server version',
                preview: local
            },
            {
                strategy: 'merge',
                label: 'Merge Both',
                description: 'Intelligently combine both versions',
                preview: this.mergeData(local, remote)
            },
            {
                strategy: 'manual',
                label: 'Review Manually',
                description: 'Review differences and choose what to keep',
                preview: { local, remote }
            }
        ];
    }
}
/**
 * Offline Status Monitor
 */
export class OfflineStatusMonitor {
    online = navigator.onLine;
    listeners = new Set();
    reconnectAttempts = 0;
    maxReconnectAttempts = 5;
    reconnectDelay = 5000;
    constructor() {
        this.attachListeners();
    }
    /**
     * Attach network event listeners
     */
    attachListeners() {
        window.addEventListener('online', () => {
            this.online = true;
            this.reconnectAttempts = 0;
            this.notifyListeners();
            this.onOnline();
        });
        window.addEventListener('offline', () => {
            this.online = false;
            this.notifyListeners();
            this.onOffline();
        });
    }
    /**
     * Add status change listener
     */
    addListener(callback) {
        this.listeners.add(callback);
    }
    /**
     * Remove status change listener
     */
    removeListener(callback) {
        this.listeners.delete(callback);
    }
    /**
     * Notify all listeners
     */
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.online));
    }
    /**
     * Handle coming online
     */
    onOnline() {
        console.log('✅ Connection restored');
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('connection-restored'));
        // Show notification
        this.showNotification('Connection Restored', 'You\'re back online!');
    }
    /**
     * Handle going offline
     */
    onOffline() {
        console.warn('⚠️ Connection lost');
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('connection-lost'));
        // Show notification
        this.showNotification('Offline Mode', 'You\'re working offline. Changes will sync when you\'re back online.');
        // Start reconnect attempts
        this.attemptReconnect();
    }
    /**
     * Attempt to reconnect
     */
    attemptReconnect() {
        if (this.online || this.reconnectAttempts >= this.maxReconnectAttempts) {
            return;
        }
        this.reconnectAttempts++;
        setTimeout(async () => {
            try {
                // Try to ping server
                const response = await fetch('/api/health', {
                    method: 'HEAD',
                    cache: 'no-cache'
                });
                if (response.ok) {
                    // Manually trigger online event
                    window.dispatchEvent(new Event('online'));
                }
                else {
                    this.attemptReconnect();
                }
            }
            catch {
                this.attemptReconnect();
            }
        }, this.reconnectDelay * this.reconnectAttempts);
    }
    /**
     * Check if currently online
     */
    isOnline() {
        return this.online;
    }
    /**
     * Show notification
     */
    showNotification(title, message) {
        // In real implementation, this would show a toast notification
        console.log(`[${title}] ${message}`);
        // Dispatch custom event for notification system
        window.dispatchEvent(new CustomEvent('show-notification', {
            detail: { title, message }
        }));
    }
}
/**
 * Offline Data Cache
 */
export class OfflineDataCache {
    cache = new Map();
    /**
     * Store data in offline cache
     */
    set(key, data, ttl = 3600000) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
        this.saveToStorage();
    }
    /**
     * Get data from offline cache
     */
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }
        // Check if expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            this.saveToStorage();
            return null;
        }
        return entry.data;
    }
    /**
     * Remove data from cache
     */
    remove(key) {
        this.cache.delete(key);
        this.saveToStorage();
    }
    /**
     * Clear all cached data
     */
    clear() {
        this.cache.clear();
        localStorage.removeItem('offline-data-cache');
    }
    /**
     * Load cache from storage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('offline-data-cache');
            if (stored) {
                const entries = JSON.parse(stored);
                for (const [key, value] of Object.entries(entries)) {
                    this.cache.set(key, value);
                }
            }
        }
        catch (error) {
            console.warn('Failed to load offline cache:', error);
        }
    }
    /**
     * Save cache to storage
     */
    saveToStorage() {
        try {
            const entries = Object.fromEntries(this.cache);
            localStorage.setItem('offline-data-cache', JSON.stringify(entries));
        }
        catch (error) {
            console.warn('Failed to save offline cache:', error);
        }
    }
}
// Export singleton instances
export const backgroundSync = new BackgroundSyncManager();
export const conflictResolver = new ConflictResolver();
export const offlineMonitor = new OfflineStatusMonitor();
export const offlineCache = new OfflineDataCache();
