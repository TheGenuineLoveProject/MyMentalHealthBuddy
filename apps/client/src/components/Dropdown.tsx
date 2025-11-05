/**
 * Dropdown Component
 * Accessible dropdown menu with keyboard navigation
 */

import { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  'data-testid'?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  'data-testid': testId,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    const enabledOptions = options.filter((opt) => !opt.disabled && !opt.divider);

    // Guard against empty options
    if (enabledOptions.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      return;
    }

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0 && focusedIndex < enabledOptions.length) {
          const option = enabledOptions[focusedIndex];
          if (option) {
            onChange(option.value);
            setIsOpen(false);
            setFocusedIndex(-1);
          }
        } else {
          setIsOpen(!isOpen);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) => {
            const next = (prev + 1) % enabledOptions.length;
            return next;
          });
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => {
            const next = (prev - 1 + enabledOptions.length) % enabledOptions.length;
            return next;
          });
        }
        break;

      case 'Home':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(0);
        }
        break;

      case 'End':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(enabledOptions.length - 1);
        }
        break;
    }
  };

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled || option.divider) return;
    onChange(option.value);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const enabledOptions = options.filter((opt) => !opt.disabled && !opt.divider);
  const activedescendantId = focusedIndex >= 0 && focusedIndex < enabledOptions.length 
    ? `option-${enabledOptions[focusedIndex].value}` 
    : undefined;

  return (
    <div ref={dropdownRef} className="relative" {...(testId && { 'data-testid': testId })}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-2 
          bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
          rounded-lg shadow-sm transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer'}
          ${isOpen ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-900' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-activedescendant={isOpen ? activedescendantId : undefined}
        {...(testId && { 'data-testid': `${testId}-trigger` })}
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon}
          <span className={selectedOption ? '' : 'text-gray-500'}>
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg animate-scale-in"
          {...(testId && { 'data-testid': `${testId}-menu` })}
        >
          <div className="py-1 max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No options available</div>
            ) : (
              options.map((option, index) => {
                if (option.divider) {
                  return (
                    <div
                      key={`divider-${index}`}
                      className="my-1 border-t border-gray-200 dark:border-gray-700"
                    />
                  );
                }

                const isSelected = option.value === value;
                const isFocused = enabledOptions.indexOf(option) === focusedIndex;

                return (
                  <button
                    key={option.value}
                    id={`option-${option.value}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option)}
                    disabled={option.disabled}
                    className={`
                      w-full flex items-center justify-between px-4 py-2 text-left transition-colors
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      ${isFocused ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                      ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}
                    `}
                    {...(testId && { 'data-testid': `${testId}-option-${option.value}` })}
                  >
                    <span className="flex items-center gap-2">
                      {option.icon}
                      {option.label}
                    </span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Simple Select Component (alternative to Dropdown)
 */
interface SelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  'data-testid'?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  'data-testid': testId,
}: SelectProps) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
      data-testid={testId}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
