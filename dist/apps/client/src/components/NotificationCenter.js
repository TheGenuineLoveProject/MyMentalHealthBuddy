import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Notification Center
 * Centralized notification hub with history and preferences
 */
import { useState } from 'react';
import { Bell, X, Check, Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
export function NotificationCenter({ notifications, onMarkAsRead, onMarkAllAsRead, onDelete, onClearAll, }) {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const unreadCount = notifications.filter(n => !n.read).length;
    const filteredNotifications = notifications.filter(n => filter === 'all' || !n.read);
    const getIcon = (type) => {
        switch (type) {
            case 'info':
                return _jsx(Info, { className: "h-5 w-5 text-blue-500", "aria-hidden": "true" });
            case 'success':
                return _jsx(CheckCircle, { className: "h-5 w-5 text-green-500", "aria-hidden": "true" });
            case 'warning':
                return _jsx(AlertCircle, { className: "h-5 w-5 text-yellow-500", "aria-hidden": "true" });
            case 'error':
                return _jsx(XCircle, { className: "h-5 w-5 text-red-500", "aria-hidden": "true" });
        }
    };
    const formatTime = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 1)
            return 'Just now';
        if (minutes < 60)
            return `${minutes}m ago`;
        if (hours < 24)
            return `${hours}h ago`;
        return `${days}d ago`;
    };
    return (_jsxs("div", { className: "relative", "data-testid": "notification-center", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setIsOpen(!isOpen), className: "relative", "data-testid": "button-notifications", "aria-label": `Notifications. ${unreadCount} unread`, "aria-expanded": isOpen, "aria-haspopup": "dialog", children: [_jsx(Bell, { className: "h-5 w-5", "aria-hidden": "true" }), unreadCount > 0 && (_jsx(Badge, { variant: "danger", className: "absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs", "data-testid": "badge-unread-count", "aria-label": `${unreadCount} unread notifications`, children: unreadCount > 9 ? '9+' : unreadCount }))] }), isOpen && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-40", onClick: () => setIsOpen(false), "aria-hidden": "true" }), _jsxs("div", { className: "absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-xl border z-50 max-h-[600px] flex flex-col", role: "dialog", "aria-label": "Notifications", "aria-modal": "false", "data-testid": "panel-notifications", children: [_jsxs("div", { className: "p-4 border-b flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "font-semibold text-lg", children: "Notifications" }), unreadCount > 0 && (_jsx(Badge, { variant: "gray", "data-testid": "text-unread-total", children: unreadCount }))] }), _jsxs("div", { className: "flex gap-2", children: [unreadCount > 0 && (_jsx(Button, { variant: "ghost", size: "sm", onClick: onMarkAllAsRead, "data-testid": "button-mark-all-read", "aria-label": "Mark all as read", children: _jsx(Check, { className: "h-4 w-4", "aria-hidden": "true" }) })), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsOpen(false), "data-testid": "button-close-notifications", "aria-label": "Close notifications", children: _jsx(X, { className: "h-4 w-4", "aria-hidden": "true" }) })] })] }), _jsxs("div", { className: "p-2 border-b flex gap-2", children: [_jsxs(Button, { variant: filter === 'all' ? 'primary' : 'ghost', size: "sm", onClick: () => setFilter('all'), "data-testid": "button-filter-all", "aria-pressed": filter === 'all', children: ["All (", notifications.length, ")"] }), _jsxs(Button, { variant: filter === 'unread' ? 'primary' : 'ghost', size: "sm", onClick: () => setFilter('unread'), "data-testid": "button-filter-unread", "aria-pressed": filter === 'unread', children: ["Unread (", unreadCount, ")"] })] }), _jsx("div", { className: "flex-1 overflow-y-auto", role: "list", children: filteredNotifications.length === 0 ? (_jsxs("div", { className: "p-8 text-center text-muted-foreground", role: "listitem", children: [_jsx(Bell, { className: "h-12 w-12 mx-auto mb-2 opacity-50", "aria-hidden": "true" }), _jsx("p", { children: "No notifications" })] })) : (filteredNotifications.map((notification) => (_jsx("div", { className: `p-4 border-b hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`, role: "listitem", "data-testid": `notification-${notification.id}`, "aria-label": `${notification.type} notification: ${notification.title}`, children: _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "flex-shrink-0 mt-1", children: getIcon(notification.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("h4", { className: "font-medium text-sm", children: notification.title }), !notification.read && (_jsx("div", { className: "h-2 w-2 bg-blue-500 rounded-full flex-shrink-0", "aria-label": "Unread" }))] }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: notification.message }), _jsxs("div", { className: "flex items-center gap-3 mt-2", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: formatTime(notification.timestamp) }), notification.actionLabel && (_jsx(Button, { variant: "ghost", size: "sm", className: "h-auto p-0 text-xs", "data-testid": `button-action-${notification.id}`, onClick: () => {
                                                                    if (notification.actionUrl) {
                                                                        window.location.href = notification.actionUrl;
                                                                    }
                                                                }, children: notification.actionLabel }))] })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [!notification.read && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => onMarkAsRead(notification.id), className: "h-8 w-8 p-0", "data-testid": `button-mark-read-${notification.id}`, "aria-label": "Mark as read", children: _jsx(Check, { className: "h-4 w-4", "aria-hidden": "true" }) })), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => onDelete(notification.id), className: "h-8 w-8 p-0", "data-testid": `button-delete-${notification.id}`, "aria-label": "Delete notification", children: _jsx(X, { className: "h-4 w-4", "aria-hidden": "true" }) })] })] }) }, notification.id)))) }), notifications.length > 0 && (_jsx("div", { className: "p-3 border-t", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: onClearAll, className: "w-full", "data-testid": "button-clear-all", "aria-label": "Clear all notifications", children: "Clear All" }) }))] })] }))] }));
}
/**
 * Hook for managing notifications
 */
export function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const addNotification = (notification) => {
        const newNotification = {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };
    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    };
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };
    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };
    const clearAll = () => {
        setNotifications([]);
    };
    return {
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
    };
}
