import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Users, ArrowLeft, RefreshCw, Shield, UserCheck, Search, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SEO from "../../components/SEO";

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

  const userCount = stats?.users || 0;
  const leadsCount = stats?.leads || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-destructive/60" />
        <h2 className="text-xl font-semibold" data-testid="text-error-title">Unable to load user data</h2>
        <p className="text-muted-foreground text-sm">The user data couldn't be fetched. Please try again.</p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
          data-testid="button-retry-users"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  const userMetrics = [
    { label: "Total Users", value: userCount, icon: Users, desc: "Registered platform users" },
    { label: "Newsletter Subscribers", value: leadsCount, icon: UserCheck, desc: "Email subscribers" },
    { label: "Admin Users", value: stats?.adminCount || 1, icon: Shield, desc: "Users with admin access" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Admin Users — Admin" noIndex />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} /> Command Center
        </Link>
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold" data-testid="text-page-title">Admin Users</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {userMetrics.map((metric, i) => (
            <Card key={i} data-testid={`user-metric-card-${i}`}>
              <CardContent className="pt-6">
                <metric.icon className="w-8 h-8 text-primary/60" />
                <p className="text-3xl font-bold mt-4" data-testid={`user-metric-value-${i}`}>{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{metric.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-6">
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
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    data-testid="input-search-users"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                <p className="font-medium mb-2">User Management</p>
                <p>Admin access is managed through the ADMIN_TOKEN environment variable. Users authenticating with the admin token receive elevated privileges across all admin pages.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href="/admin/roles" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors" data-testid="link-roles-permissions">
                    <Shield className="w-3 h-3" /> Roles & Permissions
                  </Link>
                  <Link href="/admin/security" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors" data-testid="link-security-dashboard">
                    <Shield className="w-3 h-3" /> Security Dashboard
                  </Link>
                  <Link href="/admin/audit-log" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors" data-testid="link-audit-log">
                    <Shield className="w-3 h-3" /> Audit Logs
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
