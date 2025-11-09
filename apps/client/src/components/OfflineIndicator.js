import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Offline Indicator
 * Shows connection status and sync queue
 */
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
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
        }
        finally {
            setSyncing(false);
        }
    };
    // Don't show if online and queue is empty
    if (isOnline && queueSize === 0) {
        return null;
    }
    return (_jsx("div", { className: `fixed bottom-4 left-4 z-50 p-3 rounded-lg shadow-lg border ${isOnline
            ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'}`, role: "status", "aria-live": "polite", "data-testid": "offline-indicator", children: _jsxs("div", { className: "flex items-center gap-3", children: [isOnline ? (_jsx(Wifi, { className: "h-5 w-5 text-green-500", "aria-hidden": "true" })) : (_jsx(WifiOff, { className: "h-5 w-5 text-yellow-500", "aria-hidden": "true" })), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-sm", children: isOnline ? 'Online' : 'Offline Mode' }), queueSize > 0 && (_jsxs("p", { className: "text-xs text-muted-foreground", children: [queueSize, " action", queueSize > 1 ? 's' : '', " queued"] }))] }), queueSize > 0 && (_jsx(Badge, { variant: "gray", "data-testid": "badge-queue-size", children: queueSize })), isOnline && queueSize > 0 && (_jsx(Button, { onClick: handleSync, variant: "ghost", size: "sm", disabled: syncing, "data-testid": "button-sync-queue", "aria-label": "Sync queued actions", children: _jsx(RefreshCw, { className: `h-4 w-4 ${syncing ? 'animate-spin' : ''}`, "aria-hidden": "true" }) }))] }) }));
}
