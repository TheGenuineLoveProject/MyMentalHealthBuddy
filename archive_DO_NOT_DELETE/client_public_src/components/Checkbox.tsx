/**
 * Checkbox Component
 * Accessible checkbox input with indeterminate support
 */

import { useEffect, useRef } from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
  'data-testid'?: string;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

export function Checkbox({
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
  'aria-label': ariaLabel,
  'data-testid': testId,
  onClick,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={inputRef}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={testId}
      onClick={onClick}
      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}
