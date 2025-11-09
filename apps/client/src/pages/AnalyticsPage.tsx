import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { LineChart, PieChart } from '@/components/Charts';
import {
  InsightCard,
  PredictiveInsights,
  NarrativeSummary,
  ComparisonInsight
} from '@/components/DataStorytelling';
import { NarrativeLineChart, detectTrendAnnotations } from '@/components/NarrativeChart';
import {
  TrendingUp,
  Users,
  Globe,
  Clock,
  Target,
  Award,
} from 'lucide-react';

/**
 * Analytics Page - Comprehensive performance insights
 * Track content performance, audience engagement, and growth
 */
export default function AnalyticsPage() {
  const analyticsData = {
    views: { value: 45820, change: 12.5 },
    engagement: { value: 8.4, change: 3.2 },
    shares: { value: 2340, change: -2.1 },
    comments: { value: 1520, change: 15.8 },
  };

  const audienceStats = [
    { label: 'Total Followers', value: '12.5K', change: '+5.2%', icon: Users },
    { label: 'Reach', value: '45.8K', change: '+12.3%', icon: Globe },
    { label: 'Avg. Session', value: '3m 42s', change: '+8.1%', icon: Clock },
    { label: 'Conversion Rate', value: '4.2%', change: '+1.3%', icon: Target },
  ];

  const platformBreakdown = [
    { name: 'Instagram', percentage: 45, color: 'bg-pink-500' },
    { name: 'Twitter', percentage: 30, color: 'bg-blue-500' },
    { name: 'LinkedIn', percentage: 15, color: 'bg-indigo-500' },
    { name: 'Facebook', percentage: 10, color: 'bg-blue-600' },
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Track performance, engagement, and growth across all platforms
        </p>
      </div>

      {/* Quick Export */}
      <div className="flex gap-3 mb-8">
        <Button variant="secondary" data-testid="button-export-pdf">
          Export PDF
        </Button>
        <Button variant="secondary" data-testid="button-export-csv">
          Export CSV
        </Button>
        <Button variant="secondary" data-testid="button-schedule-report">
          Schedule Report
        </Button>
      </div>

      {/* Narrative Summary - Data Storytelling */}
      <NarrativeSummary
        title="📊 Your Analytics Story"
        timeframe="Last 30 Days"
        summary="Your mental health platform achieved remarkable growth this month! Total views increased by 12.5% to nearly 46K visits, while engagement surged by 15.8% with over 1,500 meaningful comments from users. Although shares dipped slightly by 2.1%, your overall community interaction and reach continue strengthening—a testament to the authentic value your content delivers to users seeking mental wellness support."
        highlights={[
          { label: 'Total Reach', value: '45.8K', sentiment: 'positive' },
          { label: 'Engagement Rate', value: '8.4%', sentiment: 'positive' },
          { label: 'Active Days', value: '28/30', sentiment: 'positive' }
        ]}
      />

      {/* Key Insights - Storytelling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <InsightCard
          type="positive"
          title="🎉 Comments Surged 15.8%"
          description="User engagement reached all-time high with 1,520 comments this month, indicating strong community connection and therapeutic value."
          metric={{ label: 'total comments', value: '1,520', change: 15.8 }}
          action={{
            label: 'View top discussions',
            onClick: () => console.log('Navigate to discussions')
          }}
        />
        <InsightCard
          type="recommendation"
          title="💡 Optimize Posting Schedule"
          description="Your audience is most active on weekdays between 10 AM - 2 PM. Schedule therapeutic content during these peak engagement windows."
          action={{
            label: 'Set up automation',
            onClick: () => console.log('Navigate to automation')
          }}
        />
      </div>

      {/* Predictive Insights */}
      <div className="mt-8">
        <PredictiveInsights
          historical={[
            { label: 'Week 1', value: 10200 },
            { label: 'Week 2', value: 11500 },
            { label: 'Week 3', value: 11800 },
            { label: 'Week 4', value: 12320 }
          ]}
          forecast={[
            { label: 'Next Week', value: 13100, confidence: 85 },
            { label: 'Week +2', value: 13850, confidence: 78 },
            { label: 'Week +3', value: 14200, confidence: 72 }
          ]}
          insights={[
            'Weekly growth rate of 6.2% suggests sustained upward momentum in user engagement',
            'Peak traffic days (Tue/Thu) correlate with new therapeutic content releases',
            'Average session duration increased 18% indicating higher content quality perception',
            'Mobile traffic (68%) dominates—optimize responsive design for mobile journaling features'
          ]}
        />
      </div>

      {/* Comparison Insight */}
      <div className="mt-8">
        <ComparisonInsight
          title="Monthly Performance Comparison"
          current={{
            label: 'This Month (Nov 2025)',
            value: 45820,
            trend: 12.5
          }}
          previous={{
            label: 'Last Month (Oct 2025)',
            value: 40700
          }}
          insight="Exceptional growth driven by viral 'Mindfulness Exercises' content and improved SEO rankings. Your therapeutic guidance resonated with 5,120 new users this month."
        />
      </div>

      {/* Main Analytics Dashboard */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Engagement Metrics</h2>
        <AnalyticsDashboard data={analyticsData} period="30d" />
      </div>

      {/* Audience Insights */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Audience Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audienceStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="p-6" data-testid={`audience-stat-${i}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2" data-testid={`audience-value-${i}`}>
                  {stat.value}
                </div>
                <Badge variant="gray" className="text-green-600" data-testid={`audience-change-${i}`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </Badge>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6" data-testid="text-platform-breakdown">
            Traffic by Platform
          </h3>
          <PieChart
            data={platformBreakdown.map(p => ({
              label: p.name,
              value: p.percentage,
              color: undefined
            }))}
            size={250}
            showLegend
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">Engagement Trend (7 Days) - With Narrative Annotations</h3>
          <NarrativeLineChart
            data={[
              { label: 'Mon', value: 7.2 },
              { label: 'Tue', value: 8.1 },
              { label: 'Wed', value: 7.8 },
              { label: 'Thu', value: 8.9 },
              { label: 'Fri', value: 9.2 },
              { label: 'Sat', value: 8.4 },
              { label: 'Sun', value: 8.4 }
            ]}
            annotations={[
              {
                label: '🎯 Best Day',
                description: 'Friday reached peak engagement at 9.2% - new content release timing was optimal',
                dataIndex: 4,
                type: 'peak'
              },
              {
                label: '📊 Milestone',
                description: 'Tuesday marked first day above 8% threshold this week',
                dataIndex: 1,
                type: 'milestone'
              }
            ]}
            height={250}
            animate
          />
        </Card>
      </div>

      {/* Goals & Achievements */}
      <div className="mt-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold" data-testid="text-goals">
              Goals & Achievements
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-2xl font-bold mb-1">10K</div>
              <div className="text-sm text-muted-foreground">Monthly Views Goal</div>
              <div className="mt-2">
                <Badge variant="primary">Achieved!</Badge>
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg">
              <div className="text-4xl mb-2">📈</div>
              <div className="text-2xl font-bold mb-1">5K</div>
              <div className="text-sm text-muted-foreground">Follower Milestone</div>
              <div className="mt-2">
                <Badge variant="gray">In Progress (92%)</Badge>
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg">
              <div className="text-4xl mb-2">💪</div>
              <div className="text-2xl font-bold mb-1">30</div>
              <div className="text-sm text-muted-foreground">Consecutive Days Publishing</div>
              <div className="mt-2">
                <Badge variant="primary">Achieved!</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950">
        <h3 className="text-xl font-semibold mb-4">💡 AI-Powered Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl">✨</div>
            <div>
              <div className="font-medium mb-1">Best posting time identified</div>
              <div className="text-sm text-muted-foreground">
                Your audience is most active on weekdays between 10 AM - 2 PM. Consider scheduling more content during this window.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl">🚀</div>
            <div>
              <div className="font-medium mb-1">Content performance trending up</div>
              <div className="text-sm text-muted-foreground">
                "How-to" guides are getting 45% more engagement than other content types. Create more tutorial content!
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl">🎨</div>
            <div>
              <div className="font-medium mb-1">Visual content opportunity</div>
              <div className="text-sm text-muted-foreground">
                Posts with infographics get 3x more shares. Use the Canva integration to create more visual content.
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
