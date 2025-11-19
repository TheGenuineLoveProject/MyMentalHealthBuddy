/**
 * Progress Indicator Component
 * Visually engaging progress tracking with NLP-powered messaging
 */

interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  testId?: string;
}

export function ProgressIndicator({
  current,
  total,
  label,
  showPercentage = true,
  colorScheme = 'blue',
  size = 'md',
  animated = true,
  testId = 'progress-indicator'
}: ProgressIndicatorProps) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600'
  };
  
  const glowClasses = {
    blue: 'shadow-[0_0_10px_rgba(37,99,235,0.5)]',
    green: 'shadow-[0_0_10px_rgba(22,163,74,0.5)]',
    purple: 'shadow-[0_0_10px_rgba(147,51,234,0.5)]',
    orange: 'shadow-[0_0_10px_rgba(249,115,22,0.5)]'
  };

  return (
    <div className="w-full" data-testid={testId}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`
            ${sizeClasses[size]}
            ${colorClasses[colorScheme]}
            ${animated ? 'transition-all duration-500 ease-out' : ''}
            ${percentage > 75 ? glowClasses[colorScheme] : ''}
            rounded-full
          `}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={label || 'Progress'}
          data-testid={`${testId}-bar`}
        />
      </div>
      
      {percentage >= 100 && (
        <div className="mt-2 text-center animate-bounce">
          <span className="text-2xl">🎉</span>
          <span className="ml-2 text-sm font-semibold text-green-600">
            Complete!
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Circular Progress Component
 */

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
  testId?: string;
}

export function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = '#0284c7',
  label,
  showPercentage = true,
  testId = 'circular-progress'
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="inline-flex flex-col items-center gap-2" data-testid={testId}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          style={{
            filter: percentage > 75 ? `drop-shadow(0 0 6px ${color}40)` : 'none'
          }}
        />
        
        {/* Center text */}
        {showPercentage && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl font-bold fill-gray-900 transform rotate-90"
            style={{ transformOrigin: 'center' }}
          >
            {Math.round(percentage)}%
          </text>
        )}
      </svg>
      
      {label && (
        <span className="text-sm font-medium text-gray-700 text-center">
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * Step Progress Component
 */

interface Step {
  label: string;
  completed: boolean;
  active?: boolean;
}

interface StepProgressProps {
  steps: Step[];
  testId?: string;
}

export function StepProgress({ steps, testId = 'step-progress' }: StepProgressProps) {
  return (
    <div className="w-full" data-testid={testId}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-all duration-300
                  ${step.completed
                    ? 'bg-green-600 text-white shadow-lg scale-110'
                    : step.active
                    ? 'bg-blue-600 text-white shadow-glow animate-pulse'
                    : 'bg-gray-300 text-gray-600'
                  }
                `}
                data-testid={`${testId}-step-${index}`}
              >
                {step.completed ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium text-center
                  ${step.completed || step.active ? 'text-gray-900' : 'text-gray-500'}
                `}
              >
                {step.label}
              </span>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 bg-gray-300 rounded">
                <div
                  className={`
                    h-full rounded transition-all duration-500
                    ${step.completed ? 'bg-green-600 w-full' : 'bg-gray-300 w-0'}
                  `}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
