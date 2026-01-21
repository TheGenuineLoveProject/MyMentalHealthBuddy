import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function RelatedNextSteps({ steps, title = "Related Next Steps" }) {
  if (!steps || steps.length === 0) return null;
  
  return (
    <section className="mt-12 pt-8 border-t border-[var(--border)]" aria-labelledby="related-steps-heading">
      <h2 id="related-steps-heading" className="text-heading-sm text-teal mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, index) => (
          <Link
            key={step.path}
            href={step.path}
            className="group flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--glp-sage)] hover:bg-[var(--surface-2)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
            data-testid={`related-step-${index}`}
          >
            <div>
              <h3 className="font-medium text-[var(--text-1)] group-hover:text-[var(--glp-primary)] transition">
                {step.title}
              </h3>
              {step.description && (
                <p className="text-sm text-[var(--text-2)] mt-1">{step.description}</p>
              )}
            </div>
            <ArrowRight className="w-5 h-5 text-[var(--text-3)] group-hover:text-[var(--glp-primary)] group-hover:translate-x-1 transition-all flex-shrink-0" aria-hidden="true" />
          </Link>
        ))}
      </div>
      
      <div className="mt-6 p-4 rounded-xl bg-[var(--sage-50)] border border-[var(--sage-200)]">
        <p className="text-sm text-[var(--text-2)]">
          Need immediate support? <Link href="/crisis" className="text-[var(--glp-primary)] font-medium hover:underline">Crisis resources</Link> are available 24/7.
        </p>
      </div>
    </section>
  );
}
