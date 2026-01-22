/**
 * ============================================================================
 * HEALING HERO COMPONENT
 * ============================================================================
 * 
 * A stunning, emotionally healing hero section with:
 * - Sacred geometry backgrounds
 * - Breathing aura animations
 * - Fluid watercolor textures
 * - Soft-glow interactive buttons
 * 
 * 🧘 Design Philosophy: Breath of fresh air, healing, restoration
 * ============================================================================
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Heart, Sparkles, ArrowRight, Star, Leaf } from "lucide-react";
import "../styles/healing-animations.css";

export default function HealingHero({
  badge = "Transformative Healing Platform",
  title = "Heal Your Mind,\nBody & Soul",
  subtitle = "Experience profound transformation through AI-powered guidance, ancient wisdom, and a compassionate community dedicated to your wellbeing.",
  primaryCTA = { text: "Begin Your Journey", href: "/register" },
  secondaryCTA = { text: "Explore Features", href: "/features" },
  showFloatingElements = true,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--glp-paper, #faf9f7)' }}
      aria-labelledby="healing-hero-heading"
      data-component="HealingHero"
      data-testid="section-healing-hero"
    >
      {/* Sacred Geometry Background Layer */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Breathing Aura - Central */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full animate-breathing"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(143, 191, 159, 0.12) 0%, transparent 70%)',
          }}
        />
        
        {/* Rose Glow - Top Right */}
        <div 
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-60"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(244, 199, 195, 0.25) 0%, transparent 60%)',
            animation: 'breathingAura 6s ease-in-out infinite 1s',
          }}
        />
        
        {/* Gold Glow - Bottom Left */}
        <div 
          className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(234, 195, 59, 0.2) 0%, transparent 60%)',
            animation: 'breathingAura 5s ease-in-out infinite 0.5s',
          }}
        />

        {/* Sacred Geometry Rings */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border opacity-20 animate-sacred-rotate"
          style={{ borderColor: 'rgba(47, 93, 93, 0.15)' }}
        />
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border opacity-15"
          style={{ 
            borderColor: 'rgba(143, 191, 159, 0.12)',
            animation: 'sacredRotate 40s linear infinite reverse',
          }}
        />

        {/* Watercolor Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse at 15% 25%, rgba(143, 191, 159, 0.08) 0%, transparent 40%),
              radial-gradient(ellipse at 85% 75%, rgba(244, 199, 195, 0.06) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 90%, rgba(234, 195, 59, 0.05) 0%, transparent 35%)
            `,
          }}
        />
      </div>

      {/* Floating Sacred Elements */}
      {showFloatingElements && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Floating Leaf - Top Left */}
          <div 
            className="absolute top-[15%] left-[10%] animate-gentle-float opacity-60"
            style={{ animationDelay: '0s' }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center" 
              style={{ background: 'rgba(143, 191, 159, 0.15)' }}>
              <Leaf className="w-6 h-6" style={{ color: '#8fbf9f' }} />
            </div>
          </div>
          
          {/* Floating Star - Top Right */}
          <div 
            className="absolute top-[20%] right-[15%] animate-gentle-float opacity-50"
            style={{ animationDelay: '1s' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(234, 195, 59, 0.2)' }}>
              <Star className="w-5 h-5" style={{ color: '#eac33b' }} />
            </div>
          </div>
          
          {/* Floating Heart - Bottom Right */}
          <div 
            className="absolute bottom-[25%] right-[12%] animate-gentle-float opacity-50"
            style={{ animationDelay: '2s' }}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(244, 199, 195, 0.2)' }}>
              <Heart className="w-7 h-7" style={{ color: '#f4c7c3' }} />
            </div>
          </div>
          
          {/* Floating Sparkle - Bottom Left */}
          <div 
            className="absolute bottom-[30%] left-[8%] animate-gentle-float opacity-40"
            style={{ animationDelay: '1.5s' }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(47, 93, 93, 0.1)' }}>
              <Sparkles className="w-4 h-4" style={{ color: '#2f5d5d' }} />
            </div>
          </div>

          {/* Organic Floating Blobs */}
          <div 
            className="absolute top-[40%] left-[5%] w-24 h-24 organic-blob opacity-20"
            style={{ background: 'rgba(143, 191, 159, 0.3)' }}
          />
          <div 
            className="absolute bottom-[15%] right-[8%] w-32 h-32 organic-blob opacity-15"
            style={{ background: 'rgba(244, 199, 195, 0.25)', animationDelay: '2s' }}
          />
        </div>
      )}

      {/* Main Content */}
      <div 
        className={`relative z-10 max-w-5xl mx-auto px-6 text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Badge */}
        <div 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 animate-fade-in-scale"
          style={{ 
            background: 'rgba(234, 195, 59, 0.15)',
            border: '1px solid rgba(234, 195, 59, 0.3)',
          }}
          data-testid="badge-healing-hero"
        >
          <Sparkles className="w-4 h-4" style={{ color: '#eac33b' }} aria-hidden="true" />
          <span 
            className="text-sm font-medium tracking-wide"
            style={{ color: '#8B7023' }}
          >
            {badge}
          </span>
        </div>

        {/* Title with Gradient */}
        <h1 
          id="healing-hero-heading"
          className="font-serif font-bold leading-tight mb-8 animate-fade-in-up"
          style={{ 
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
            color: '#2f5d5d',
            textShadow: '0 2px 4px rgba(47, 93, 93, 0.08)',
            whiteSpace: 'pre-line',
          }}
          data-testid="heading-healing-hero"
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p 
          className="text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto animate-fade-in-up stagger-2"
          style={{ color: '#3a3a3a', opacity: 0.85 }}
          data-testid="text-healing-hero-subtitle"
        >
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up stagger-3"
          data-testid="cta-healing-hero"
        >
          {/* Primary CTA - Glowing Gold Button */}
          <Link href={primaryCTA.href}>
            <button 
              className="group relative px-10 py-4 rounded-full font-semibold text-lg flex items-center gap-3 transition-all duration-400 hover-glow-gold overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, #eac33b 0%, #ddb12d 100%)',
                color: '#2f5d5d',
                boxShadow: '0 4px 20px rgba(234, 195, 59, 0.3)',
              }}
              data-testid="button-healing-hero-primary"
            >
              {/* Shimmer Effect */}
              <span 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                  animation: 'shimmer 2s ease-in-out infinite',
                }}
                aria-hidden="true"
              />
              <span className="relative">{primaryCTA.text}</span>
              <ArrowRight className="w-5 h-5 relative transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </Link>

          {/* Secondary CTA - Subtle Outline */}
          <Link href={secondaryCTA.href}>
            <button 
              className="px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-teal-50"
              style={{ 
                background: 'transparent',
                color: '#2f5d5d',
                border: '2px solid rgba(47, 93, 93, 0.3)',
              }}
              data-testid="button-healing-hero-secondary"
            >
              {secondaryCTA.text}
            </button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div 
          className="mt-16 pt-8 border-t animate-fade-in-up stagger-4"
          style={{ borderColor: 'rgba(143, 191, 159, 0.2)' }}
        >
          <p className="text-sm mb-4" style={{ color: '#3a3a3a', opacity: 0.6 }}>
            Trusted by thousands on their healing journey
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>10,000+</p>
              <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.6 }}>Active Members</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#8fbf9f' }}>4.9★</p>
              <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.6 }}>User Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#eac33b' }}>24/7</p>
              <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.6 }}>AI Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-gentle-float"
        aria-hidden="true"
      >
        <div 
          className="w-8 h-12 rounded-full border-2 flex justify-center pt-2"
          style={{ borderColor: 'rgba(47, 93, 93, 0.3)' }}
        >
          <div 
            className="w-1.5 h-3 rounded-full"
            style={{ 
              background: '#2f5d5d',
              animation: 'fadeInUp 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  );
}
