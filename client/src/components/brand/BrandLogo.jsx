import { Link } from "wouter";
import LumiMascot from "../lumi/LumiMascot.jsx";

// PHASE114Y_BRANDLOGO_VISUAL_POLISH_PATCH

const SIZES = {
  xs: { img: "w-8 h-8", radius: "rounded-full", shadow: "0 1px 6px", px: 32 },
  sm: { img: "w-10 h-10", radius: "rounded-full", shadow: "0 2px 10px", px: 40 },
  md: { img: "w-12 h-12 sm:w-14 sm:h-14", radius: "rounded-full", shadow: "0 3px 14px", px: 56 },
  lg: { img: "w-14 h-14 sm:w-16 sm:h-16", radius: "rounded-full", shadow: "0 4px 18px", px: 64 },
  xl: { img: "w-20 h-20 md:w-24 md:h-24", radius: "rounded-full", shadow: "0 6px 24px", px: 96 },
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
  const shadowColor = "rgba(47,93,93,0.18)";

  const content = (
    <div className={`flex items-center gap-3 ${className}`} data-testid={testId}>
      <span className={`brand-logo-mark relative inline-block ${s.img} ${s.radius} transition-transform duration-300 group-hover:scale-105`}>
        <span aria-hidden className="brand-logo-halo absolute inset-[-10%] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.20),rgba(143,191,159,0.16)_45%,transparent_72%)] blur-md" />
        <span
          aria-hidden="true"
          className={`brand-logo-img relative z-[1] w-full h-full ${s.radius} flex items-center justify-center overflow-hidden transition-transform duration-300`}
          style={{ background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.96) 0%, rgba(143,191,159,0.24) 48%, rgba(47,93,93,0.10) 100%)', boxShadow: `${s.shadow} ${shadowColor}` }}
        >
          <LumiMascot emotion="neutral" size={s.px} className="drop-shadow-sm" />
        </span>
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
      <Link
        href={linkTo}
        className="brand-logo-link group cursor-pointer no-underline"
        style={{ textDecoration: "none" }}
      >
        {content}
      </Link>
    );
  }

  return content;
}
