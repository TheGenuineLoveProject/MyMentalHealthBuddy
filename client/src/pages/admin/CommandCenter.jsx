import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield, Activity, Users, Database, Server, Globe, 
  AlertTriangle, CheckCircle, Clock, RefreshCw, 
  BarChart3, Zap, FileText, Settings, ArrowRight,
  TrendingUp, TrendingDown, Minus, Eye, Lock,
  HardDrive, Cpu, Wifi, AlertCircle,
  BookOpen, MessageSquare, Heart, Calendar,
  Megaphone, Mail, Flag, Palette, Search,
  LayoutDashboard, PenTool, Layers, LineChart,
  ShieldCheck, ToggleLeft, Star, ClipboardList
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

function MetricCard({ title, value, subtitle, icon: Icon, color = "sage" }) {
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
        </button>
      </div>
      <div className={styles.servicesList}>
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <div key={i} className={styles.serviceRow} data-testid={`service-${service.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className={styles.serviceInfo}>
                <Icon className={styles.serviceIcon} />
                <span className={styles.serviceName}>{service.name}</span>
              </div>
              <div className={styles.serviceStatus}>
                <span className={styles.serviceLatency}>{service.latency}</span>
                <StatusBadge status={service.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatUptime(seconds) {
  if (!seconds) return "—";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatEventType(type) {
  return (type || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function RecentActivityPanel({ activities }) {
  const activityIcons = {
    social_post_created: PenTool,
    social_post_submitted: Eye,
    social_post_approved: CheckCircle,
    social_post_posted: Megaphone,
    blog_published: BookOpen,
    blog_approved: CheckCircle,
    blog_submitted: FileText,
  };

  if (!activities || activities.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleContainer}>
            <Clock className={styles.cardHeaderIcon} />
            <h2 className={styles.cardTitle}>Recent Activity</h2>
          </div>
        </div>
        <p style={{ padding: '1rem', color: '#888', fontSize: '0.9rem' }} data-testid="text-no-activity">
          No recent publishing activity. Create a blog post or social post to get started.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <Clock className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>Recent Activity</h2>
        </div>
      </div>
      <div className={styles.activityList}>
        {activities.map((item, i) => {
          const Icon = activityIcons[item.type] || FileText;
          return (
            <div key={i} className={styles.activityRow} data-testid={`activity-item-${i}`}>
              <div className={styles.activityIcon}>
                <Icon className={styles.activityIconInner} />
              </div>
              <div className={styles.activityContent}>
                <span className={styles.activityTitle}>{formatEventType(item.type)}</span>
                {item.meta?.postId && (
                  <span className={styles.activitySubtitle}>Post: {item.meta.postId.slice(0, 8)}...</span>
                )}
              </div>
              <span className={styles.activityTime} data-testid={`activity-time-${i}`}>
                {timeAgo(item.createdAt)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminNavGrid() {
  const sections = [
    {
      title: "Publishing & Content",
      items: [
        { label: "Narrative Ops Console", icon: LayoutDashboard, href: "/admin/social/ops", desc: "Pipeline, campaigns, scheduling" },
        { label: "Social Dashboard", icon: Globe, href: "/admin/social", desc: "Social posts overview" },
        { label: "Blog Publishing", icon: BookOpen, href: "/admin/publishing", desc: "Editorial pipeline" },
        { label: "Publishing Today", icon: Calendar, href: "/admin/publishing/today", desc: "Today's publishing queue" },
        { label: "Content Studio", icon: Palette, href: "/admin/social-studio", desc: "Content generation tools" },
        { label: "Social Library", icon: Layers, href: "/admin/social/library", desc: "Approved content library" },
        { label: "Social Calendar", icon: Calendar, href: "/admin/social/calendar", desc: "Visual schedule view" },
        { label: "Narrative Drafts", icon: PenTool, href: "/admin/narrative", desc: "Draft management" },
      ]
    },
    {
      title: "Analytics & Monitoring",
      items: [
        { label: "Analytics Dashboard", icon: BarChart3, href: "/admin/analytics", desc: "Platform analytics" },
        { label: "Social Analytics", icon: LineChart, href: "/admin/social/analytics", desc: "Social performance" },
        { label: "Engagement", icon: Heart, href: "/admin/engagement", desc: "User engagement metrics" },
        { label: "System Health", icon: Activity, href: "/admin/health", desc: "Server & service status" },
      ]
    },
    {
      title: "Management & Security",
      items: [
        { label: "Newsletter", icon: Mail, href: "/admin/newsletter", desc: "Subscriber management" },
        { label: "Roles & Permissions", icon: Users, href: "/admin/roles", desc: "User access control" },
        { label: "Security Dashboard", icon: ShieldCheck, href: "/admin/security", desc: "Security monitoring" },
        { label: "Feature Flags", icon: ToggleLeft, href: "/admin/feature-flags", desc: "Feature toggles" },
        { label: "Audit Log", icon: ClipboardList, href: "/admin/audit-log", desc: "System audit trail" },
        { label: "Billing", icon: BarChart3, href: "/admin/billing", desc: "Revenue & subscriptions" },
        { label: "Feedback", icon: MessageSquare, href: "/admin/feedback", desc: "User feedback aggregator" },
        { label: "System Alerts", icon: AlertTriangle, href: "/admin/alerts", desc: "Alert configuration" },
      ]
    },
  ];

  return (
    <div className={styles.navGridContainer}>
      {sections.map((section, si) => (
        <div key={si} className={styles.navSection}>
          <h3 className={styles.navSectionTitle} data-testid={`nav-section-${si}`}>{section.title}</h3>
          <div className={styles.navGrid}>
            {section.items.map((item, ii) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={ii} 
                  href={item.href} 
                  className={styles.navCard}
                  data-testid={`admin-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className={styles.navCardIcon}>
                    <Icon size={18} />
                  </div>
                  <div className={styles.navCardContent}>
                    <span className={styles.navCardLabel}>{item.label}</span>
                    <span className={styles.navCardDesc}>{item.desc}</span>
                  </div>
                  <ArrowRight size={14} className={styles.navCardArrow} />
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminCommandCenter() {
  useSEO({
    title: "Admin Command Center - The Genuine Love Project",
    description: "Platform administration dashboard with system monitoring, user management, and analytics.",
    noIndex: true
  });

  const { data: healthData, refetch: refetchHealth, isRefetching: isHealthRefetching, isLoading: isHealthLoading, error: healthError } = useQuery({
    queryKey: ['/api/health'],
    retry: false,
    staleTime: 30000,
    refetchInterval: 60000
  });

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['/api/admin/dashboard-stats'],
    retry: false,
    staleTime: 30000,
    refetchInterval: 60000,
    select: (data) => data?.data || data,
  });

  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    if (healthData || statsData) {
      setLastUpdated(new Date());
    }
  }, [healthData, statsData]);

  const handleRefreshAll = () => {
    refetchHealth();
  };

  const stats = statsData || {};

  const metrics = [
    { title: "Users", value: stats.users?.toLocaleString() || "—", icon: Users, color: "sage", subtitle: "Total registered" },
    { title: "Blog Posts", value: stats.blogPosts || "—", icon: BookOpen, color: "gold", subtitle: `${stats.publishedBlogs || 0} published` },
    { title: "Social Posts", value: stats.socialPosts || "—", icon: Megaphone, color: "teal", subtitle: `${stats.socialDrafts || 0} drafts` },
    { title: "Campaigns", value: stats.campaigns || "0", icon: Flag, color: "blush", subtitle: "Active campaigns" },
    { title: "Leads", value: stats.leads || "—", icon: Mail, color: "sage", subtitle: "Newsletter signups" },
    { title: "Uptime", value: formatUptime(stats.uptimeSeconds), icon: Activity, color: "teal", subtitle: "Current session" },
  ];

  if (isHealthLoading && isStatsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <RefreshCw className={styles.loadingSpinner} />
        <p className={styles.loadingText} data-testid="text-loading">Loading admin dashboard...</p>
      </div>
    );
  }

  if (healthError && !statsData) {
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
                Refresh
              </button>
            </div>
          </div>
          <p className={styles.leadText}>Monitor system health, manage content, and track platform performance.</p>
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
          <RecentActivityPanel activities={stats.recentActivity} />
        </div>

        <AdminNavGrid />
      </div>
    </div>
  );
}
