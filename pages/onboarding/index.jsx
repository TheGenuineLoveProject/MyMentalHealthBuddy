// /pages/onboarding/index.jsx
import PageTemplate from "@/components/PageTemplate";
import { getRouteConfig } from "@/content/routes";

export default function OnboardingPage() {
  return <PageTemplate config={getRouteConfig("/onboarding")} />;
}