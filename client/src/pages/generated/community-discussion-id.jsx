// @generated
/**
 * Dynamic route stub for /community/discussion/:id
 * Parameter: id
 */

import { useRoute } from 'wouter';
import AutopilotPage from '../_autopilot.jsx';
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { BenefitsBlock } from "@/components/BenefitsBlock";

export default function DynamicPage() {
  const [, params] = useRoute('/community/discussion/:id');
  const id = params?.id;
  
  return <AutopilotPage dynamicParam={id} />;
}
