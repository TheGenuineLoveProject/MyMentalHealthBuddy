import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Bell, X, Check, Info, AlertCircle } from 'lucide-react';
/**
 * Comprehensive Notification System
 * Real-time alerts, activity feed, and action items
 */
export function NotificationSystem() {
    const [notifications, setNotifications] = useState([
        {
            id: '1',
            type: 'success',
            title: 'Content Published',
            message: 'Your article "Understanding Anxiety" has been published successfully',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            read: false,
            actionLabel: 'View Article',
            actionUrl: '/studio'
        },
        {
            id: '2',
            type: 'info',
            title: 'New Analytics Available',
            message: 'Your weekly performance report is ready',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            read: false,
            actionLabel: 'View Report',
            actionUrl: '/analytics'
        },
        {
            id: '3',
            type: 'warning',
            title: 'Upcoming Post',
            message: 'You have 3 posts scheduled for tomorrow',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: true,
            actionLabel: 'Review Schedule',
            actionUrl: '/social'
        }
    ]);
    const [showPanel, setShowPanel] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;
    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };
    const getIcon = (type) => {
        switch (type) {
            case 'success': return _jsx(Check, { className: "h-5 w-5 text-green-600" });
            case 'error': return _jsx(AlertCircle, { className: "h-5 w-5 text-red-600" });
            case 'warning': return _jsx(AlertCircle, { className: "h-5 w-5 text-yellow-600" });
            default: return _jsx(Info, { className: "h-5 w-5 text-blue-600" });
        }
    };
    const formatTimestamp = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (minutes < 1)
            return 'Just now';
        if (minutes < 60)
            return `${minutes}m ago`;
        if (hours < 24)
            return `${hours}h ago`;
        return `${days}d ago`;
    };
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "relative", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setShowPanel(!showPanel), className: "relative", "data-testid": "button-notifications", children: [_jsx(Bell, { className: "h-5 w-5" }), unreadCount > 0 && (_jsx(Badge, { variant: "danger", className: "absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs", "data-testid": "badge-unread-count", children: unreadCount }))] }), showPanel && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-40", onClick: () => setShowPanel(false) }), _jsxs("div", { className: "absolute right-0 top-12 w-96 max-h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border z-50 overflow-hidden", "data-testid": "panel-notifications", children: [_jsxs("div", { className: "p-4 border-b flex items-center justify-between bg-muted/50", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: "Notifications" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [unreadCount, " unread"] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: markAllAsRead, disabled: unreadCount === 0, "data-testid": "button-mark-all-read", children: "Mark all read" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowPanel(false), "data-testid": "button-close-panel", children: _jsx(X, { className: "h-4 w-4" }) })] })] }), _jsx("div", { className: "overflow-y-auto max-h-[500px]", children: notifications.length === 0 ? (_jsxs("div", { className: "p-8 text-center text-muted-foreground", children: [_jsx(Bell, { className: "h-12 w-12 mx-auto mb-3 opacity-20" }), _jsx("p", { children: "No notifications yet" })] })) : (_jsx("div", { className: "divide-y", children: notifications.map(notification => (_jsx("div", { className: `p-4 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-blue-50 dark:bg-blue-950' : ''}`, "data-testid": `notification-${notification.id}`, children: _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "flex-shrink-0 mt-1", children: getIcon(notification.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-2 mb-1", children: [_jsx("h4", { className: "font-medium text-sm", children: notification.title }), _jsx("button", { onClick: () => removeNotification(notification.id), className: "text-muted-foreground hover:text-foreground", "data-testid": `button-remove-${notification.id}`, children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsx("p", { className: "text-sm text-muted-foreground mb-2", children: notification.message }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: formatTimestamp(notification.timestamp) }), _jsxs("div", { className: "flex gap-2", children: [!notification.read && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => markAsRead(notification.id), className: "h-6 text-xs", "data-testid": `button-read-${notification.id}`, children: "Mark read" })), notification.actionLabel && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                                                                                    if (notification.actionUrl) {
                                                                                        window.location.href = notification.actionUrl;
                                                                                    }
                                                                                }, className: "h-6 text-xs", "data-testid": `button-action-${notification.id}`, children: notification.actionLabel }))] })] })] })] }) }, notification.id))) })) }), _jsx("div", { className: "p-3 border-t bg-muted/50 text-center", children: _jsx(Button, { variant: "ghost", size: "sm", className: "text-xs", "data-testid": "button-view-all", children: "View all notifications" }) })] })] }))] }) }));
}
