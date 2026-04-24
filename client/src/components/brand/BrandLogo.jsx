import { Link } from "wouter";

const SIZES = {
  xs: { img: "w-8 h-8", radius: "rounded-lg", shadow: "0 1px 6px" },
  sm: { img: "w-10 h-10", radius: "rounded-xl", shadow: "0 2px 10px" },
  md: { img: "w-12 h-12 sm:w-14 sm:h-14", radius: "rounded-xl", shadow: "0 3px 14px" },
  lg: { img: "w-14 h-14 sm:w-16 sm:h-16", radius: "rounded-2xl", shadow: "0 4px 18px" },
  xl: { img: "w-20 h-20 md:w-24 md:h-24", radius: "rounded-2xl", shadow: "0 6px 24px" },
};

export default function BrandLogo({
  size = "md",
  showText = false,
  linkTo = "/",
  className = "",
  textClassName = "",
  "data-testid": testId = "brand-logo",
}) {
  const s = SIZES[size] || SIZES.md;
  const shadowColor = "var(--glp-sage-deep-20, rgba(38,79,79,0.2))";

  const content = (
    <div className={`flex items-center gap-3 ${className}`} data-testid={testId}>
      <span className={`brand-logo-mark relative inline-block ${s.img} ${s.radius}`}>
        <span aria-hidden className="brand-logo-halo" />
        <img
          src="/brand/mmhb-icon.svg"
          alt="MyMentalHealthBuddy"
          className={`brand-logo-img relative z-[1] w-full h-full ${s.radius} object-contain transition-transform duration-300`}
          style={{ boxShadow: `${s.shadow} ${shadowColor}` }}
          draggable="false"
        />
      </span>
      {showText && (
        <div className={`flex flex-col leading-snug ${textClassName}`}>
          <span
            className="text-sm sm:text-lg lg:text-xl font-bold tracking-tight"
            style={{ color: "var(--glp-sage-deep)" }}
          >
            MyMentalHealthBuddy
          </span>
          <span
            className="text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase mt-0.5"
            style={{ color: "var(--glp-sage)" }}
          >
            by The Genuine Love Project
          </span>
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} className="group cursor-pointer">
        {content}
      </Link>
    );
  }

  return content;
}
