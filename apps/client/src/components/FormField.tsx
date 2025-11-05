/**
 * Enhanced Form Field Component
 * Provides inline validation, success states, and better UX
 */

import { useState, useId, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  success?: boolean;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  rows?: number; // For textarea
  autoComplete?: string;
  'data-testid'?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  success,
  hint,
  required,
  disabled,
  placeholder,
  maxLength,
  minLength,
  pattern,
  rows = 4,
  autoComplete,
  'data-testid': testId,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);
  const id = useId();

  const handleBlur = () => {
    setIsFocused(false);
    setHasBeenTouched(true);
    onBlur?.();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const showError = error && hasBeenTouched && !isFocused;
  const showSuccess = success && hasBeenTouched && !isFocused && !error;
  const characterCount = value.length;
  const isNearLimit = maxLength && characterCount > maxLength * 0.8;

  const baseInputClasses = `
    w-full px-4 py-2 rounded-lg border transition-all
    focus:outline-none focus:ring-2
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
    dark:bg-gray-800 dark:disabled:bg-gray-900
  `;

  const stateClasses = showError
    ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900'
    : showSuccess
    ? 'border-green-300 focus:border-green-500 focus:ring-green-200 dark:border-green-700 dark:focus:ring-green-900'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:ring-blue-900';

  const InputElement = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="space-y-2" data-testid={testId}>
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        <InputElement
          id={id}
          name={name}
          type={type !== 'textarea' ? type : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          autoComplete={autoComplete}
          rows={type === 'textarea' ? rows : undefined}
          className={`${baseInputClasses} ${stateClasses} ${
            showSuccess || showError ? 'pr-10' : ''
          }`}
          aria-invalid={showError}
          aria-describedby={`${id}-hint ${id}-error`}
          data-testid={`input-${name}`}
        />

        {/* Success/Error Icons */}
        {(showSuccess || showError) && (
          <div className="absolute right-3 top-2 pointer-events-none">
            {showSuccess && (
              <CheckCircle className="h-5 w-5 text-green-500" aria-label="Valid input" />
            )}
            {showError && (
              <AlertCircle className="h-5 w-5 text-red-500" aria-label="Invalid input" />
            )}
          </div>
        )}
      </div>

      {/* Hint/Helper Text */}
      {hint && !showError && (
        <p
          id={`${id}-hint`}
          className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"
        >
          <Info className="h-3 w-3" />
          {hint}
        </p>
      )}

      {/* Error Message */}
      {showError && (
        <p
          id={`${id}-error`}
          className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-slide-in-left"
          role="alert"
          data-testid={`error-${name}`}
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      {/* Success Message */}
      {showSuccess && (
        <p
          className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 animate-slide-in-left"
          data-testid={`success-${name}`}
        >
          <CheckCircle className="h-4 w-4" />
          Looks good!
        </p>
      )}

      {/* Character Count */}
      {maxLength && (
        <div className="flex justify-end">
          <span
            className={`text-xs ${
              isNearLimit ? 'text-orange-500 font-medium' : 'text-gray-500'
            }`}
          >
            {characterCount} / {maxLength}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Form Field Group - For related inputs
 */
interface FormFieldGroupProps {
  legend: string;
  children: ReactNode;
  error?: string;
  'data-testid'?: string;
}

export function FormFieldGroup({ legend, children, error, 'data-testid': testId }: FormFieldGroupProps) {
  return (
    <fieldset className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg" data-testid={testId}>
      <legend className="text-lg font-semibold px-2">{legend}</legend>
      {children}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-2" role="alert">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

/**
 * Validation Helpers
 */
export const validators = {
  required: (value: string) => (!value.trim() ? 'This field is required' : ''),
  
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value && !emailRegex.test(value) ? 'Please enter a valid email address' : '';
  },
  
  minLength: (min: number) => (value: string) =>
    value && value.length < min ? `Must be at least ${min} characters` : '',
  
  maxLength: (max: number) => (value: string) =>
    value && value.length > max ? `Must be no more than ${max} characters` : '',
  
  pattern: (regex: RegExp, message: string) => (value: string) =>
    value && !regex.test(value) ? message : '',
  
  url: (value: string) => {
    try {
      if (value) new URL(value);
      return '';
    } catch {
      return 'Please enter a valid URL';
    }
  },
  
  phone: (value: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return value && !phoneRegex.test(value) ? 'Please enter a valid phone number' : '';
  },
  
  combine: (...validators: Array<(value: string) => string>) => (value: string) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return '';
  },
};
