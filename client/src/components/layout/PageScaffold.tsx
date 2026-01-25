import { ReactNode } from "react";
import { SEO } from "@/components/SEO";
// @ts-ignore - JSX component
import SafetyFooter from "@/components/ui/SafetyFooter";
// @ts-ignore - JSX component  
import { BenefitsBlock } from "@/components/BenefitsBlock";

interface PageScaffoldProps {
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
  const defaultBullets = benefitsBullets || [
    "Learn at your own pace with no pressure",
    "Practice skills that support emotional wellbeing",
    "Access evidence-informed approaches anytime",
  ];

  return (
    <div className={`min-h-screen safe-padding ${className}`}>
      <SEO 
        title={`${title} — The Genuine Love Project`} 
        description={description}
        noindex={noIndex}
      />
      
      <header className="text-center py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      </header>

      {showBenefits && (
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <BenefitsBlock
            benefit={benefits || "Educational self-reflection tools for personal growth"}
            bullets={defaultBullets}
            benefitFamily={benefitFamily}
          />
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
