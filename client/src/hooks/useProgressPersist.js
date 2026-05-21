import { useState, useEffect, useCallback } from "react";

const STORAGE_PREFIX = "glp_progress_";

export function useProgressPersist(key, initialValue = null) {
  const storageKey = `${STORAGE_PREFIX}${key}`;

  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.expiry && Date.now() > parsed.expiry) {
          try { localStorage.removeItem(storageKey); } catch (err) { console.warn("[storage-safe-write]", err); }
          return initialValue;
        }
        return parsed.value;
      }
    } catch {
      // Ignore parse errors
    }
    return initialValue;
  });

  const [lastUpdated, setLastUpdated] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.timestamp ? new Date(parsed.timestamp) : null;
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  });

  const saveProgress = useCallback((newValue, expiryMs = null) => {
    setValue(newValue);
    setLastUpdated(new Date());

    const data = {
      value: newValue,
      timestamp: new Date().toISOString(),
      expiry: expiryMs ? Date.now() + expiryMs : null
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save progress:", error);
    }
  }, [storageKey]);

  const clearProgress = useCallback(() => {
    setValue(initialValue);
    setLastUpdated(null);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore errors
    }
  }, [storageKey, initialValue]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === storageKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setValue(parsed.value);
          setLastUpdated(parsed.timestamp ? new Date(parsed.timestamp) : null);
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [storageKey]);

  return {
    value,
    saveProgress,
    clearProgress,
    lastUpdated,
    hasProgress: value !== initialValue
  };
}
