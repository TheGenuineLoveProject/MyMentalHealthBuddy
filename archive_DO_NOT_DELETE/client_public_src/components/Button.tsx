/**
 * Button - Enhanced Button Component
 * Consistent styling with visual feedback across the platform
 */

import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg hover:-translate-y-0.5',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg hover:-translate-y-0.5',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="inline-flex">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
