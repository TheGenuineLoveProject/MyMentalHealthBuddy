import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Users, ArrowLeft, RefreshCw, Shield, UserCheck, Search, Loader2, Activity, TrendingUp, Clock, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { AdminErrorBanner } from "../../components/admin/AdminQueryStates";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: stats, isLoading, refetch, isRefetching, error } = useQuery({
    queryKey: ['/api/admin/dashboard-stats'],
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
    refetchInterval: 60000,
    select: (data) => data?.data || data,
  });

  const { data: healthData } = useQuery({
    queryKey: ['/api/health'],
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
  });

  const userCount = stats?.users || 0;
  const leadsCount = stats?.leads || 0;
  const proUsers = stats?.proUsers || 0;
  const freeUsers = Math.max(0, userCount - proUsers);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="loading-state">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return <AdminErrorBanner title="Unable to load user data" onRetry={refetch} />;
  }

  const userMetrics = [
    { label: "Total Users", value: userCount, icon: Users, desc: "Registered platform users", color: "text-blue-600" },
    { label: "Pro Subscribers", value: proUsers, icon: TrendingUp, desc: "Active Pro subscriptions", color: "text-emerald-600" },
    { label: "Free Users", value: freeUsers, icon: Users, desc: "Free tier users", color: "text-slate-600" },
    { label: "Newsletter Subscribers", value: leadsCount, icon: Mail, desc: "Email subscribers", color: "text-amber-600" },
    { label: "Admin Users", value: stats?.adminCount || 1, icon: Shield, desc: "Users with admin access", color: "text-red-600" },
    { label: "Platform Uptime", value: healthData?.uptimeFormatted || "—", icon: Clock, desc: "Current server uptime", color: "text-purple-600" },
  ];

  const quickLinks = [
    { label: "Roles & Permissions", href: "/admin/roles", icon: Shield, testId: "link-roles-permissions" },
    { label: "Security Dashboard", href: "/admin/security", icon: Shield, testId: "link-security-dashboard" },
    { label: "Audit Logs", href: "/admin/audit-log", icon: Activity, testId: "link-audit-log" },
    { label: "Engagement Metrics", href: "/admin/engagement", icon: TrendingUp, testId: "link-engagement" },
    { label: "Billing Overview", href: "/admin/billing", icon: UserCheck, testId: "link-billing" },
  ];

  const filteredLinks = searchTerm
    ? quickLinks.filter(l => l.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : quickLinks;

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Admin Users — Admin" noindex />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} /> Back to Command Center
        </Link>
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold" data-testid="text-page-title">Admin Users</h1>
                <p className="text-muted-foreground">User management and admin access overview</p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm hover:bg-muted transition-colors"
              data-testid="button-refresh-users"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8" data-testid="panel-user-metrics">
          {userMetrics.map((metric, i) => (
            <Card key={i} data-testid={`user-metric-card-${i}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <metric.icon className={`w-8 h-8 ${metric.color} opacity-60`} />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">{metric.label}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold" data-testid={`user-metric-value-${i}`}>{metric.value}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{metric.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-6" data-testid="panel-admin-access">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Admin Access Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search admin links..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    data-testid="input-search-users"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground" data-testid="panel-access-info">
                <p className="font-medium mb-2">Access Control</p>
                <p>Admin access is managed through the ADMIN_TOKEN environment variable. Users authenticating with the admin token receive elevated privileges across all admin pages.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {filteredLinks.length > 0 ? filteredLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                      data-testid={link.testId}
                    >
                      <link.icon className="w-3 h-3" /> {link.label}
                    </Link>
                  )) : (
                    <span className="text-xs text-muted-foreground" data-testid="text-no-links-match">No links match "{searchTerm}"</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4" data-testid="panel-platform-status">
                <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-sm font-medium mb-1">
                    <Activity className="w-4 h-4 text-green-500" />
                    System Status
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {healthData?.status === 'healthy' ? 'All systems operational' : 'Checking status...'}
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-sm font-medium mb-1">
                    <Shield className="w-4 h-4 text-blue-500" />
                    Database
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {healthData?.database?.connected ? 'Connected' : 'Checking...'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <SafetyFooter variant="compact" className="mt-12" />
      </main>
    </div>
  );
}
