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
import { Button } from "@/components/ui/Button";
import { useSEO } from "@/hooks/useSEO";

function StatusBadge({ status }) {
  const styles = {
    healthy: { bg: 'var(--glp-sage-10)', color: 'var(--glp-sage)', icon: CheckCircle },
    warning: { bg: 'var(--glp-gold-30)', color: 'var(--glp-gold-deep)', icon: AlertTriangle },
    error: { bg: 'var(--glp-rose-15)', color: 'var(--glp-rose)', icon: AlertCircle },
    unknown: { bg: 'var(--glp-sage-10)', color: 'var(--glp-sage)', icon: Minus }
  };
  const style = styles[status] || styles.unknown;
  const Icon = style.icon;
  
  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
      style={{ background: style.bg, color: style.color }}
    >
      <Icon className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, trend, color = "sage" }) {
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'var(--glp-sage)' : trend < 0 ? 'var(--glp-rose)' : 'var(--glp-sage)';
  
  return (
    <div className="card-bordered" data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`icon-container icon-md icon-soft-${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend !== undefined && (
          <span className="flex items-center gap-1 text-xs" style={{ color: trendColor }}>
            <TrendIcon className="h-3 w-3" />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-display-md text-teal mb-1">{value}</p>
      <p className="text-body-sm font-medium">{title}</p>
      {subtitle && <p className="text-caption">{subtitle}</p>}
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
    <div className="card-bordered">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-heading-md text-teal flex items-center gap-2">
          <Activity className="h-5 w-5" style={{ color: 'var(--glp-sage)' }} />
          System Health
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-sm" 
          data-testid="button-refresh-health"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="space-y-3">
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <div 
              key={i} 
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'var(--glp-sage-10)' }}
            >
              <div className="flex items-center gap-3">
                <div className="icon-container icon-sm icon-soft-sage">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-body-sm font-medium">{service.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-caption">{service.latency}</span>
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
    { name: 'CPU', value: 23, icon: Cpu, unit: '%' },
    { name: 'Memory', value: 67, icon: MemoryStick, unit: '%' },
    { name: 'Storage', value: 45, icon: HardDrive, unit: '%' },
    { name: 'Network', value: 12, icon: Wifi, unit: 'MB/s' }
  ];

  return (
    <div className="card-bordered">
      <h2 className="text-heading-md text-teal mb-4 flex items-center gap-2">
        <Server className="h-5 w-5" style={{ color: 'var(--glp-teal)' }} />
        Resource Monitor
      </h2>
      <div className="space-y-4">
        {resources.map((resource, i) => {
          const Icon = resource.icon;
          const barColor = resource.value > 80 ? 'var(--glp-rose)' : resource.value > 60 ? 'var(--glp-gold)' : 'var(--glp-sage)';
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color: 'var(--glp-sage)' }} />
                  <span className="text-body-sm">{resource.name}</span>
                </div>
                <span className="text-body-sm font-medium">
                  {resource.value}{resource.unit}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--glp-sage-10)' }}>
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(resource.value, 100)}%`, background: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecentActivity() {
  const activities = [
    { action: 'User registered', user: 'jane@example.com', time: '2 min ago', type: 'user' },
    { action: 'Journal entry created', user: 'john@example.com', time: '5 min ago', type: 'content' },
    { action: 'Password reset requested', user: 'alex@example.com', time: '12 min ago', type: 'auth' },
    { action: 'Premium subscription started', user: 'maya@example.com', time: '18 min ago', type: 'billing' },
    { action: 'AI chat session', user: 'sam@example.com', time: '25 min ago', type: 'ai' }
  ];

  const typeIcons = {
    user: Users,
    content: BookOpen,
    auth: Lock,
    billing: Zap,
    ai: MessageSquare
  };

  return (
    <div className="card-bordered">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-heading-md text-teal flex items-center gap-2">
          <Clock className="h-5 w-5" style={{ color: 'var(--glp-gold)' }} />
          Recent Activity
        </h2>
        <Link href="/analytics" className="text-body-sm flex items-center gap-1" style={{ color: 'var(--glp-sage-deep)' }}>
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="space-y-2">
        {activities.map((activity, i) => {
          const Icon = typeIcons[activity.type] || Activity;
          return (
            <div 
              key={i} 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-sage-5 transition-colors"
            >
              <div className="icon-container icon-sm icon-soft-sage flex-shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium">{activity.action}</p>
                <p className="text-caption truncate">{activity.user}</p>
              </div>
              <span className="text-caption flex-shrink-0">{activity.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: 'User Management', icon: Users, href: '/admin/users', desc: 'Manage users & permissions' },
    { label: 'Content Moderation', icon: FileText, href: '/content-admin', desc: 'Review flagged content' },
    { label: 'Route Manifest', icon: Route, href: '/admin/routes', desc: 'View route status' },
    { label: 'System Settings', icon: Settings, href: '/admin/settings', desc: 'Configure platform' },
    { label: 'Analytics', icon: BarChart3, href: '/analytics', desc: 'View detailed metrics' },
    { label: 'Health Check', icon: Activity, href: '/health', desc: 'API health status' }
  ];

  return (
    <div className="card-bordered">
      <h2 className="text-heading-md text-teal mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5" style={{ color: 'var(--glp-gold)' }} />
        Quick Actions
      </h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link 
              key={i}
              href={action.href}
              className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]"
              style={{ background: 'var(--glp-sage-10)' }}
              data-testid={`action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="icon-container icon-sm icon-soft-sage">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <span className="text-body-sm font-medium block">{action.label}</span>
                <span className="text-caption">{action.desc}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminCommandCenter() {
  useSEO({
    title: "Admin Command Center Pro",
    description: "Platform administration dashboard with system monitoring, user management, and analytics.",
    noIndex: true
  });

  const { data: healthData, refetch: refetchHealth, isRefetching: isHealthRefetching } = useQuery({
    queryKey: ['/api/health'],
    retry: false,
    staleTime: 30000,
    refetchInterval: 60000
  });

  const { data: statsData } = useQuery({
    queryKey: ['/api/admin/stats'],
    retry: false,
    staleTime: 60000
  });

  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { title: 'Total Users', value: statsData?.users || '2,847', subtitle: 'Active accounts', icon: Users, trend: 12, color: 'sage' },
    { title: 'Sessions Today', value: statsData?.sessions || '1,234', subtitle: 'Active sessions', icon: Activity, trend: 8, color: 'teal' },
    { title: 'API Requests', value: statsData?.requests || '45.2K', subtitle: 'Last 24 hours', icon: Globe, trend: -3, color: 'gold' },
    { title: 'Premium Users', value: statsData?.premium || '342', subtitle: 'Subscribed', icon: Zap, trend: 15, color: 'blush' }
  ];

  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="icon-container icon-xl icon-gradient-teal">
                  <Shield className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-display-lg text-teal" data-testid="text-page-title">
                    Admin Command Center
                    <span className="ml-2 text-sm font-normal px-2 py-1 rounded-full" style={{ background: 'var(--glp-gold-30)', color: 'var(--glp-gold-deep)' }}>PRO</span>
                  </h1>
                  <p className="text-lead">Platform management and monitoring</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-caption flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetchHealth()}
                  data-testid="button-refresh-all"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
          </header>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric, i) => (
              <MetricCard key={i} {...metric} />
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <SystemHealthPanel health={healthData} onRefresh={refetchHealth} isRefreshing={isHealthRefetching} />
            </div>
            <ResourceMonitor />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <RecentActivity />
            <QuickActions />
          </div>

          <div className="card-glass text-center py-8">
            <div className="icon-container icon-xl icon-gradient-gold mx-auto mb-4">
              <BarChart3 className="h-7 w-7" />
            </div>
            <h3 className="text-heading-lg text-teal mb-2">Need detailed analytics?</h3>
            <p className="text-lead mb-6 max-w-lg mx-auto">Access comprehensive platform analytics, user behavior insights, and performance metrics.</p>
            <Link href="/analytics" className="inline-block">
              <Button className="btn-premium" data-testid="button-view-analytics">
                View Full Analytics <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
