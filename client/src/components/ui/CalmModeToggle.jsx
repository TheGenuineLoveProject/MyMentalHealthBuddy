/**
 * Calm Mode Toggle (P180)
 * Allows users to toggle reduced motion and simplified visuals
 */

import { useState, useEffect } from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';

export function CalmModeToggle({ className = '' }) {
  const [calmMode, setCalmMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('glp-calm-mode') === 'true' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (calmMode) {
      document.documentElement.classList.add('calm-mode');
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    } else {
      document.documentElement.classList.remove('calm-mode');
      document.documentElement.style.removeProperty('--animation-duration');
    }
    localStorage.setItem('glp-calm-mode', calmMode.toString());
  }, [calmMode]);

  return (
    <button
      onClick={() => setCalmMode(!calmMode)}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
        ${calmMode 
          ? 'bg-muted text-muted-foreground hover:bg-muted/80' 
          : 'bg-primary/10 text-primary hover:bg-primary/20'
        } ${className}`}
      aria-pressed={calmMode}
      aria-label={calmMode ? 'Disable calm mode' : 'Enable calm mode'}
      data-testid="toggle-calm-mode"
    >
      {calmMode ? (
        <>
          <Moon className="h-4 w-4" />
          <span>Calm Mode</span>
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          <span>Full Experience</span>
        </>
      )}
    </button>
  );
}

export function useCalmMode() {
  const [calmMode, setCalmMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('glp-calm-mode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const handleChange = () => {
      setCalmMode(localStorage.getItem('glp-calm-mode') === 'true');
    };
    window.addEventListener('storage', handleChange);
    return () => window.removeEventListener('storage', handleChange);
  }, []);

  return calmMode;
}

export default CalmModeToggle;
