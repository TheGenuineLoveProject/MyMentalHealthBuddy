import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Bell, X, Check, Info, AlertCircle, TrendingUp } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

/**
 * Comprehensive Notification System
 * Real-time alerts, activity feed, and action items
 */
export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
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
      actionUrl: '/social-calendar'
    }
  ]);

  const [showPanel, setShowPanel] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <Check className="h-5 w-5 text-green-600" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPanel(!showPanel)}
          className="relative"
          data-testid="button-notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="danger"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              data-testid="badge-unread-count"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>

        {/* Notification Panel */}
        {showPanel && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowPanel(false)}
            />

            {/* Panel */}
            <div
              className="absolute right-0 top-12 w-96 max-h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border z-50 overflow-hidden"
              data-testid="panel-notifications"
            >
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between bg-muted/50">
                <div>
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    {unreadCount} unread
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    data-testid="button-mark-all-read"
                  >
                    Mark all read
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPanel(false)}
                    data-testid="button-close-panel"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[500px]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-muted/50 transition-colors ${
                          !notification.read ? 'bg-blue-50 dark:bg-blue-950' : ''
                        }`}
                        data-testid={`notification-${notification.id}`}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-medium text-sm">
                                {notification.title}
                              </h4>
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="text-muted-foreground hover:text-foreground"
                                data-testid={`button-remove-${notification.id}`}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              
                              <div className="flex gap-2">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-6 text-xs"
                                    data-testid={`button-read-${notification.id}`}
                                  >
                                    Mark read
                                  </Button>
                                )}
                                {notification.actionLabel && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (notification.actionUrl) {
                                        window.location.href = notification.actionUrl;
                                      }
                                    }}
                                    className="h-6 text-xs"
                                    data-testid={`button-action-${notification.id}`}
                                  >
                                    {notification.actionLabel}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t bg-muted/50 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  data-testid="button-view-all"
                >
                  View all notifications
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
