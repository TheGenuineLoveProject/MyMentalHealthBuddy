import { useFeatureFlags } from "../../contexts/FeatureFlagContext";
import { Redirect } from "wouter";

export default function FeatureGuard({ flag, fallback = "/coming-soon", children }) {
  const { isEnabled, getFlagStatus } = useFeatureFlags();

  if (!isEnabled(flag)) {
    const status = getFlagStatus(flag);
    const featureName = status?.label || flag;
    const redirectPath = `${fallback}?feature=${encodeURIComponent(featureName)}`;
    return <Redirect to={redirectPath} />;
  }

  return children;
}
