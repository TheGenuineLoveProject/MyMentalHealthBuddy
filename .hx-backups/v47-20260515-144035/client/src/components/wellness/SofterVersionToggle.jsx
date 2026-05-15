/**
 * P122 - "Softer Version" Toggle Component
 * Allows users to switch to gentler, less intense content presentation
 * Trauma-informed design: respects user capacity for intensity
 */

import { useState, useCallback } from 'react';
import { Heart, Shield, Sparkles } from 'lucide-react';

export function SofterVersionToggle({
  defaultSofter = false,
  onToggle,
  label = "Gentler version",
  compact = false,
  className = "",
}) {
  const [isSofter, setIsSofter] = useState(defaultSofter);

  const handleToggle = useCallback(() => {
    const newValue = !isSofter;
    setIsSofter(newValue);
    if (onToggle) onToggle(newValue);
  }, [isSofter, onToggle]);

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`
          inline-flex items-center gap-1.5 px-3 py-1.5
          rounded-full text-sm font-medium
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[var(--glp-gold)] focus:ring-offset-2
          ${isSofter 
            ? 'bg-[var(--glp-sage-light)] text-[var(--glp-sage-dark)] border border-[var(--glp-sage)]' 
            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }
          ${className}
        `}
        aria-pressed={isSofter}
        aria-label={isSofter ? "Switch to standard version" : "Switch to gentler version"}
        data-testid="toggle-softer-compact"
      >
        {isSofter ? <Heart className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
        <span>{isSofter ? 'Gentler' : 'Standard'}</span>
      </button>
    );
  }

  return (
    <div 
      className={`
        p-4 rounded-lg border
        transition-all duration-200
        ${isSofter 
          ? 'bg-[var(--glp-sage-light)] border-[var(--glp-sage)]' 
          : 'bg-gray-50 border-gray-200'
        }
        ${className}
      `}
      role="region"
      aria-label="Content intensity preference"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`
            p-2 rounded-full
            ${isSofter ? 'bg-[var(--glp-sage)]' : 'bg-gray-200'}
          `}>
            {isSofter 
              ? <Sparkles className="w-5 h-5 text-white" /> 
              : <Shield className="w-5 h-5 text-gray-600" />
            }
          </div>
          <div>
            <p className="font-medium text-gray-900">{label}</p>
            <p className="text-sm text-gray-600">
              {isSofter 
                ? "Showing calmer, more supportive content" 
                : "Showing standard content"
              }
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isSofter}
          onClick={handleToggle}
          className={`
            relative inline-flex h-7 w-12 shrink-0 cursor-pointer
            rounded-full border-2 border-transparent
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-[var(--glp-gold)] focus:ring-offset-2
            ${isSofter ? 'bg-[var(--glp-sage)]' : 'bg-gray-300'}
          `}
          data-testid="toggle-softer-switch"
        >
          <span className="sr-only">
            {isSofter ? "Disable gentler version" : "Enable gentler version"}
          </span>
          <span
            aria-hidden="true"
            className={`
              pointer-events-none inline-block h-6 w-6
              transform rounded-full bg-white shadow-lg ring-0
              transition duration-200 ease-in-out
              ${isSofter ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {isSofter && (
        <div className="mt-3 pt-3 border-t border-[var(--glp-sage)] border-opacity-30">
          <p className="text-sm text-[var(--glp-sage-dark)] flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>Take your time. You're in control of your experience.</span>
          </p>
        </div>
      )}
    </div>
  );
}

export function useSofterVersion(defaultValue = false) {
  const [isSofter, setIsSofter] = useState(defaultValue);
  
  const toggleSofter = useCallback(() => {
    setIsSofter(prev => !prev);
  }, []);

  return {
    isSofter,
    setIsSofter,
    toggleSofter,
    SofterVersionToggle: (props) => (
      <SofterVersionToggle
        {...props}
        defaultSofter={isSofter}
        onToggle={setIsSofter}
      />
    ),
  };
}

export default SofterVersionToggle;
