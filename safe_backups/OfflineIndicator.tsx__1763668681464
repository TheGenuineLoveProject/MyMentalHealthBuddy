/**
 * Offline Indicator
 * Shows connection status and sync queue
 */

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useState } from 'react';

export function OfflineIndicator() {
  const { isOnline, queueSize, syncNow, clearQueue } = useOnlineStatus();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncNow();
      console.log('Sync result:', result);
    } finally {
      setSyncing(false);
    }
  };

  // Don't show if online and queue is empty
  if (isOnline && queueSize === 0) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 p-3 rounded-lg shadow-lg border ${
        isOnline
          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      }`}
      role="status"
      aria-live="polite"
      data-testid="offline-indicator"
    >
      <div className="flex items-center gap-3">
        {/* Status Icon */}
        {isOnline ? (
          <Wifi className="h-5 w-5 text-green-500" aria-hidden="true" />
        ) : (
          <WifiOff className="h-5 w-5 text-yellow-500" aria-hidden="true" />
        )}

        {/* Status Text */}
        <div className="flex-1">
          <p className="font-medium text-sm">
            {isOnline ? 'Online' : 'Offline Mode'}
          </p>
          {queueSize > 0 && (
            <p className="text-xs text-muted-foreground">
              {queueSize} action{queueSize > 1 ? 's' : ''} queued
            </p>
          )}
        </div>

        {/* Queue Badge */}
        {queueSize > 0 && (
          <Badge variant="gray" data-testid="badge-queue-size">
            {queueSize}
          </Badge>
        )}

        {/* Sync Button (only when online with queue) */}
        {isOnline && queueSize > 0 && (
          <Button
            onClick={handleSync}
            variant="ghost"
            size="sm"
            disabled={syncing}
            data-testid="button-sync-queue"
            aria-label="Sync queued actions"
          >
            <RefreshCw
              className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
          </Button>
        )}
      </div>
    </div>
  );
}
