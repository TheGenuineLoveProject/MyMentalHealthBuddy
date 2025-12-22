export default function ProgressRing({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8,
  color = "from-purple-400 to-indigo-500",
  bgColor = "var(--surface)",
  showLabel = true,
  label = "",
  children
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const gradientId = `progress-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative inline-flex items-center justify-center" data-testid="progress-ring">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className={`[stop-color:var(--tw-gradient-from)]`} style={{ stopColor: getGradientColor(color, 'from') }} />
            <stop offset="100%" className={`[stop-color:var(--tw-gradient-to)]`} style={{ stopColor: getGradientColor(color, 'to') }} />
          </linearGradient>
        </defs>
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (
          <>
            <span className="text-2xl font-bold text-[var(--text)]">
              {Math.round(progress)}%
            </span>
            {showLabel && label && (
              <span className="text-xs text-[var(--text-muted)] mt-1">{label}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function getGradientColor(colorClass, position) {
  const colorMap = {
    'from-purple-400': '#a78bfa',
    'to-indigo-500': '#6366f1',
    'from-pink-400': '#f472b6',
    'to-rose-500': '#f43f5e',
    'from-emerald-400': '#34d399',
    'to-teal-500': '#14b8a6',
    'from-amber-400': '#fbbf24',
    'to-orange-500': '#f97316',
    'from-cyan-400': '#22d3ee',
    'to-blue-500': '#3b82f6',
  };

  const parts = colorClass.split(' ');
  const target = position === 'from' 
    ? parts.find(p => p.startsWith('from-'))
    : parts.find(p => p.startsWith('to-'));
  
  return colorMap[target] || (position === 'from' ? '#a78bfa' : '#6366f1');
}
