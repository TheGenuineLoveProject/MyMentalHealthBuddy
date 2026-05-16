import { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";

const MOOD_VALUES = {
  happy: 5,
  grateful: 4.5,
  hopeful: 4,
  calm: 3.5,
  neutral: 3,
  anxious: 2,
  sad: 1.5,
  angry: 1
};

const MOOD_COLORS = {
  happy: "#fbbf24",
  grateful: "#d4af37",
  hopeful: "#2f5d5d",
  calm: "#8fbf9f",
  neutral: "#9ca3af",
  anxious: "#f4c7c3",
  sad: "#6b8cae",
  angry: "#ef4444"
};

function calculateTrend(data) {
  if (data.length < 2) return 0;
  const recent = data.slice(-7);
  const firstHalf = recent.slice(0, Math.ceil(recent.length / 2));
  const secondHalf = recent.slice(Math.ceil(recent.length / 2));
  
  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  return avgSecond - avgFirst;
}

export default function MoodTrendsChart({
  moodData = {},
  days = 14,
  className = ""
}) {
  const chartData = useMemo(() => {
    const today = new Date();
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const mood = moodData[dateStr];
      
      data.push({
        date: dateStr,
        label: date.toLocaleDateString('default', { weekday: 'short' }),
        dayNum: date.getDate(),
        mood,
        value: mood ? MOOD_VALUES[mood] : null,
        color: mood ? MOOD_COLORS[mood] : null
      });
    }

    return data;
  }, [moodData, days]);

  const validValues = chartData.filter(d => d.value !== null).map(d => d.value);
  const trend = calculateTrend(validValues);
  const averageMood = validValues.length > 0 
    ? (validValues.reduce((a, b) => a + b, 0) / validValues.length).toFixed(1)
    : null;

  const maxValue = 5;
  const minValue = 1;
  const range = maxValue - minValue;

  const TrendIcon = trend > 0.3 ? TrendingUp : trend < -0.3 ? TrendingDown : Minus;
  const trendColor = trend > 0.3 ? "text-emerald-500" : trend < -0.3 ? "text-rose-500" : "text-muted-foreground";
  const trendLabel = trend > 0.3 ? "Improving" : trend < -0.3 ? "Needs attention" : "Stable";

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-[#d4af37]" aria-hidden="true" />
            Mood Trends
          </CardTitle>
          <div className={`flex items-center gap-1 text-sm ${trendColor}`} role="status" aria-label={`Mood trend: ${trendLabel}`}>
            <TrendIcon className="w-4 h-4" aria-hidden="true" />
            <span>{trendLabel}</span>
          </div>
        </div>
        {averageMood && (
          <p className="text-sm text-muted-foreground">
            Average mood score: <span className="font-medium text-foreground">{averageMood}/5</span>
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div 
          className="relative h-40"
          role="img"
          aria-label={`Mood chart for the last ${days} days showing ${validValues.length} entries`}
        >
          <svg viewBox={`0 0 ${days * 24} 100`} className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[1, 2, 3, 4, 5].map(level => {
              const y = 100 - ((level - minValue) / range) * 80 - 10;
              return (
                <line
                  key={level}
                  x1="0"
                  y1={y}
                  x2={days * 24}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {chartData.length > 1 && (
              <path
                d={chartData.map((d, i) => {
                  const x = i * 24 + 12;
                  const y = d.value !== null 
                    ? 100 - ((d.value - minValue) / range) * 80 - 10 
                    : null;
                  
                  if (y === null) return '';
                  
                  const prevWithValue = chartData.slice(0, i).reverse().find(p => p.value !== null);
                  const prevIndex = prevWithValue ? chartData.indexOf(prevWithValue) : null;
                  
                  if (prevIndex === null) return `M ${x} ${y}`;
                  return `L ${x} ${y}`;
                }).filter(Boolean).join(' ')}
                stroke="#d4af37"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {chartData.map((d, i) => {
              if (d.value === null) return null;
              const x = i * 24 + 12;
              const y = 100 - ((d.value - minValue) / range) * 80 - 10;
              
              return (
                <g key={d.date}>
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={d.color}
                    stroke="white"
                    strokeWidth="2"
                    className="drop-shadow-sm"
                  />
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-1">
            {chartData.filter((_, i) => i % Math.ceil(days / 7) === 0 || i === days - 1).map(d => (
              <span key={d.date}>{d.dayNum}</span>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-lg bg-muted/50">
            <div className="text-lg font-semibold text-[#8fbf9f]">
              {chartData.filter(d => ['calm', 'happy', 'grateful', 'hopeful'].includes(d.mood)).length}
            </div>
            <div className="text-xs text-muted-foreground">Good days</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/50">
            <div className="text-lg font-semibold text-gray-500">
              {chartData.filter(d => d.mood === 'neutral').length}
            </div>
            <div className="text-xs text-muted-foreground">Neutral</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/50">
            <div className="text-lg font-semibold text-[#f4c7c3]">
              {chartData.filter(d => ['anxious', 'sad', 'angry'].includes(d.mood)).length}
            </div>
            <div className="text-xs text-muted-foreground">Hard days</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/50">
            <div className="text-lg font-semibold text-muted-foreground">
              {chartData.filter(d => !d.mood).length}
            </div>
            <div className="text-xs text-muted-foreground">No entry</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
