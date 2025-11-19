import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { TrendingUp, TrendingDown, Eye, Heart, Share2, MessageCircle } from 'lucide-react';

interface AnalyticsData {
  views: { value: number; change: number };
  engagement: { value: number; change: number };
  shares: { value: number; change: number };
  comments: { value: number; change: number };
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  period?: '7d' | '30d' | '90d';
}

/**
 * Analytics Dashboard Component
 * Displays engagement metrics and trends
 */
export function AnalyticsDashboard({ data, period = '30d' }: AnalyticsDashboardProps) {
  const renderMetricCard = (
    title: string,
    value: number,
    change: number,
    icon: React.ReactNode,
    testId: string
  ) => {
    const isPositive = change >= 0;

    return (
      <Card className="p-6" data-testid={testId}>
        <div className="flex items-start justify-between mb-4">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold" data-testid={`${testId}-value`}>
            {value.toLocaleString()}
          </div>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span
              className={`text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
              data-testid={`${testId}-change`}
            >
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-sm text-muted-foreground">vs last {period}</span>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div data-testid="analytics-dashboard">
      {/* Period Selector */}
      <div className="mb-6">
        <div className="inline-flex gap-2 p-1 bg-muted rounded-lg">
          {['7d', '30d', '90d'].map((p) => (
            <Badge
              key={p}
              variant={period === p ? 'primary' : 'gray'}
              className="cursor-pointer"
              data-testid={`badge-period-${p}`}
            >
              {p === '7d' && '7 Days'}
              {p === '30d' && '30 Days'}
              {p === '90d' && '90 Days'}
            </Badge>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {renderMetricCard(
          'Total Views',
          data.views.value,
          data.views.change,
          <Eye className="h-5 w-5 text-primary" />,
          'metric-views'
        )}
        {renderMetricCard(
          'Engagement Rate',
          data.engagement.value,
          data.engagement.change,
          <Heart className="h-5 w-5 text-primary" />,
          'metric-engagement'
        )}
        {renderMetricCard(
          'Shares',
          data.shares.value,
          data.shares.change,
          <Share2 className="h-5 w-5 text-primary" />,
          'metric-shares'
        )}
        {renderMetricCard(
          'Comments',
          data.comments.value,
          data.comments.change,
          <MessageCircle className="h-5 w-5 text-primary" />,
          'metric-comments'
        )}
      </div>

      {/* Top Performing Content */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4" data-testid="text-top-content">
          Top Performing Content
        </h3>
        <div className="space-y-4">
          {[
            { title: '5 Mindfulness Exercises', views: 12500, engagement: 8.5 },
            { title: 'Understanding Anxiety', views: 9800, engagement: 7.2 },
            { title: 'Stress Relief Techniques', views: 8200, engagement: 6.8 },
          ].map((content, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
              data-testid={`top-content-${i}`}
            >
              <div className="flex-1">
                <div className="font-medium">{content.title}</div>
                <div className="text-sm text-muted-foreground">
                  {content.views.toLocaleString()} views • {content.engagement}% engagement
                </div>
              </div>
              <Badge variant="primary"># {i + 1}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Engagement Chart Placeholder */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Engagement Over Time</h3>
        <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-2" />
            <p>Chart visualization will appear here</p>
            <p className="text-sm">Line chart showing engagement trends</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
