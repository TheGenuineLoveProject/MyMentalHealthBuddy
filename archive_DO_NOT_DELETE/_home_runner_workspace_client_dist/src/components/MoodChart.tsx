/**
 * Mood Chart Component
 * Visualizes mood data with interactive charts
 */

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MoodData {
  date: string;
  mood: number; // 1-5 scale
  energy?: number;
  anxiety?: number;
}

interface MoodChartProps {
  data: MoodData[];
  metric?: 'mood' | 'energy' | 'anxiety';
  showTrend?: boolean;
  height?: number;
  'data-testid'?: string;
}

export function MoodChart({
  data,
  metric = 'mood',
  showTrend = true,
  height = 200,
  'data-testid': testId,
}: MoodChartProps) {
  // Guard against empty data
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6" data-testid={testId}>
        <div className="text-center py-12 text-gray-500">
          <p>No mood data available</p>
          <p className="text-sm mt-2">Start logging your mood to see trends!</p>
        </div>
      </div>
    );
  }

  const chartData = useMemo(() => {
    const maxValue = 5;
    const points = data.map((item, index) => {
      const value = item[metric] || item.mood;
      const x = (index / (data.length - 1)) * 100;
      const y = ((maxValue - value) / maxValue) * 100;
      return { x, y, value, date: item.date };
    });

    // Create SVG path
    const path = points
      .map((point, index) => {
        const command = index === 0 ? 'M' : 'L';
        return `${command} ${point.x}% ${point.y}%`;
      })
      .join(' ');

    // Calculate trend
    const firstValue = points[0]?.value || 0;
    const lastValue = points[points.length - 1]?.value || 0;
    const trend = lastValue - firstValue;
    const trendPercentage = ((trend / 5) * 100).toFixed(1);

    return { points, path, trend, trendPercentage };
  }, [data, metric]);

  const getColor = () => {
    if (metric === 'mood') return '#3b82f6'; // blue
    if (metric === 'energy') return '#10b981'; // green
    if (metric === 'anxiety') return '#f59e0b'; // orange
    return '#6b7280'; // gray
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6" data-testid={testId}>
      {/* Header with Trend */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold capitalize">{metric} Trend</h3>
          <p className="text-sm text-gray-500">
            Last {data.length} entries
          </p>
        </div>
        
        {showTrend && (
          <div className="flex items-center gap-2">
            {chartData.trend > 0 ? (
              <>
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  +{chartData.trendPercentage}%
                </span>
              </>
            ) : chartData.trend < 0 ? (
              <>
                <TrendingDown className="h-5 w-5 text-red-500" />
                <span className="text-red-600 dark:text-red-400 font-semibold">
                  {chartData.trendPercentage}%
                </span>
              </>
            ) : (
              <>
                <Minus className="h-5 w-5 text-gray-500" />
                <span className="text-gray-500 font-semibold">0%</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: `${height}px` }}>
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-gray-200 dark:text-gray-700"
            />
          ))}

          {/* Area under curve */}
          {chartData.points.length > 0 && (
            <path
              d={`${chartData.path} L 100% 100% L 0% 100% Z`}
              fill={getColor()}
              fillOpacity="0.1"
            />
          )}

          {/* Line */}
          {chartData.points.length > 0 && (
            <path
              d={chartData.path}
              fill="none"
              stroke={getColor()}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {/* Data Points */}
          {chartData.points.map((point, index) => (
            <circle
              key={index}
              cx={`${point.x}%`}
              cy={`${point.y}%`}
              r="2"
              fill={getColor()}
              className="hover:r-3 transition-all cursor-pointer"
              data-testid={`mood-point-${index}`}
            >
              <title>{`${point.date}: ${point.value}/5`}</title>
            </circle>
          ))}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 -ml-8">
          {[5, 4, 3, 2, 1].map((value) => (
            <span key={value}>{value}</span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>
          {data[0]?.date ? new Date(data[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
        </span>
        <span>
          {data[data.length - 1]?.date ? new Date(data[data.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
        </span>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded">
          <div className="text-2xl font-bold" style={{ color: getColor() }}>
            {(data.reduce((sum, item) => sum + (item[metric] || item.mood), 0) / data.length).toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Average</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded">
          <div className="text-2xl font-bold" style={{ color: getColor() }}>
            {Math.max(...data.map(item => item[metric] || item.mood))}
          </div>
          <div className="text-xs text-gray-500 mt-1">Highest</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded">
          <div className="text-2xl font-bold" style={{ color: getColor() }}>
            {Math.min(...data.map(item => item[metric] || item.mood))}
          </div>
          <div className="text-xs text-gray-500 mt-1">Lowest</div>
        </div>
      </div>
    </div>
  );
}
