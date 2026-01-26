interface BenefitsBlockProps {
  title?: string;
  benefits: string[];
  className?: string;
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function BenefitsBlock({
  title = "How this helps you",
  benefits,
  className = ""
}: BenefitsBlockProps) {
  if (!benefits || benefits.length === 0) {
    return null;
  }

  return (
    <section
      className={`p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 ${className}`}
      aria-labelledby="benefits-heading"
      data-testid="benefits-block"
    >
      <h3
        id="benefits-heading"
        className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4"
        data-testid="benefits-title"
      >
        {title}
      </h3>
      <ul className="space-y-3" role="list" data-testid="benefits-list">
        {benefits.slice(0, 5).map((benefit, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-green-800 dark:text-green-200"
            data-testid={`benefit-item-${index}`}
          >
            <CheckIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
            <span className="text-sm leading-relaxed">{benefit}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default BenefitsBlock;
