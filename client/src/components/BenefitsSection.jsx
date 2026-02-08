/**
 * ============================================================================
 * BENEFITS SECTION - HEALING SHOWCASE
 * ============================================================================
 * 
 * A visually stunning benefits section with glowing cards,
 * sacred geometry accents, and healing animations.
 * 
 * 🌈 Visual Energy: Vibrant harmony, calm lightness, emotional resonance
 * ============================================================================
 */

import { useEffect, useState, useRef } from "react";
import { 
  Brain, Heart, Shield, Sparkles, 
  MessageCircle, BarChart3, BookOpen, 
  Clock, Lock, Smile, Zap, Target 
} from "lucide-react";
import GlowingCard from "./GlowingCard";
import "../styles/healing-animations.css";

export default function BenefitsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "A reflection-focused AI that uses trauma-informed language to mirror what you share with care and nuance.",
      variant: "sage",
      color: "#8fbf9f",
    },
    {
      icon: Heart,
      title: "Emotional Tracking",
      description: "Beautiful mood tracking that helps you understand patterns, triggers, and growth over time.",
      variant: "rose",
      color: "#f4c7c3",
    },
    {
      icon: BookOpen,
      title: "Guided Journaling",
      description: "Prompts designed by mental health professionals to unlock self-discovery and emotional clarity.",
      variant: "teal",
      color: "#2f5d5d",
    },
    {
      icon: Shield,
      title: "Complete Privacy",
      description: "End-to-end encryption ensures your innermost thoughts remain completely private and secure.",
      variant: "gold",
      color: "#eac33b",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Healing doesn't follow a schedule. Access compassionate support whenever you need it most.",
      variant: "sage",
      color: "#8fbf9f",
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set meaningful intentions and track your progress toward the life you envision.",
      variant: "rose",
      color: "#f4c7c3",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Active Members", color: "#8fbf9f" },
    { value: "500K+", label: "Journal Entries", color: "#f4c7c3" },
    { value: "4.9★", label: "User Rating", color: "#eac33b" },
    { value: "98%", label: "Feel Better", color: "#2f5d5d" },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 px-6 overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, rgba(47, 93, 93, 0.02) 0%, #faf9f7 50%, rgba(244, 199, 195, 0.03) 100%)',
      }}
      aria-labelledby="benefits-heading"
      data-component="BenefitsSection"
      data-testid="section-benefits"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Floating Organic Blobs */}
        <div 
          className="absolute top-[5%] right-[10%] w-64 h-64 organic-blob opacity-10"
          style={{ background: 'linear-gradient(135deg, #8fbf9f 0%, #f4c7c3 100%)' }}
        />
        <div 
          className="absolute bottom-[10%] left-[5%] w-48 h-48 organic-blob opacity-8"
          style={{ 
            background: 'linear-gradient(135deg, #f4c7c3 0%, #eac33b 100%)',
            animationDelay: '2s',
          }}
        />
        
        {/* Subtle Radial Glows */}
        <div 
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(143, 191, 159, 0.08) 0%, transparent 60%)',
            animation: 'breathingAura 6s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(244, 199, 195, 0.08) 0%, transparent 60%)',
            animation: 'breathingAura 5s ease-in-out infinite 1s',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ 
              background: 'rgba(234, 195, 59, 0.15)',
              color: '#8B7023',
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: '#eac33b' }} />
            Why Choose Us
          </span>

          <h2 
            id="benefits-heading"
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ 
              color: '#2f5d5d',
              fontFamily: "'Cormorant Garamond', serif",
            }}
            data-testid="heading-benefits"
          >
            Tools for Honest Reflection
          </h2>
          
          <p 
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#3a3a3a', opacity: 0.85 }}
          >
            A platform built with care, informed by evidence-based approaches, 
            and designed to support your self-reflection at your own pace.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <GlowingCard
              key={index}
              variant={benefit.variant}
              className={`transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              testId={`benefit-card-${index}`}
              padding="p-8"
            >
              <div style={{ transitionDelay: `${index * 100}ms` }}>
                {/* Icon */}
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${benefit.color}15` }}
                >
                  <benefit.icon className="w-7 h-7" style={{ color: benefit.color }} />
                </div>
                
                {/* Title */}
                <h3 
                  className="font-semibold text-xl mb-3"
                  style={{ color: '#2f5d5d' }}
                >
                  {benefit.title}
                </h3>
                
                {/* Description */}
                <p 
                  className="leading-relaxed"
                  style={{ color: '#3a3a3a', opacity: 0.75 }}
                >
                  {benefit.description}
                </p>
              </div>
            </GlowingCard>
          ))}
        </div>

        {/* Stats Bar */}
        <div 
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div 
            className="rounded-2xl p-8 md:p-12"
            style={{ 
              background: 'linear-gradient(135deg, rgba(47, 93, 93, 0.95) 0%, rgba(47, 93, 93, 0.85) 100%)',
              boxShadow: '0 20px 60px rgba(47, 93, 93, 0.2)',
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center"
                  data-testid={`stat-${index}`}
                >
                  <p 
                    className="text-3xl md:text-4xl font-bold mb-2"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p 
                    className="text-sm md:text-base opacity-80"
                    style={{ color: '#faf9f7' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
