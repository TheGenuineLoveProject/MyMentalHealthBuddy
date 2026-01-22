/**
 * ============================================================================
 * ABOUT SECTION - SACRED HEALING LAYOUT
 * ============================================================================
 * 
 * A beautiful about section with sacred geometry, breathing animations,
 * and emotionally resonant design for The Genuine Love Project.
 * 
 * 🌿 Visual Energy: Healing, divine symmetry, emotional depth
 * ============================================================================
 */

import { useEffect, useState, useRef } from "react";
import { Heart, Sparkles, Leaf, Sun, Moon, Star } from "lucide-react";
import SacredGeometryBg from "./SacredGeometryBg";
import "../styles/healing-animations.css";

export default function AboutSection() {
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

  const values = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Every interaction is grounded in empathy, understanding, and unconditional positive regard.",
      color: "#f4c7c3",
    },
    {
      icon: Leaf,
      title: "Holistic Healing",
      description: "We address mind, body, and spirit—recognizing that true wellness encompasses all dimensions of being.",
      color: "#8fbf9f",
    },
    {
      icon: Sun,
      title: "Evidence-Based",
      description: "Our approach integrates proven psychological frameworks with ancient wisdom traditions.",
      color: "#eac33b",
    },
    {
      icon: Star,
      title: "Sacred Space",
      description: "A sanctuary where vulnerability is honored and transformation is possible.",
      color: "#2f5d5d",
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #faf9f7 0%, rgba(143, 191, 159, 0.05) 100%)' }}
      aria-labelledby="about-heading"
      data-component="AboutSection"
      data-testid="section-about"
    >
      {/* Sacred Geometry Background */}
      <SacredGeometryBg variant="seedOfLife" opacity={0.06} />

      {/* Decorative Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div 
          className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full animate-breathing opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(143, 191, 159, 0.3) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-[15%] right-[8%] w-40 h-40 rounded-full opacity-25"
          style={{ 
            background: 'radial-gradient(circle, rgba(244, 199, 195, 0.3) 0%, transparent 70%)',
            animation: 'breathingAura 5s ease-in-out infinite 1s',
          }}
        />
        <div 
          className="absolute top-[40%] right-[3%] w-20 h-20 rounded-full opacity-20"
          style={{ 
            background: 'radial-gradient(circle, rgba(234, 195, 59, 0.4) 0%, transparent 70%)',
            animation: 'breathingAura 4s ease-in-out infinite 0.5s',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div 
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, transparent, #8fbf9f)' }} />
            <Sparkles className="w-5 h-5" style={{ color: '#eac33b' }} />
            <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, #8fbf9f, transparent)' }} />
          </div>

          <h2 
            id="about-heading"
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ 
              color: '#2f5d5d',
              fontFamily: "'Cormorant Garamond', serif",
            }}
            data-testid="heading-about"
          >
            Our Sacred Mission
          </h2>
          
          <p 
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ 
              color: '#3a3a3a', 
              opacity: 0.85,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            The Genuine Love Project was born from a profound understanding that healing is not just 
            possible—it is our birthright. We believe every soul deserves access to compassionate 
            support, evidence-based tools, and a sacred space to rediscover their inherent wholeness.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left: Decorative Visual */}
          <div 
            className={`relative transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Breathing Circle Container */}
              <div 
                className="absolute inset-0 rounded-full animate-breathing-glow"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(143, 191, 159, 0.15) 0%, rgba(244, 199, 195, 0.1) 50%, rgba(234, 195, 59, 0.08) 100%)',
                  border: '1px solid rgba(143, 191, 159, 0.2)',
                }}
              />
              
              {/* Inner Content */}
              <div 
                className="absolute inset-8 rounded-full flex flex-col items-center justify-center text-center p-8"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-heartbeat"
                  style={{ background: 'linear-gradient(135deg, #8fbf9f 0%, #2f5d5d 100%)' }}
                >
                  <Heart className="w-10 h-10 text-white" />
                </div>
                
                <h3 
                  className="font-serif text-2xl font-semibold mb-3"
                  style={{ color: '#2f5d5d', fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Live in Genuine Love
                </h3>
                
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: '#3a3a3a', opacity: 0.8 }}
                >
                  Our guiding principle and invitation to every soul who joins our community.
                </p>
              </div>

              {/* Orbiting Elements */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ animation: 'sacredRotate 20s linear infinite' }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(234, 195, 59, 0.3)' }}
                >
                  <Sun className="w-6 h-6" style={{ color: '#eac33b' }} />
                </div>
              </div>
              
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                style={{ animation: 'sacredRotate 25s linear infinite reverse' }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(47, 93, 93, 0.2)' }}
                >
                  <Moon className="w-5 h-5" style={{ color: '#2f5d5d' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Story Content */}
          <div 
            className={`transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <h3 
              className="font-serif text-2xl md:text-3xl font-semibold mb-6"
              style={{ color: '#2f5d5d', fontFamily: "'Cormorant Garamond', serif" }}
            >
              A Journey of Transformation
            </h3>
            
            <div className="space-y-6" style={{ color: '#3a3a3a', opacity: 0.85 }}>
              <p className="leading-relaxed">
                We understand that healing is not linear. It's a sacred journey with peaks and valleys, 
                breakthroughs and setbacks. That's why we've created a platform that meets you exactly 
                where you are—with compassion, patience, and unwavering support.
              </p>
              
              <p className="leading-relaxed">
                Our trauma-informed AI companion, combined with evidence-based tools and a nurturing 
                community, creates a holistic ecosystem for growth. Whether you're processing past 
                wounds, building emotional resilience, or simply seeking a moment of peace, we're here.
              </p>
              
              <p className="leading-relaxed font-medium" style={{ color: '#2f5d5d' }}>
                Because genuine love—the kind that heals, transforms, and liberates—begins with 
                the love you give yourself.
              </p>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div 
          className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl text-center transition-all duration-400 hover-glow cursor-default"
              style={{ 
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(143, 191, 159, 0.15)',
              }}
              data-testid={`value-card-${index}`}
            >
              {/* Icon */}
              <div 
                className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${value.color}20` }}
              >
                <value.icon className="w-7 h-7" style={{ color: value.color }} />
              </div>
              
              {/* Title */}
              <h4 
                className="font-semibold text-lg mb-2"
                style={{ color: '#2f5d5d' }}
              >
                {value.title}
              </h4>
              
              {/* Description */}
              <p 
                className="text-sm leading-relaxed"
                style={{ color: '#3a3a3a', opacity: 0.75 }}
              >
                {value.description}
              </p>

              {/* Hover Glow Effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: `0 0 30px ${value.color}25` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
