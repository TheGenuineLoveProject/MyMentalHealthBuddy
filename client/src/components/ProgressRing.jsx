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
    'from-purple-400': 'var(--glp-purple-light)',
    'to-indigo-500': 'var(--glp-indigo)',
    'from-pink-400': 'var(--glp-pink-light)',
    'to-rose-500': 'var(--glp-rose)',
    'from-emerald-400': 'var(--glp-success-light)',
    'to-teal-500': 'var(--glp-teal-light)',
    'from-amber-400': 'var(--glp-warning-light)',
    'to-orange-500': 'var(--glp-orange)',
    'from-cyan-400': 'var(--glp-cyan-light)',
    'to-blue-500': 'var(--glp-info)',
  };

  const parts = colorClass.split(' ');
  const target = position === 'from' 
    ? parts.find(p => p.startsWith('from-'))
    : parts.find(p => p.startsWith('to-'));
  
  return colorMap[target] || (position === 'from' ? 'var(--glp-purple-light)' : 'var(--glp-indigo)');
}
