/**
 * ============================================================================
 * HERO SECTION COMPONENT
 * ============================================================================
 * 
 * Reusable hero sections with gentle gradients and brand styling
 * Brand Colors: #8fbf9f (sage), #f4c7c3 (rose), #2f5d5d (teal), #eac33b (gold)
 * 
 * Variants:
 *   - default: Standard centered hero
 *   - split: Two-column layout with image
 *   - minimal: Compact hero for inner pages
 * ============================================================================
 */

import { Link } from "wouter";
import { ArrowRight, Heart, Sparkles, Play } from "lucide-react";

export default function HeroSection({
  variant = "default",
  badge,
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  image,
  stats,
  children,
  className = ""
}) {
  if (variant === "split") {
    return (
      <section 
        className={`py-16 lg:py-24 px-6 ${className}`}
        style={{ background: 'linear-gradient(180deg, rgba(143, 191, 159, 0.08) 0%, transparent 100%)' }}
        aria-labelledby="hero-heading"
        data-component="HeroSection"
        data-variant="split"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {badge && (
                <span 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                  style={{ background: 'rgba(234, 195, 59, 0.15)', color: '#8B7023' }}
                  data-slot="badge"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  {badge}
                </span>
              )}

              <h1 
                id="hero-heading"
                className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6"
                style={{ color: '#2f5d5d' }}
                data-slot="title"
              >
                {title}
              </h1>

              <p 
                className="text-lg md:text-xl leading-relaxed mb-8"
                style={{ color: '#3a3a3a', opacity: 0.8 }}
                data-slot="subtitle"
              >
                {subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4" data-slot="cta-buttons">
                {primaryCTA && (
                  <Link href={primaryCTA.href || "#"}>
                    <button 
                      className="px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-transform hover:scale-105"
                      style={{ background: '#eac33b', color: '#2f5d5d' }}
                      data-testid="button-hero-primary"
                    >
                      {primaryCTA.text}
                      <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </Link>
                )}
                {secondaryCTA && (
                  <Link href={secondaryCTA.href || "#"}>
                    <button 
                      className="px-8 py-4 rounded-full font-semibold text-lg transition-colors hover:bg-teal-50"
                      style={{ background: 'transparent', color: '#2f5d5d', border: '2px solid #2f5d5d' }}
                      data-testid="button-hero-secondary"
                    >
                      {secondaryCTA.text}
                    </button>
                  </Link>
                )}
              </div>

              {stats && (
                <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t" style={{ borderColor: 'rgba(143, 191, 159, 0.2)' }}>
                  {stats.map((stat, i) => (
                    <div key={i}>
                      <p className="text-3xl font-bold" style={{ color: '#2f5d5d' }}>{stat.value}</p>
                      <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.6 }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              {image ? (
                <div 
                  className="rounded-3xl overflow-hidden shadow-2xl"
                  style={{ aspectRatio: '4/3' }}
                >
                  <img 
                    src={image} 
                    alt="" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div 
                  className="rounded-3xl overflow-hidden relative"
                  style={{ 
                    aspectRatio: '4/3',
                    background: 'linear-gradient(135deg, rgba(143, 191, 159, 0.3), rgba(244, 199, 195, 0.3))'
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="w-32 h-32 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.8)' }}
                    >
                      <Heart className="w-16 h-16" style={{ color: '#8fbf9f' }} aria-hidden="true" />
                    </div>
                  </div>
                  <div 
                    className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full"
                    style={{ background: 'rgba(234, 195, 59, 0.3)' }}
                    aria-hidden="true"
                  />
                  <div 
                    className="absolute -top-4 -left-4 w-16 h-16 rounded-full"
                    style={{ background: 'rgba(244, 199, 195, 0.5)' }}
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "minimal") {
    return (
      <section 
        className={`py-12 px-6 text-center ${className}`}
        style={{ background: 'linear-gradient(180deg, rgba(143, 191, 159, 0.05) 0%, transparent 100%)' }}
        aria-labelledby="hero-heading"
        data-component="HeroSection"
        data-variant="minimal"
      >
        <div className="max-w-3xl mx-auto">
          {badge && (
            <span 
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'rgba(143, 191, 159, 0.15)', color: '#2f5d5d' }}
              data-slot="badge"
            >
              {badge}
            </span>
          )}

          <h1 
            id="hero-heading"
            className="text-3xl md:text-4xl font-serif font-bold mb-4"
            style={{ color: '#2f5d5d' }}
            data-slot="title"
          >
            {title}
          </h1>

          {subtitle && (
            <p 
              className="text-lg"
              style={{ color: '#3a3a3a', opacity: 0.7 }}
              data-slot="subtitle"
            >
              {subtitle}
            </p>
          )}

          {children}
        </div>
      </section>
    );
  }

  return (
    <section 
      className={`py-20 lg:py-28 px-6 text-center ${className}`}
      style={{ background: 'linear-gradient(180deg, rgba(143, 191, 159, 0.1) 0%, transparent 100%)' }}
      aria-labelledby="hero-heading"
      data-component="HeroSection"
      data-variant="default"
    >
      <div className="max-w-4xl mx-auto">
        {badge && (
          <span 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ background: 'rgba(234, 195, 59, 0.2)', color: '#8B7023' }}
            data-slot="badge"
          >
            <Heart className="w-4 h-4" aria-hidden="true" />
            {badge}
          </span>
        )}

        <h1 
          id="hero-heading"
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6"
          style={{ color: '#2f5d5d' }}
          data-slot="title"
        >
          {title}
        </h1>

        <p 
          className="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
          style={{ color: '#3a3a3a', opacity: 0.8 }}
          data-slot="subtitle"
        >
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center" data-slot="cta-buttons">
          {primaryCTA && (
            <Link href={primaryCTA.href || "#"}>
              <button 
                className="px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: '#eac33b', color: '#2f5d5d' }}
                data-testid="button-hero-primary"
              >
                {primaryCTA.icon === "play" && <Play className="w-5 h-5" aria-hidden="true" />}
                {primaryCTA.text}
                {!primaryCTA.icon && <ArrowRight className="w-5 h-5" aria-hidden="true" />}
              </button>
            </Link>
          )}
          {secondaryCTA && (
            <Link href={secondaryCTA.href || "#"}>
              <button 
                className="px-8 py-4 rounded-full font-semibold text-lg transition-colors hover:bg-teal-50"
                style={{ background: 'transparent', color: '#2f5d5d', border: '2px solid #2f5d5d' }}
                data-testid="button-hero-secondary"
              >
                {secondaryCTA.text}
              </button>
            </Link>
          )}
        </div>

        {stats && (
          <div 
            className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t"
            style={{ borderColor: 'rgba(143, 191, 159, 0.2)' }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold" style={{ color: '#2f5d5d' }}>{stat.value}</p>
                <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.6 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
