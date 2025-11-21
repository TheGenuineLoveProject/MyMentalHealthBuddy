/**
 * Badge - Status and Label Component
 * Consistent badge styling across the platform
 */

import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
  testId?: string;
}

export function Badge({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  testId
}: BadgeProps) {
  const variantClasses = {
    primary: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    danger: 'bg-red-50 text-red-700',
    gray: 'bg-gray-100 text-gray-700',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  };

  return (
    <span
      className={`badge inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      data-testid={testId}
    >
      {children}
    </span>
  );
}
