/**
 * Card - Enhanced Card Component
 * Provides consistent card styling with hover effects
 */

import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: React.MouseEventHandler;
  testId?: string;
  role?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'data-testid'?: string;
}

export function Card({ children, className = '', interactive = false, onClick, testId, role, 'aria-live': ariaLive, 'data-testid': dataTestId }: CardProps) {
  const baseClasses = 'card';
  const interactiveClasses = interactive ? 'card-interactive' : '';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (interactive && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e as any);
    }
  };

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={role || (interactive ? 'button' : undefined)}
      aria-live={ariaLive}
      tabIndex={interactive ? 0 : undefined}
      data-testid={dataTestId || testId}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  testId?: string;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  color = 'blue',
  testId 
}: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-yellow-600 bg-yellow-50',
  };

  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div className="stat-card" data-testid={testId}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        {icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-900" data-testid={`${testId}-value`}>
          {value}
        </p>
      </div>
      
      {(subtitle || trendValue) && (
        <div className="flex items-center gap-2 text-sm">
          {trendValue && trend && (
            <span className={`font-medium ${trendClasses[trend]}`} data-testid={`${testId}-trend`}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trendValue}
            </span>
          )}
          {subtitle && (
            <span className="text-gray-500" data-testid={`${testId}-subtitle`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
