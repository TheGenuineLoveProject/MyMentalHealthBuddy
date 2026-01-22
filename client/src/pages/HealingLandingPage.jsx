/**
 * ============================================================================
 * HEALING LANDING PAGE
 * ============================================================================
 * 
 * A complete healing web experience with:
 * - Sacred geometry hero section
 * - Fluid watercolor sections
 * - Breathing animations throughout
 * - Organic shapes and soft-glow effects
 * 
 * 🧘 Visual Goal: Breath of fresh air, healing, restoration
 * ============================================================================
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { 
  Heart, Sparkles, ArrowRight, Star, Leaf, 
  Brain, Shield, Users, MessageCircle, BookOpen,
  Zap, TrendingUp, Award, Check
} from "lucide-react";
import HealingHero from "../components/HealingHero";
import AboutSection from "../components/AboutSection";
import BenefitsSection from "../components/BenefitsSection";
import JoinSection from "../components/JoinSection";
import SacredPattern from "../components/SacredPattern";
import SacredFooter from "../components/SacredFooter";
import "../styles/healing-animations.css";

export default function HealingLandingPage() {
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate-section]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI Companion",
      description: "Compassionate, trauma-informed AI guidance available 24/7 to support your healing journey.",
      color: '#8fbf9f',
      bgColor: 'rgba(143, 191, 159, 0.1)',
    },
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "Understand your emotional patterns with beautiful, insightful mood tracking and analytics.",
      color: '#f4c7c3',
      bgColor: 'rgba(244, 199, 195, 0.12)',
    },
    {
      icon: BookOpen,
      title: "Guided Journaling",
      description: "Prompts and frameworks designed to unlock self-discovery and emotional clarity.",
      color: '#2f5d5d',
      bgColor: 'rgba(47, 93, 93, 0.08)',
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with like-minded souls in a safe, nurturing environment built for growth.",
      color: '#eac33b',
      bgColor: 'rgba(234, 195, 59, 0.12)',
    },
    {
      icon: Shield,
      title: "Safe Space",
      description: "Your sanctuary for vulnerability, healing, and authentic self-expression.",
      color: '#8fbf9f',
      bgColor: 'rgba(143, 191, 159, 0.1)',
    },
    {
      icon: Zap,
      title: "Wellness Tools",
      description: "Breathing exercises, meditations, and evidence-based practices for daily wellbeing.",
      color: '#f4c7c3',
      bgColor: 'rgba(244, 199, 195, 0.12)',
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Teacher",
      text: "This platform helped me reconnect with myself after years of burnout. The AI companion feels like talking to a wise friend who truly understands.",
      avatar: "S",
    },
    {
      name: "James K.",
      role: "Software Engineer",
      text: "The mood tracking and journaling features have become essential to my daily routine. I feel more grounded and self-aware than ever before.",
      avatar: "J",
    },
    {
      name: "Maria L.",
      role: "Healthcare Worker",
      text: "Finally, a wellness app that doesn't feel clinical. It's warm, supportive, and genuinely helpful during difficult moments.",
      avatar: "M",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Share what matters most to you and set your healing intentions.",
    },
    {
      number: "02",
      title: "Connect with AI",
      description: "Begin meaningful conversations with our compassionate AI companion.",
    },
    {
      number: "03",
      title: "Track & Grow",
      description: "Watch your transformation unfold with personalized insights.",
    },
  ];

  return (
    <div 
      className="min-h-screen"
      style={{ background: 'var(--glp-paper, #faf9f7)' }}
      data-testid="page-healing-landing"
    >
      {/* Global Sacred Pattern Background */}
      <SacredPattern variant="flowerOfLife" opacity={0.06} />

      {/* Hero Section */}
      <HealingHero />

      {/* About Section - Sacred Mission */}
      <AboutSection />

      {/* Benefits Section - Why Choose Us */}
      <BenefitsSection />

      {/* Features Section */}
      <section 
        id="features-section"
        data-animate-section
        className="relative py-24 lg:py-32 px-6 overflow-hidden"
      >
        {/* Background Accents */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div 
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-40"
            style={{ background: 'radial-gradient(ellipse at center, rgba(244, 199, 195, 0.15) 0%, transparent 70%)' }}
          />
          <div 
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(ellipse at center, rgba(143, 191, 159, 0.12) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Section Header */}
          <div 
            className={`text-center mb-16 transition-all duration-700 ${
              visibleSections['features-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: 'rgba(143, 191, 159, 0.15)', color: '#2f5d5d' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#8fbf9f' }} />
              Healing Tools
            </span>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6"
              style={{ color: '#2f5d5d' }}
              data-testid="heading-features"
            >
              Everything You Need to Thrive
            </h2>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: '#3a3a3a', opacity: 0.8 }}
            >
              Discover a comprehensive suite of tools designed to support your mental wellness journey.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl transition-all duration-500 hover-glow ${
                  visibleSections['features-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  background: feature.bgColor,
                  transitionDelay: `${index * 100}ms`,
                }}
                data-testid={`card-feature-${index}`}
              >
                {/* Icon */}
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(255, 255, 255, 0.8)' }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                
                {/* Content */}
                <h3 
                  className="text-xl font-semibold mb-3"
                  style={{ color: '#2f5d5d' }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: '#3a3a3a', opacity: 0.75 }}>
                  {feature.description}
                </p>

                {/* Subtle glow on hover */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ 
                    boxShadow: `0 0 40px ${feature.color}30`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        id="how-it-works-section"
        data-animate-section
        className="relative py-24 lg:py-32 px-6"
        style={{ 
          background: 'linear-gradient(180deg, rgba(47, 93, 93, 0.03) 0%, transparent 100%)',
        }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div 
            className={`text-center mb-16 transition-all duration-700 ${
              visibleSections['how-it-works-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6"
              style={{ color: '#2f5d5d' }}
              data-testid="heading-how-it-works"
            >
              Your Journey Begins Here
            </h2>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: '#3a3a3a', opacity: 0.8 }}
            >
              Three simple steps to start your transformation.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div 
              className="hidden md:block absolute top-16 left-[16%] right-[16%] h-0.5"
              style={{ background: 'linear-gradient(90deg, rgba(143, 191, 159, 0.3), rgba(234, 195, 59, 0.3), rgba(244, 199, 195, 0.3))' }}
              aria-hidden="true"
            />

            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative text-center transition-all duration-500 ${
                  visibleSections['how-it-works-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                data-testid={`step-${index}`}
              >
                {/* Number Circle */}
                <div 
                  className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center animate-breathing-glow relative"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(143, 191, 159, 0.2), rgba(244, 199, 195, 0.15))',
                    border: '2px solid rgba(143, 191, 159, 0.3)',
                  }}
                >
                  <span 
                    className="text-4xl font-serif font-bold"
                    style={{ color: '#2f5d5d' }}
                  >
                    {step.number}
                  </span>
                </div>
                
                <h3 
                  className="text-xl font-semibold mb-3"
                  style={{ color: '#2f5d5d' }}
                >
                  {step.title}
                </h3>
                <p style={{ color: '#3a3a3a', opacity: 0.75 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        id="testimonials-section"
        data-animate-section
        className="relative py-24 lg:py-32 px-6 overflow-hidden"
      >
        {/* Watercolor Background */}
        <div className="absolute inset-0 pointer-events-none watercolor-bg" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto">
          {/* Section Header */}
          <div 
            className={`text-center mb-16 transition-all duration-700 ${
              visibleSections['testimonials-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: 'rgba(244, 199, 195, 0.2)', color: '#8B5A5A' }}
            >
              <Heart className="w-4 h-4" style={{ color: '#f4c7c3' }} />
              Stories of Healing
            </span>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6"
              style={{ color: '#2f5d5d' }}
              data-testid="heading-testimonials"
            >
              Voices of Transformation
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl transition-all duration-500 hover-glow-rose ${
                  visibleSections['testimonials-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(244, 199, 195, 0.2)',
                  transitionDelay: `${index * 150}ms`,
                }}
                data-testid={`testimonial-${index}`}
              >
                {/* Quote Mark */}
                <div 
                  className="absolute top-6 right-6 text-5xl font-serif opacity-20"
                  style={{ color: '#f4c7c3' }}
                  aria-hidden="true"
                >
                  "
                </div>

                {/* Content */}
                <p 
                  className="mb-6 leading-relaxed relative z-10"
                  style={{ color: '#3a3a3a', opacity: 0.85 }}
                >
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(143, 191, 159, 0.3), rgba(244, 199, 195, 0.3))',
                      color: '#2f5d5d',
                    }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#2f5d5d' }}>
                      {testimonial.name}
                    </p>
                    <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.6 }}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta-section"
        data-animate-section
        className="relative py-24 lg:py-32 px-6"
      >
        <div 
          className={`max-w-4xl mx-auto text-center transition-all duration-700 ${
            visibleSections['cta-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Decorative Element */}
          <div 
            className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center animate-heartbeat"
            style={{ 
              background: 'linear-gradient(135deg, rgba(143, 191, 159, 0.3), rgba(244, 199, 195, 0.3))',
            }}
          >
            <Heart className="w-10 h-10" style={{ color: '#8fbf9f' }} />
          </div>

          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6"
            style={{ color: '#2f5d5d' }}
            data-testid="heading-cta"
          >
            Ready to Begin Your Healing Journey?
          </h2>
          <p 
            className="text-lg mb-10 max-w-2xl mx-auto"
            style={{ color: '#3a3a3a', opacity: 0.8 }}
          >
            Join thousands who have found peace, clarity, and genuine self-love through our platform.
          </p>

          <Link href="/register">
            <button 
              className="group px-12 py-5 rounded-full font-semibold text-lg inline-flex items-center gap-3 transition-all duration-400 hover-glow-gold"
              style={{ 
                background: 'linear-gradient(135deg, #eac33b 0%, #ddb12d 100%)',
                color: '#2f5d5d',
                boxShadow: '0 4px 24px rgba(234, 195, 59, 0.35)',
              }}
              data-testid="button-cta-final"
            >
              Start Your Free Journey
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>

          <p 
            className="mt-6 text-sm"
            style={{ color: '#3a3a3a', opacity: 0.6 }}
          >
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>

      {/* Join Section - CTA with Form */}
      <JoinSection />

      {/* Sacred Footer */}
      <SacredFooter />
    </div>
  );
}
