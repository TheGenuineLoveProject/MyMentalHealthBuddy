/**
 * Professional Charts Library
 * Line, Bar, Pie, and Area charts for analytics visualization
 */

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface LineChartProps {
  data: ChartDataPoint[];
  height?: number;
  showGrid?: boolean;
  animate?: boolean;
}

export function LineChart({ data, height = 200, showGrid = true, animate = true }: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (point.value / maxValue) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full" style={{ height }} data-testid="chart-line">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Grid */}
        {showGrid && (
          <g opacity="0.1">
            {[0, 25, 50, 75, 100].map(y => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeWidth="0.2" />
            ))}
          </g>
        )}
        
        {/* Area fill */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#gradient)"
          opacity="0.2"
          className={animate ? 'animate-fade-in' : ''}
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animate ? 'animate-draw-line' : ''}
        />
        
        {/* Data points */}
        {data.map((point, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - (point.value / maxValue) * 100;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="hsl(var(--primary))"
              className="hover:r-3 transition-all cursor-pointer"
              data-testid={`point-${i}`}
            >
              <title>{`${point.label}: ${point.value}`}</title>
            </circle>
          );
        })}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        {data.map((point, i) => (
          <span key={i} className="text-center" data-testid={`label-${i}`}>
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  horizontal?: boolean;
}

export function BarChart({ data, height = 200, horizontal = false }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full" style={{ height }} data-testid="chart-bar">
      <div className={`h-full flex ${horizontal ? 'flex-col' : 'flex-row items-end'} gap-2`}>
        {data.map((point, i) => {
          const percentage = (point.value / maxValue) * 100;
          return (
            <div
              key={i}
              className={`flex-1 ${horizontal ? 'flex items-center' : 'flex flex-col'}`}
              data-testid={`bar-${i}`}
            >
              {horizontal ? (
                <>
                  <span className="text-xs text-muted-foreground w-20 text-right pr-2">
                    {point.label}
                  </span>
                  <div className="flex-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-6 bg-primary rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-xs text-white font-medium">{point.value}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="w-full bg-primary rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer"
                    style={{ height: `${percentage}%` }}
                    title={`${point.label}: ${point.value}`}
                  />
                  <span className="text-xs text-muted-foreground text-center mt-1 truncate">
                    {point.label}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface PieChartProps {
  data: ChartDataPoint[];
  size?: number;
  showLegend?: boolean;
}

export function PieChart({ data, size = 200, showLegend = true }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ];

  let currentAngle = -90;
  const slices = data.map((point, i) => {
    const percentage = (point.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    // Calculate arc path
    const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
    const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const endX = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
    const endY = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
    const largeArc = angle > 180 ? 1 : 0;

    return {
      ...point,
      percentage,
      path: `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`,
      color: point.color || colors[i % colors.length],
    };
  });

  return (
    <div className="flex flex-col items-center gap-4" data-testid="chart-pie">
      <svg width={size} height={size} viewBox="0 0 100 100" className="hover:scale-105 transition-transform">
        {slices.map((slice, i) => (
          <path
            key={i}
            d={slice.path}
            fill={slice.color}
            className="hover:opacity-80 cursor-pointer transition-opacity"
            data-testid={`slice-${i}`}
          >
            <title>{`${slice.label}: ${slice.value} (${slice.percentage.toFixed(1)}%)`}</title>
          </path>
        ))}
        
        {/* Center circle for donut effect */}
        <circle cx="50" cy="50" r="20" fill="hsl(var(--background))" />
        
        {/* Center text */}
        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="text-sm font-bold fill-current">
          {total}
        </text>
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
          {slices.map((slice, i) => (
            <div key={i} className="flex items-center gap-2" data-testid={`legend-${i}`}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: slice.color }} />
              <span className="text-xs text-muted-foreground truncate">
                {slice.label} ({slice.percentage.toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface AreaChartProps {
  data: ChartDataPoint[];
  height?: number;
  stacked?: boolean;
}

export function AreaChart({ data, height = 200, stacked = false }: AreaChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full" style={{ height }} data-testid="chart-area">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Area */}
        {data.map((point, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - (point.value / maxValue) * 100;
          const nextX = ((i + 1) / (data.length - 1)) * 100;
          const nextY = i < data.length - 1 ? 100 - (data[i + 1].value / maxValue) * 100 : y;

          return (
            <polygon
              key={i}
              points={`${x},${y} ${nextX},${nextY} ${nextX},100 ${x},100`}
              fill="url(#areaGradient)"
              className="animate-fade-in"
            />
          );
        })}

        {/* Line */}
        <polyline
          points={data.map((point, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - (point.value / maxValue) * 100;
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// Add animation styles to index.css:
// @keyframes draw-line { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
// .animate-draw-line { stroke-dasharray: 1000; animation: draw-line 1s ease-in-out; }
