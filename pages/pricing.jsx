// /pages/pricing.jsx
import PageTemplate from "@/components/PageTemplate";
import { getRouteConfig } from "@/content/routes";

export default function PricingPage() {
  return <PageTemplate config={getRouteConfig("/pricing")} />;
}