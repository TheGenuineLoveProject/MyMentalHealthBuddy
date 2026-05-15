import { createContext, useContext, useMemo } from "react";
import { FEATURE_FLAGS, isEnabled as checkEnabled, getFlagStatus } from "../../../shared/featureFlags.mjs";
import { useAuth } from "../context/AuthContext";

const FeatureFlagContext = createContext({
  flags: FEATURE_FLAGS,
  isEnabled: () => true,
  getFlagStatus: () => null,
});

export function FeatureFlagProvider({ children }) {
  const { user } = useAuth();

  const value = useMemo(() => {
    const isAdmin = user?.isAdmin || false;
    const userContext = { isAdmin };

    return {
      flags: FEATURE_FLAGS,
      isEnabled: (flagName) => checkEnabled(flagName, userContext),
      getFlagStatus: (flagName) => getFlagStatus(flagName),
    };
  }, [user?.isAdmin]);

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  return useContext(FeatureFlagContext);
}
