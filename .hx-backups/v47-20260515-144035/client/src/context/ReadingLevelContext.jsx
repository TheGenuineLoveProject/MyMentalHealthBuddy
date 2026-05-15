/**
 * ReadingLevelContext.jsx - Content Level State Management
 * 
 * Features:
 * - Global content level state (Beginner / Intermediate / Advanced)
 * - URL query sync (?level=beginner|intermediate|advanced)
 * - localStorage persistence
 * - SSR-safe initialization
 * - Shallow routing without full reload
 * - Route-specific defaults support
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSearch } from 'wouter';
import {
  resolveReadingLevel,
  getStoredReadingLevel,
  setStoredReadingLevel,
  normalizeReadingLevel
} from '../content/readingLevels.js';

const ReadingLevelContext = createContext({
  readingLevel: 'intermediate',
  setReadingLevel: () => {},
  setRouteDefault: () => {},
  isReady: false
});

export function ReadingLevelProvider({ children }) {
  const [readingLevel, setReadingLevelState] = useState('intermediate');
  const [isReady, setIsReady] = useState(false);
  const [routeDefault, setRouteDefaultState] = useState('intermediate');
  const search = useSearch();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const queryLevel = params.get('level');
    const storedLevel = getStoredReadingLevel();

    const resolved = resolveReadingLevel({
      queryLevel,
      storedLevel,
      routeDefault
    });

    setReadingLevelState(resolved);
    setIsReady(true);
  }, [search, routeDefault]);

  const setReadingLevel = useCallback((newLevel) => {
    const normalized = normalizeReadingLevel(newLevel);
    if (!normalized) return;

    setReadingLevelState(normalized);
    setStoredReadingLevel(normalized);

    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('level', normalized);
      
      const newPath = currentUrl.pathname + currentUrl.search;
      window.history.replaceState(null, '', newPath);
    }
  }, []);

  const setRouteDefault = useCallback((defaultLevel) => {
    const normalized = normalizeReadingLevel(defaultLevel);
    if (normalized && normalized !== routeDefault) {
      setRouteDefaultState(normalized);
    }
  }, [routeDefault]);

  return (
    <ReadingLevelContext.Provider value={{ readingLevel, setReadingLevel, setRouteDefault, isReady }}>
      {children}
    </ReadingLevelContext.Provider>
  );
}

export function useReadingLevel() {
  return useContext(ReadingLevelContext);
}

export default ReadingLevelContext;
