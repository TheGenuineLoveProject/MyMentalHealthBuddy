import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  showTrend?: boolean;
  testId?: string;
}

export function BarChart({ data, title, height = 200, showTrend = false, testId }: ChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const trend = useMemo(() => {
    if (data.length < 2) return 0;
    const recent = data.slice(-3).reduce((sum, d) => sum + d.value, 0) / Math.min(3, data.length);
    const previous = data.slice(0, -3).reduce((sum, d) => sum + d.value, 0) / Math.max(1, data.length - 3);
    return ((recent - previous) / Math.max(previous, 1)) * 100;
  }, [data]);

  const TrendIcon = trend > 5 ? TrendingUp : trend < -5 ? TrendingDown : Minus;
  const trendColor = trend > 5 ? 'text-green-600' : trend < -5 ? 'text-red-600' : 'text-gray-500';

  return (
    <div className="space-y-4" {...(testId && { 'data-testid': testId })}>
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          {showTrend && (
            <div className={`flex items-center gap-1 text-sm ${trendColor}`} data-testid={`${testId}-trend`}>
              <TrendIcon className="h-4 w-4" />
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
      )}
      <div className="space-y-2" style={{ height: `${height}px` }}>
        {data.map((point, index) => (
          <div key={index} className="flex items-center gap-3" data-testid={`${testId}-bar-${index}`}>
            <span className="text-sm text-muted-foreground w-24 truncate">{point.label}</span>
            <div className="flex-1 bg-muted rounded-full h-8 relative overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 flex items-center justify-end px-2"
                style={{
                  width: `${(point.value / maxValue) * 100}%`,
                  backgroundColor: point.color || 'hsl(var(--primary))'
                }}
              >
                <span className="text-xs font-medium text-white">
                  {point.value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({ data, title, height = 200, showTrend = false, testId }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="space-y-4" {...(testId && { 'data-testid': testId })}>
        {title && <h3 className="font-semibold">{title}</h3>}
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const minValue = Math.min(...data.map(d => d.value), 0);
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const trend = useMemo(() => {
    if (data.length < 2) return 0;
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.value, 0) / secondHalf.length;
    return ((secondAvg - firstAvg) / Math.max(firstAvg, 1)) * 100;
  }, [data]);

  const TrendIcon = trend > 5 ? TrendingUp : trend < -5 ? TrendingDown : Minus;
  const trendColor = trend > 5 ? 'text-green-600' : trend < -5 ? 'text-red-600' : 'text-gray-500';

  return (
    <div className="space-y-4" {...(testId && { 'data-testid': testId })}>
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          {showTrend && (
            <div className={`flex items-center gap-1 text-sm ${trendColor}`} data-testid={`${testId}-trend`}>
              <TrendIcon className="h-4 w-4" />
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
      )}
      <div className="relative" style={{ height: `${height}px` }}>
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            points={`0,100 ${points} 100,100`}
            fill="url(#lineGradient)"
            stroke="none"
          />
          <polyline
            points={points}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((point, index) => {
            const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
            const y = 100 - ((point.value - minValue) / range) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="hsl(var(--primary))"
                className="cursor-pointer hover:r-4 transition-all"
                data-testid={`${testId}-point-${index}`}
              >
                <title>{`${point.label}: ${point.value}`}</title>
              </circle>
            );
          })}
        </svg>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{data[0]?.label}</span>
          <span>{data[data.length - 1]?.label}</span>
        </div>
      </div>
    </div>
  );
}

export function PieChart({ data, title, height = 200, testId }: ChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  const slices = data.map((point, index) => {
    const percentage = (point.value / total) * 100;
    const angle = (point.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
    const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
    const x2 = 50 + 40 * Math.cos((currentAngle - 90) * Math.PI / 180);
    const y2 = 50 + 40 * Math.sin((currentAngle - 90) * Math.PI / 180);

    const largeArc = angle > 180 ? 1 : 0;

    return {
      ...point,
      percentage,
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`
    };
  });

  const colors = [
    'hsl(var(--primary))',
    'hsl(220, 90%, 56%)',
    'hsl(142, 71%, 45%)',
    'hsl(38, 92%, 50%)',
    'hsl(345, 83%, 61%)',
    'hsl(262, 83%, 58%)'
  ];

  return (
    <div className="space-y-4" {...(testId && { 'data-testid': testId })}>
      {title && <h3 className="font-semibold">{title}</h3>}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <svg viewBox="0 0 100 100" className="w-48 h-48">
          {slices.map((slice, index) => (
            <path
              key={index}
              d={slice.path}
              fill={slice.color || colors[index % colors.length]}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              data-testid={`${testId}-slice-${index}`}
            >
              <title>{`${slice.label}: ${slice.value} (${slice.percentage.toFixed(1)}%)`}</title>
            </path>
          ))}
        </svg>
        <div className="space-y-2 flex-1">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center gap-2" data-testid={`${testId}-legend-${index}`}>
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: slice.color || colors[index % colors.length] }}
              />
              <span className="text-sm flex-1">{slice.label}</span>
              <span className="text-sm font-medium">{slice.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  trend,
  icon: Icon,
  testId
}: {
  label: string;
  value: string | number;
  trend?: number;
  icon?: React.ComponentType<{ className?: string }>;
  testId?: string;
}) {
  const TrendIcon = trend && trend > 0 ? TrendingUp : trend && trend < 0 ? TrendingDown : Minus;
  const trendColor = trend && trend > 0 ? 'text-green-600' : trend && trend < 0 ? 'text-red-600' : 'text-gray-500';

  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm" {...(testId && { 'data-testid': testId })}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold" data-testid={`${testId}-value`}>{value}</p>
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${trendColor}`} data-testid={`${testId}-trend`}>
          <TrendIcon className="h-4 w-4" />
          <span>{Math.abs(trend).toFixed(1)}% from last period</span>
        </div>
      )}
    </div>
  );
}
