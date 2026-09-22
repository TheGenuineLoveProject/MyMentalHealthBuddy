import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Activity, Users, Clock, TrendingUp, BarChart3, Heart, RefreshCw, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { AdminErrorBanner } from "../../components/admin/AdminQueryStates";
import { fetchDashboardStats, metricValue } from "@/lib/adminDashboardStats";

export default function EngagementDashboard() {
  const { data: stats, isLoading, refetch, isRefetching, error: statsError } = useQuery({
    queryKey: ['/api/admin/dashboard-stats'],
    queryFn: fetchDashboardStats,
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
    refetchInterval: 60000,
    select: (data) => data?.data || data,
  });

  const { data: health } = useQuery({
    queryKey: ['/api/health'],
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
  });

  const userCount = metricValue(stats?.users);
  const blogCount = metricValue(stats?.blogPosts);
  const socialCount = metricValue(stats?.socialPosts);
  const leadsCount = metricValue(stats?.leads);
  const uptimeSeconds = stats?.uptimeSeconds;
  const uptimeFormatted = Number.isFinite(uptimeSeconds) ? `${Math.floor(uptimeSeconds / 60)}m` : "Unavailable";

  const metrics = [
    { label: "Registered Users", value: userCount.toLocaleString(), icon: Users, desc: "Total platform users" },
    { label: "Session Uptime", value: uptimeFormatted, icon: Clock, desc: "Current server session" },
    { label: "Blog Posts", value: blogCount, icon: TrendingUp, desc: `${metricValue(stats?.publishedBlogs)} published` },
    { label: "Newsletter Subscribers", value: leadsCount, icon: Heart, desc: "Status: active" }
  ];

  const topFeatures = [
    { name: "Feature usage measurements are unavailable." },
  ];

  const platformStats = [
    { label: "Platform Tools", value: "Unavailable" },
    { label: "API Routes", value: "Unavailable" },
    { label: "Admin Pages", value: "Unavailable" },
    { label: "Social Posts", value: socialCount },
    { label: "Active Campaigns", value: metricValue(stats?.campaigns) },
    { label: "Draft Posts", value: metricValue(stats?.socialDrafts) },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (statsError) {
    return <AdminErrorBanner title="Unable to load engagement data" onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Engagement Dashboard — Admin" noindex />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} /> Back to Command Center
        </Link>
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold" data-testid="text-page-title">Engagement Dashboard</h1>
                <p className="text-muted-foreground">Platform metrics and feature usage overview</p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm hover:bg-muted transition-colors"
              data-testid="button-refresh-engagement"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, i) => (
            <Card key={i} data-testid={`metric-card-${i}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <metric.icon className="w-8 h-8 text-primary/60" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold mt-4" data-testid={`metric-value-${i}`}>{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{metric.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card data-testid="panel-top-features">
            <CardHeader>
              <CardTitle>Top Features by Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topFeatures.map((feature, i) => (
                  <div key={i} data-testid={`feature-bar-${i}`}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-sm">{feature.name}</span>
                      <span className="text-muted-foreground text-xs">Unavailable</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: 0 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="panel-platform-overview">
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {platformStats.map((stat, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50" data-testid={`platform-stat-${i}`}>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              {health?.services && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700" data-testid="panel-service-integrations">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Service Integrations</p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { name: 'Stripe', active: health.services.stripe },
                      { name: 'Resend', active: health.services.resend },
                      { name: 'Perplexity', active: health.services.perplexity },
                      { name: 'Sentry', active: health.services.sentry },
                    ].map(svc => (
                      <span key={svc.name} className="inline-flex items-center gap-1.5 text-xs" data-testid={`service-${svc.name.toLowerCase()}`}>
                        <span className={`w-2 h-2 rounded-full ${svc.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className={svc.active ? 'text-foreground' : 'text-muted-foreground'}>{svc.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {stats?.recentActivity && stats.recentActivity.length > 0 && (
          <Card data-testid="section-recent-activity">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentActivity.slice(0, 10).map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-muted last:border-0" data-testid={`activity-row-${i}`}>
                    <div>
                      <span className="text-sm font-medium">{item.type?.replace(/_/g, ' ')}</span>
                      {item.meta?.postId && (
                        <span className="text-xs text-muted-foreground ml-2">ID: {item.meta.postId.slice(0, 8)}</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        <SafetyFooter variant="compact" className="mt-12" />
      </main>
    </div>
  );
}
