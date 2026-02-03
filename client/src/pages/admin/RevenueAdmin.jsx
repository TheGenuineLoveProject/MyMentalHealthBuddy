import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, TrendingUp, Users, CreditCard, Calendar, ArrowUp, ArrowDown, RefreshCw, AlertCircle } from "lucide-react";
import SEO from "../../components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";

export default function RevenueAdmin() {
  const [period, setPeriod] = useState("month");

  const { data: overviewData, isLoading, isError, refetch } = useQuery({
    queryKey: ["/api/admin/billing/overview"],
    staleTime: 1000 * 60 * 5
  });

  const { data: planData, isError: planError } = useQuery({
    queryKey: ["/api/admin/billing/plan-distribution"],
    staleTime: 1000 * 60 * 5
  });

  const hasError = isError || planError;

  const stats = {
    mrr: overviewData?.data?.mrr ? Math.round(overviewData.data.mrr / 100) : 0,
    subscribers: overviewData?.data?.activeSubscriptions || 0,
    churnRate: overviewData?.data?.churnRate?.toFixed(1) || 0
  };

  const planDistribution = (planData?.data?.distribution || [])
    .filter(p => p.status === 'active')
    .map(p => ({
      plan: p.tier?.charAt(0).toUpperCase() + p.tier?.slice(1) || "Unknown",
      count: parseInt(p.count) || 0
    }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="status" aria-busy="true">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" aria-hidden="true" />
          <p className="text-muted-foreground">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="alert" aria-live="assertive">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-xl font-semibold mb-2">Unable to load revenue data</h2>
          <p className="text-muted-foreground mb-6">Admin authentication may be required.</p>
          <Button onClick={() => refetch()} data-testid="button-retry">
            <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Revenue Dashboard — The Genuine Love Project"
        description="Admin revenue and subscription analytics."
      />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Admin</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Revenue Dashboard
          </h1>
          <p className="text-muted-foreground">
            Privacy-safe revenue metrics. No individual user data shown.
          </p>
        </header>

        <div className="flex gap-2 mb-6">
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

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">MRR</span>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">${stats.mrr.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                Monthly Recurring Revenue
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Subscribers</span>
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{stats.subscribers}</div>
              <div className="text-xs text-muted-foreground">
                Active subscriptions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Churn Rate</span>
                <CreditCard className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{stats.churnRate}%</div>
              <div className="text-xs text-muted-foreground">
                Monthly average
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Plans</span>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{planDistribution.length}</div>
              <div className="text-xs text-muted-foreground">
                Active plan types
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Subscribers by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planDistribution.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No active subscriptions</p>
              ) : (
                planDistribution.map(item => (
                  <div 
                    key={item.plan}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="font-medium">{item.plan}</span>
                    <span className="font-semibold">{item.count} subscribers</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          All metrics are aggregated. No individual payment details are shown.
        </p>
      </main>
    </div>
  );
}
