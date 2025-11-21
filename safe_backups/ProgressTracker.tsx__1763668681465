/**
 * Progress Tracker Component
 * Visual progress indicators for goals and achievements
 */

import { CheckCircle, Circle, Lock } from 'lucide-react';

interface ProgressStep {
  id: string;
  label: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming' | 'locked';
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  orientation?: 'horizontal' | 'vertical';
  showDescriptions?: boolean;
  'data-testid'?: string;
}

export function ProgressTracker({
  steps,
  orientation = 'horizontal',
  showDescriptions = true,
  'data-testid': testId,
}: ProgressTrackerProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={`${
        isHorizontal
          ? 'flex items-start gap-4'
          : 'flex flex-col gap-4'
      }`}
      data-testid={testId}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.id}
            className={`flex ${
              isHorizontal ? 'flex-col items-center flex-1' : 'gap-4'
            }`}
            data-testid={`progress-step-${step.id}`}
          >
            <div className={`flex items-center ${isHorizontal ? 'w-full' : ''}`}>
              {/* Step Icon */}
              <StepIcon status={step.status} />

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`${
                    isHorizontal ? 'flex-1 h-0.5' : 'w-0.5 h-12 ml-4'
                  } ${
                    step.status === 'completed'
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              )}
            </div>

            {/* Step Content */}
            <div className={`${isHorizontal ? 'text-center mt-3' : 'flex-1'}`}>
              <h4
                className={`font-medium ${
                  step.status === 'locked'
                    ? 'text-gray-400'
                    : step.status === 'current'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {step.label}
              </h4>
              {showDescriptions && step.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StepIcon({ status }: { status: ProgressStep['status'] }) {
  const baseClasses = 'flex items-center justify-center w-8 h-8 rounded-full';

  if (status === 'completed') {
    return (
      <div className={`${baseClasses} bg-green-500`}>
        <CheckCircle className="h-5 w-5 text-white" />
      </div>
    );
  }

  if (status === 'current') {
    return (
      <div className={`${baseClasses} bg-blue-500 ring-4 ring-blue-200 dark:ring-blue-900`}>
        <Circle className="h-5 w-5 text-white fill-current" />
      </div>
    );
  }

  if (status === 'locked') {
    return (
      <div className={`${baseClasses} bg-gray-300 dark:bg-gray-600`}>
        <Lock className="h-4 w-4 text-gray-500" />
      </div>
    );
  }

  return (
    <div className={`${baseClasses} border-2 border-gray-300 dark:border-gray-600`}>
      <Circle className="h-5 w-5 text-gray-400" />
    </div>
  );
}

/**
 * Circular Progress Ring
 */
interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  'data-testid'?: string;
}

export function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = '#3b82f6',
  label,
  'data-testid': testId,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" data-testid={testId}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress Circle */}
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
          className="transition-all duration-500"
        />
      </svg>
      
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">
          {Math.round(percentage)}%
        </span>
        {label && (
          <span className="text-xs text-gray-500 mt-1">{label}</span>
        )}
      </div>
    </div>
  );
}

/**
 * Linear Progress Bar
 */
interface LinearProgressProps {
  percentage: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  'data-testid'?: string;
}

export function LinearProgress({
  percentage,
  label,
  showPercentage = true,
  variant = 'default',
  size = 'md',
  animated = false,
  'data-testid': testId,
}: LinearProgressProps) {
  const colors = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-orange-500',
    danger: 'bg-red-500',
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full" data-testid={testId}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      
      <div className={`w-full ${sizes[size]} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <div
          className={`${sizes[size]} ${colors[variant]} rounded-full transition-all duration-500 ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
