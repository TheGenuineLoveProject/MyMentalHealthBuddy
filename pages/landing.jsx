// /pages/landing.jsx
import PageTemplate from "@/components/PageTemplate";
import { getRouteConfig } from "@/content/routes";

export default function MarketingLandingPage() {
  return <PageTemplate config={getRouteConfig("/landing")} />;
}