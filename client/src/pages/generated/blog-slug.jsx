// @generated
/**
 * Dynamic route stub for /blog/:slug
 * Parameter: slug
 */

import { useRoute } from 'wouter';
import AutopilotPage from '../_autopilot.jsx';
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

export default function DynamicPage() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug;
  
  return <AutopilotPage dynamicParam={slug} />;
}
