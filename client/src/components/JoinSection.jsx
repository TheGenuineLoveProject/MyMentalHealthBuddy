/**
 * ============================================================================
 * JOIN SECTION - CTA with Divine Glow
 * ============================================================================
 * 
 * A beautiful call-to-action section with email signup form,
 * glowing effects, and healing visual design.
 * 
 * ✨ Visual Energy: Divine glow, inviting, sacred transformation
 * ============================================================================
 */

import { useState, useEffect, useRef } from "react";
import { Heart, Sparkles, ArrowRight, Check, Mail } from "lucide-react";
import SacredGeometryBg from "./SacredGeometryBg";
import "../styles/healing-animations.css";

export default function JoinSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  const benefits = [
    "Compassionate AI guidance 24/7",
    "Evidence-based healing tools",
    "Private & secure sanctuary",
    "Growing supportive community",
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 px-6 overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #faf9f7 0%, rgba(47, 93, 93, 0.08) 50%, rgba(47, 93, 93, 0.12) 100%)',
      }}
      aria-labelledby="join-heading"
      data-component="JoinSection"
      data-testid="section-join"
    >
      {/* Sacred Geometry Background */}
      <SacredGeometryBg variant="flowerOfLife" opacity={0.04} />

      {/* Decorative Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ 
            background: 'radial-gradient(ellipse at center, rgba(234, 195, 59, 0.15) 0%, transparent 60%)',
            animation: 'breathingAura 5s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-50"
          style={{ 
            background: 'radial-gradient(ellipse at center, rgba(143, 191, 159, 0.2) 0%, transparent 60%)',
            animation: 'breathingAura 6s ease-in-out infinite 1s',
          }}
        />
        <div 
          className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] rounded-full opacity-40"
          style={{ 
            background: 'radial-gradient(ellipse at center, rgba(244, 199, 195, 0.2) 0%, transparent 60%)',
            animation: 'breathingAura 4s ease-in-out infinite 0.5s',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Content Card */}
        <div 
          className={`rounded-3xl p-10 md:p-16 text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ 
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(143, 191, 159, 0.2)',
            boxShadow: '0 20px 60px rgba(47, 93, 93, 0.1)',
          }}
        >
          {/* Decorative Heart */}
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center animate-breathing-glow"
            style={{ 
              background: 'linear-gradient(135deg, rgba(143, 191, 159, 0.3), rgba(244, 199, 195, 0.2))',
            }}
          >
            <Heart 
              className="w-10 h-10 animate-heartbeat" 
              style={{ color: '#8fbf9f' }} 
            />
          </div>

          {/* Heading */}
          <h2 
            id="join-heading"
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ 
              color: '#2f5d5d',
              fontFamily: "'Cormorant Garamond', serif",
            }}
            data-testid="heading-join"
          >
            Begin Your Sacred Journey
          </h2>

          <p 
            className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#3a3a3a', opacity: 0.85 }}
          >
            Join thousands who have discovered the path to genuine self-love, 
            emotional healing, and lasting inner peace.
          </p>

          {/* Benefits List */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10 max-w-xl mx-auto text-left">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center gap-3"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(143, 191, 159, 0.2)' }}
                >
                  <Check className="w-4 h-4" style={{ color: '#8fbf9f' }} />
                </div>
                <span 
                  className="text-sm"
                  style={{ color: '#3a3a3a', opacity: 0.8 }}
                >
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {/* Email Form */}
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8"
          >
            <div className="relative flex-1">
              <Mail 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: '#8fbf9f', opacity: 0.6 }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 rounded-full text-base transition-all duration-300 focus:outline-none focus:ring-2"
                style={{ 
                  background: 'rgba(250, 249, 247, 0.9)',
                  border: '1px solid rgba(143, 191, 159, 0.25)',
                  color: '#3a3a3a',
                }}
                data-testid="input-join-email"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitted}
              className="group px-8 py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2 transition-all duration-400 hover-glow-gold disabled:opacity-70"
              style={{ 
                background: isSubmitted 
                  ? 'linear-gradient(135deg, #8fbf9f, #6ba87e)' 
                  : 'linear-gradient(135deg, #eac33b, #ddb12d)',
                color: '#2f5d5d',
                boxShadow: '0 4px 20px rgba(234, 195, 59, 0.3)',
              }}
              data-testid="button-join-submit"
            >
              {isSubmitted ? (
                <>
                  <Check className="w-5 h-5" />
                  Welcome!
                </>
              ) : (
                <>
                  Start Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Trust Note */}
          <p 
            className="text-sm flex items-center justify-center gap-2"
            style={{ color: '#3a3a3a', opacity: 0.6 }}
          >
            <Sparkles className="w-4 h-4" style={{ color: '#eac33b' }} />
            Free forever plan • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
