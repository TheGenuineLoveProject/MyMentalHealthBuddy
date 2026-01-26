import { Activity, Users, Clock, TrendingUp, BarChart3, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SEO from "../../components/SEO";

export default function EngagementDashboard() {
  const metrics = [
    { label: "Daily Active Users", value: "1,247", change: "+12%", icon: Users },
    { label: "Avg. Session Duration", value: "18m 32s", change: "+8%", icon: Clock },
    { label: "Weekly Retention", value: "67%", change: "+3%", icon: TrendingUp },
    { label: "Features Used/Session", value: "4.2", change: "+0.5", icon: Activity }
  ];

  const topFeatures = [
    { name: "AI Chat", sessions: 892, percentage: 72 },
    { name: "Journal", sessions: 654, percentage: 53 },
    { name: "Mood Tracker", sessions: 589, percentage: 47 },
    { name: "Breathing Exercises", sessions: 421, percentage: 34 },
    { name: "Daily Wisdom", sessions: 356, percentage: 29 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Engagement Dashboard — Admin" noIndex />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-page-title">Engagement Dashboard</h1>
              <p className="text-muted-foreground">User activity and engagement metrics</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <metric.icon className="w-8 h-8 text-primary/60" />
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    {metric.change}
                  </span>
                </div>
                <p className="text-3xl font-bold mt-4">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Features by Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topFeatures.map((feature, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{feature.name}</span>
                      <span className="text-muted-foreground text-sm">{feature.sessions} sessions</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${feature.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-48 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                  const heights = [65, 78, 82, 70, 85, 45, 52];
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-primary/80 rounded-t"
                        style={{ height: `${heights[i]}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{day}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
