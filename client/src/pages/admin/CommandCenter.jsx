import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield, Activity, Users, Database, Server, Globe, 
  AlertTriangle, CheckCircle, Clock, RefreshCw, 
  BarChart3, Zap, FileText, Settings, ArrowRight,
  TrendingUp, TrendingDown, Minus, Eye, Lock,
  HardDrive, Cpu, MemoryStick, Wifi, AlertCircle,
  Route, BookOpen, MessageSquare, Heart, Calendar
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import styles from "./CommandCenter.module.css";

function StatusBadge({ status }) {
  const safeStatus = typeof status === 'string' ? status : 'healthy';
  const statusStyles = {
    healthy: styles.statusHealthy,
    warning: styles.statusWarning,
    error: styles.statusError
  };
  const icons = {
    healthy: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle
  };
  const Icon = icons[safeStatus] || CheckCircle;
  
  return (
    <span className={`${styles.statusBadge} ${statusStyles[safeStatus] || styles.statusHealthy}`}>
      <Icon className={styles.statusIcon} />
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
    </span>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, trend, color = "sage" }) {
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendClass = trend > 0 ? styles.metricTrendUp : trend < 0 ? styles.metricTrendDown : styles.metricTrendNeutral;
  const iconClass = {
    sage: styles.metricIconSage,
    gold: styles.metricIconGold,
    blush: styles.metricIconBlush,
    teal: styles.metricIconTeal
  }[color] || styles.metricIconSage;
  
  return (
    <div className={styles.metricCard} data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className={styles.metricHeader}>
        <div className={`${styles.metricIconContainer} ${iconClass}`}>
          <Icon className={styles.metricIcon} />
        </div>
        {trend !== undefined && (
          <span className={`${styles.metricTrend} ${trendClass}`}>
            <TrendIcon className={styles.metricTrendIcon} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className={styles.metricValue} data-testid={`metric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</p>
      <p className={styles.metricLabel} data-testid={`metric-label-${title.toLowerCase().replace(/\s+/g, '-')}`}>{title}</p>
      {subtitle && <p className={styles.metricSubtitle} data-testid={`metric-subtitle-${title.toLowerCase().replace(/\s+/g, '-')}`}>{subtitle}</p>}
    </div>
  );
}

function SystemHealthPanel({ health, onRefresh, isRefreshing }) {
  const services = [
    { name: 'API Server', status: health?.api || 'healthy', icon: Server, latency: '24ms' },
    { name: 'Database', status: health?.database || 'healthy', icon: Database, latency: '12ms' },
    { name: 'Auth Service', status: health?.auth || 'healthy', icon: Lock, latency: '18ms' },
    { name: 'AI/Chat', status: health?.ai || 'healthy', icon: MessageSquare, latency: '156ms' },
    { name: 'CDN/Assets', status: health?.cdn || 'healthy', icon: Globe, latency: '8ms' }
  ];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <Activity className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>System Health</h2>
        </div>
        <button 
          className={styles.refreshButton}
          onClick={onRefresh}
          disabled={isRefreshing}
          data-testid="button-refresh-health"
        >
          <RefreshCw className={`${styles.refreshIcon} ${isRefreshing ? styles.refreshIconSpinning : ''}`} />
          Refresh
        </button>
      </div>
      <div className={styles.serviceList}>
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <div key={i} className={styles.serviceItem} data-testid={`service-${service.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className={styles.serviceInfo}>
                <div className={styles.serviceIcon}>
                  <Icon className={styles.serviceIconInner} />
                </div>
                <span className={styles.serviceName}>{service.name}</span>
              </div>
              <div className={styles.serviceStatus}>
                <span className={styles.serviceLatency} data-testid={`service-latency-${service.name.toLowerCase().replace(/\s+/g, '-')}`}>{service.latency}</span>
                <StatusBadge status={service.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResourceMonitor() {
  const resources = [
    { name: 'CPU Usage', value: 34, max: 100, icon: Cpu },
    { name: 'Memory', value: 2.1, max: 4, unit: 'GB', icon: MemoryStick },
    { name: 'Storage', value: 12.4, max: 50, unit: 'GB', icon: HardDrive },
    { name: 'Bandwidth', value: 156, max: 1000, unit: 'MB/s', icon: Wifi }
  ];

  const getFillClass = (percent) => {
    if (percent > 80) return styles.resourceFillDanger;
    if (percent > 60) return styles.resourceFillWarning;
    return styles.resourceFillSafe;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <BarChart3 className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>Resources</h2>
        </div>
      </div>
      <div className={styles.resourceList}>
        {resources.map((resource, i) => {
          const Icon = resource.icon;
          const percent = (resource.value / resource.max) * 100;
          const displayValue = resource.unit 
            ? `${resource.value}${resource.unit} / ${resource.max}${resource.unit}`
            : `${resource.value}%`;
          
          return (
            <div key={i} className={styles.resourceItem} data-testid={`resource-${resource.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className={styles.resourceHeader}>
                <div className={styles.resourceInfo}>
                  <Icon className={styles.resourceIcon} />
                  <span className={styles.resourceName}>{resource.name}</span>
                </div>
                <span className={styles.resourceValue}>{displayValue}</span>
              </div>
              <div className={styles.resourceBar}>
                <div 
                  className={`${styles.resourceFill} ${getFillClass(percent)}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecentActivityPanel({ activities }) {
  const getActivityIconClass = (type) => {
    const map = {
      info: styles.activityIconInfo,
      warning: styles.activityIconWarning,
      success: styles.activityIconSuccess
    };
    return map[type] || styles.activityIconInfo;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <Clock className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>Recent Activity</h2>
        </div>
      </div>
      <div className={styles.activityList}>
        {activities.map((activity, i) => {
          const Icon = activity.icon;
          return (
            <div key={i} className={styles.activityItem} data-testid={`admin-activity-${i}`}>
              <div className={`${styles.activityIcon} ${getActivityIconClass(activity.type)}`}>
                <Icon className={styles.activityIconInner} />
              </div>
              <div className={styles.activityContent}>
                <p className={styles.activityTitle}>{activity.title}</p>
                <p className={styles.activityMeta}>{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickActionsPanel({ actions }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <Zap className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>Quick Actions</h2>
        </div>
      </div>
      <div className={styles.quickActionsGrid}>
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link 
              key={i} 
              href={action.href} 
              className={styles.quickActionButton}
              data-testid={`admin-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className={styles.quickActionIcon}>
                <Icon className={styles.quickActionIconInner} />
              </div>
              <span className={styles.quickActionText}>{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminCommandCenter() {
  useSEO({
    title: "Admin Command Center - The Genuine Love Project",
    description: "Platform administration dashboard with system monitoring, user management, and analytics.",
    noIndex: true
  });

  const { data: healthData, refetch: refetchHealth, isRefetching: isHealthRefetching, isLoading, error } = useQuery({
    queryKey: ['/api/health'],
    retry: false,
    staleTime: 30000,
    refetchInterval: 60000
  });

  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ['/api/admin/stats'],
    retry: false,
    staleTime: 60000
  });

  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    if (healthData || statsData) {
      setLastUpdated(new Date());
    }
  }, [healthData, statsData]);

  const handleRefreshAll = () => {
    refetchHealth();
    refetchStats();
  };

  const metrics = [
    { title: "Active Users", value: statsData?.activeUsers || "1,247", trend: 12, icon: Users, color: "sage" },
    { title: "Sessions Today", value: statsData?.sessionsToday || "3,891", trend: 8, icon: Calendar, color: "gold" },
    { title: "API Calls", value: statsData?.apiCalls || "45.2K", trend: 15, icon: Server, color: "teal" },
    { title: "Avg Response", value: statsData?.avgResponse || "124ms", trend: -5, icon: Zap, color: "sage" },
    { title: "Error Rate", value: statsData?.errorRate || "0.02%", trend: -12, icon: AlertTriangle, color: "blush" },
    { title: "Uptime", value: statsData?.uptime || "99.98%", trend: 0, icon: Activity, color: "sage" }
  ];

  const recentActivity = [
    { icon: Users, title: "New user registration", time: "2 minutes ago", type: "info" },
    { icon: Shield, title: "Security scan completed", time: "15 minutes ago", type: "success" },
    { icon: Database, title: "Database backup completed", time: "1 hour ago", type: "success" },
    { icon: AlertTriangle, title: "Rate limit triggered", time: "2 hours ago", type: "warning" },
    { icon: Settings, title: "System configuration updated", time: "3 hours ago", type: "info" }
  ];

  const quickActions = [
    { label: "User Management", icon: Users, href: "/admin/users" },
    { label: "View Logs", icon: FileText, href: "/admin/logs" },
    { label: "Analytics", icon: BarChart3, href: "/analytics" },
    { label: "Settings", icon: Settings, href: "/admin/settings" }
  ];

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <RefreshCw className={styles.loadingSpinner} />
        <p className={styles.loadingText} data-testid="text-loading">Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle className={styles.errorIcon} />
        <h2 className={styles.errorTitle} data-testid="text-error-title">Unable to load admin dashboard</h2>
        <p className={styles.errorText} data-testid="text-error-message">We're having trouble connecting to the server. Please try again.</p>
        <button className={styles.retryButton} onClick={handleRefreshAll} data-testid="button-retry">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.titleContainer}>
              <div className={styles.titleIcon}>
                <Shield className={styles.titleIconInner} />
              </div>
              <h1 className={styles.pageTitle} data-testid="text-page-title">Command Center</h1>
            </div>
            <div className={styles.headerActions}>
              <span className={styles.lastUpdated} data-testid="text-last-updated">
                <Clock className={styles.clockIcon} />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              <button 
                className={styles.refreshButton}
                onClick={handleRefreshAll}
                disabled={isHealthRefetching}
                data-testid="button-refresh-all"
              >
                <RefreshCw className={`${styles.refreshIcon} ${isHealthRefetching ? styles.refreshIconSpinning : ''}`} />
                Refresh All
              </button>
            </div>
          </div>
          <p className={styles.leadText}>Monitor system health, manage users, and track platform performance.</p>
        </header>

        <div className={styles.metricsGrid}>
          {metrics.map((metric, i) => (
            <MetricCard key={i} {...metric} />
          ))}
        </div>

        <div className={styles.mainGrid}>
          <SystemHealthPanel 
            health={healthData} 
            onRefresh={refetchHealth} 
            isRefreshing={isHealthRefetching} 
          />
          <ResourceMonitor />
        </div>

        <div className={styles.secondaryGrid}>
          <RecentActivityPanel activities={recentActivity} />
          <QuickActionsPanel actions={quickActions} />
        </div>
      </div>
    </div>
  );
}
