/**
 * Online Status Hook
 * Track online/offline status and sync state
 */
import { useState, useEffect } from 'react';
import { offlineManager } from '@/lib/offlineManager';
export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(offlineManager.getOnlineStatus());
    const [queueSize, setQueueSize] = useState(offlineManager.getQueueSize());
    useEffect(() => {
        // Subscribe to online status changes
        const unsubscribe = offlineManager.subscribe((online) => {
            setIsOnline(online);
            setQueueSize(offlineManager.getQueueSize());
        });
        // Update queue size periodically
        const interval = setInterval(() => {
            setQueueSize(offlineManager.getQueueSize());
        }, 1000);
        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, []);
    const syncNow = async () => {
        return await offlineManager.syncQueue();
    };
    const clearQueue = () => {
        offlineManager.clearQueue();
        setQueueSize(0);
    };
    return {
        isOnline,
        queueSize,
        syncNow,
        clearQueue,
    };
}
