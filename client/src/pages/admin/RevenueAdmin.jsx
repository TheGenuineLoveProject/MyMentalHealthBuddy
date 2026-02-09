import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, TrendingUp, Users, CreditCard, Calendar, RefreshCw, AlertCircle, ArrowLeft, BarChart3, PieChart } from "lucide-react";
import SEO from "../../components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { AdminErrorBanner } from "../../components/admin/AdminQueryStates";

export default function RevenueAdmin() {
  const [period, setPeriod] = useState("month");

  const { data: overviewData, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["/api/admin/billing/overview"],
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5
  });

  const { data: planData, isError: planError } = useQuery({
    queryKey: ["/api/admin/billing/plan-distribution"],
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5
  });

  const hasError = isError || planError;

  const stats = {
    mrr: overviewData?.data?.mrr ? Math.round(overviewData.data.mrr / 100) : 0,
    subscribers: overviewData?.data?.activeSubscriptions || 0,
    churnRate: overviewData?.data?.churnRate?.toFixed(1) || 0,
    totalRevenue: overviewData?.data?.totalRevenue ? Math.round(overviewData.data.totalRevenue / 100) : 0,
  };

  const planDistribution = (planData?.data?.distribution || [])
    .filter(p => p.status === 'active')
    .map(p => ({
      plan: p.tier?.charAt(0).toUpperCase() + p.tier?.slice(1) || "Unknown",
      count: parseInt(p.count) || 0
    }));

  const totalPlanUsers = planDistribution.reduce((sum, p) => sum + p.count, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="status" aria-busy="true" data-testid="loading-state">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" aria-hidden="true" />
          <p className="text-muted-foreground">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  if (hasError) return <AdminErrorBanner title="Unable to load revenue data" message="The billing service may be temporarily unavailable." onRetry={refetch} />;

  const revenueCards = [
    { label: "MRR", value: `$${stats.mrr.toLocaleString()}`, icon: TrendingUp, desc: "Monthly Recurring Revenue", testId: "card-mrr" },
    { label: "Subscribers", value: stats.subscribers, icon: Users, desc: "Active subscriptions", testId: "card-subscribers" },
    { label: "Churn Rate", value: `${stats.churnRate}%`, icon: CreditCard, desc: "Monthly average", testId: "card-churn" },
    { label: "Total Plans", value: planDistribution.length, icon: Calendar, desc: "Active plan types", testId: "card-plans" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Revenue Dashboard — The Genuine Love Project"
        description="Admin revenue and subscription analytics."
        noindex
      />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} /> Back to Command Center
        </Link>
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm font-medium">Admin</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
                Revenue Dashboard
              </h1>
              <p className="text-muted-foreground">
                Privacy-safe revenue metrics. No individual user data shown.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm hover:bg-muted transition-colors"
              data-testid="button-refresh-revenue"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </header>

        <div className="flex gap-2 mb-6" data-testid="panel-period-selector">
          {["week", "month", "quarter", "year"].map(p => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
              className="capitalize"
              data-testid={`period-${p}`}
            >
              {p}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8" data-testid="panel-revenue-cards">
          {revenueCards.map((card) => (
            <Card key={card.testId} data-testid={card.testId}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{card.label}</span>
                  <card.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold" data-testid={`value-${card.testId}`}>{card.value}</div>
                <div className="text-xs text-muted-foreground">{card.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8" data-testid="panel-plan-distribution">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Subscribers by Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planDistribution.length === 0 ? (
                <p className="text-muted-foreground text-center py-4" data-testid="text-no-subscriptions">No active subscriptions</p>
              ) : (
                planDistribution.map(item => {
                  const pct = totalPlanUsers > 0 ? Math.round((item.count / totalPlanUsers) * 100) : 0;
                  return (
                    <div 
                      key={item.plan}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      data-testid={`plan-row-${item.plan.toLowerCase()}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{item.plan}</span>
                        <span className="text-xs text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="font-semibold text-sm">{item.count} subscribers</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground" data-testid="text-privacy-notice">
            All metrics are aggregated. No individual payment details are shown.
          </p>
          <Link href="/admin/billing" className="text-xs text-primary hover:underline" data-testid="link-billing-details">
            View Billing Details
          </Link>
        </div>
        <SafetyFooter variant="compact" className="mt-12" />
      </main>
    </div>
  );
}
