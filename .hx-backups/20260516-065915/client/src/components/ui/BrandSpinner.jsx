/**
 * BrandSpinner.jsx — small inline branded spinner.
 * Drop-in replacement for <Loader2 className="w-4 h-4 animate-spin" />
 * for in-button / inline-text loading states. Uses the same sage-aurora
 * vocabulary as the rest of the platform; gated by prefers-reduced-motion
 * via the .brand-spinner class in index.css.
 *
 * For full-page / large area loading states, prefer <LotusLoader />.
 *
 * @param {number} size  - pixel size (default 16)
 * @param {string} className - extra classes
 * @param {string} label - accessible label (default "Loading")
 */
export default function BrandSpinner({ size = 16, className = "", label = "Loading" }) {
  return (
    <span
      className={`brand-spinner ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label={label}
      data-testid="spinner-brand"
    />
  );
}
