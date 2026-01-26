import { useState } from "react";
import { DollarSign, TrendingUp, Users, CreditCard, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import SEO from "../../components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";

const MOCK_STATS = {
  mrr: 4580,
  mrrChange: 12.5,
  subscribers: 245,
  subscribersChange: 8,
  churnRate: 2.3,
  avgLifetime: 8.5
};

const MOCK_REVENUE_BY_PLAN = [
  { plan: "Premium Monthly", count: 180, revenue: 3596 },
  { plan: "Premium Annual", count: 45, revenue: 2694 },
  { plan: "Lifetime", count: 20, revenue: 5980 }
];

export default function RevenueAdmin() {
  const [period, setPeriod] = useState("month");

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
              <div className="text-2xl font-bold">${MOCK_STATS.mrr.toLocaleString()}</div>
              <div className={`text-xs flex items-center gap-1 ${MOCK_STATS.mrrChange > 0 ? "text-green-600" : "text-red-600"}`}>
                {MOCK_STATS.mrrChange > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(MOCK_STATS.mrrChange)}% vs last {period}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Subscribers</span>
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{MOCK_STATS.subscribers}</div>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <ArrowUp className="w-3 h-3" />
                +{MOCK_STATS.subscribersChange} new
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Churn Rate</span>
                <CreditCard className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{MOCK_STATS.churnRate}%</div>
              <div className="text-xs text-muted-foreground">
                Monthly average
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg. Lifetime</span>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{MOCK_STATS.avgLifetime} mo</div>
              <div className="text-xs text-muted-foreground">
                Subscriber retention
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Revenue by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_REVENUE_BY_PLAN.map(item => (
                <div 
                  key={item.plan}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <span className="font-medium">{item.plan}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({item.count} subscribers)
                    </span>
                  </div>
                  <span className="font-semibold">${item.revenue.toLocaleString()}</span>
                </div>
              ))}
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
