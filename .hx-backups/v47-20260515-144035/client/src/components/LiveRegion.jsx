import { useState, useEffect, createContext, useContext, useCallback } from "react";

const LiveRegionContext = createContext(null);

export function LiveRegionProvider({ children }) {
  const [message, setMessage] = useState("");
  const [politeness, setPoliteness] = useState("polite");

  const announce = useCallback((text, priority = "polite") => {
    setMessage("");
    setPoliteness(priority);
    setTimeout(() => setMessage(text), 100);
  }, []);

  const announcePolite = useCallback((text) => announce(text, "polite"), [announce]);
  const announceAssertive = useCallback((text) => announce(text, "assertive"), [announce]);

  return (
    <LiveRegionContext.Provider value={{ announce, announcePolite, announceAssertive }}>
      {children}
      <div
        role="status"
        aria-live={politeness}
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>
    </LiveRegionContext.Provider>
  );
}

export function useLiveRegion() {
  const context = useContext(LiveRegionContext);
  if (!context) {
    return {
      announce: () => {},
      announcePolite: () => {},
      announceAssertive: () => {},
    };
  }
  return context;
}

export function useAnnounceOnMount(message, dependencies = []) {
  const { announcePolite } = useLiveRegion();
  
  useEffect(() => {
    if (message) {
      announcePolite(message);
    }
  }, dependencies);
}

export function FormErrorSummary({ errors, id = "form-errors" }) {
  const errorList = Object.entries(errors).filter(([_, error]) => error?.message);
  
  if (errorList.length === 0) return null;
  
  return (
    <div 
      id={id}
      role="alert"
      aria-live="polite"
      className="p-4 bg-[var(--accent-rose-soft)] border border-[var(--accent-rose)]/30 rounded-xl mb-4"
    >
      <h3 className="text-sm font-semibold text-[var(--accent-rose)] mb-2">
        Please fix the following errors:
      </h3>
      <ul className="list-disc list-inside text-sm text-[var(--accent-rose)] space-y-1">
        {errorList.map(([field, error]) => (
          <li key={field}>{error.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default LiveRegionProvider;
