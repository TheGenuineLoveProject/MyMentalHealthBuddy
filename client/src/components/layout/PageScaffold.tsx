import { ReactNode } from "react";
import { SEO } from "@/components/seo/SEO";
import { SafetyFooter } from "@/components/safety/SafetyFooter";
import { BenefitsBlock } from "@/components/marketing/BenefitsBlock";
import { buildPageContext } from "@/content/context/buildPageContext";
import { getBenefitsForRoute } from "@/content/benefits/benefitsBank";

interface PageScaffoldProps {
  routeKey?: string;
  title: string;
  description: string;
  benefits?: string;
  benefitsBullets?: string[];
  benefitFamily?: "agency" | "clarity" | "growth" | "healing" | "connection" | "mastery" | "peace";
  noIndex?: boolean;
  showBenefits?: boolean;
  showSafetyFooter?: boolean;
  className?: string;
  children: ReactNode;
}

export function PageScaffold({
  routeKey,
  title,
  description,
  benefits,
  benefitsBullets,
  benefitFamily = "growth",
  noIndex = false,
  showBenefits = true,
  showSafetyFooter = true,
  className = "",
  children,
}: PageScaffoldProps) {
  const context = routeKey ? buildPageContext(routeKey) : null;
  
  const pageTitle = title || context?.title || "Page";
  const pageDescription = description || context?.description || "";
  const pageBenefits = benefitsBullets || 
    (routeKey ? getBenefitsForRoute(routeKey).slice(0, 3) : [
      "Learn at your own pace with no pressure",
      "Practice skills that support emotional wellbeing",
      "Access evidence-informed approaches anytime",
    ]);

  return (
    <div className={`min-h-screen safe-padding ${className}`}>
      <SEO 
        title={`${pageTitle} — The Genuine Love Project`} 
        description={pageDescription}
        noIndex={noIndex}
      />
      
      <header className="text-center py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          {pageTitle}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {pageDescription}
        </p>
      </header>

      {showBenefits && pageBenefits.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <BenefitsBlock benefits={pageBenefits} />
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4">
        {children}
      </main>

      {showSafetyFooter && (
        <SafetyFooter className="mt-12" />
      )}
    </div>
  );
}

export default PageScaffold;
