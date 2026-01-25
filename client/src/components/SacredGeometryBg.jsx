/**
 * ============================================================================
 * SACRED GEOMETRY BACKGROUND
 * ============================================================================
 * 
 * Animated SVG sacred geometry patterns for healing visual experiences.
 * Features Flower of Life, rotating circles, and breathing animations.
 * 
 * 🌸 Visual Energy: Divine symmetry, calm lightness, emotional depth
 * ============================================================================
 */

import { useEffect, useState } from "react";
import "../styles/healing-animations.css";
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

export default function SacredGeometryBg({ 
  variant = "flowerOfLife", 
  opacity = 0.08,
  animated = true,
  primaryColor = "#8fbf9f",
  secondaryColor = "#f4c7c3",
  tertiaryColor = "#2f5d5d",
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (variant === "flowerOfLife") {
    return (
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: mounted ? opacity : 0, transition: 'opacity 1.5s ease-out' }}
        aria-hidden="true"
        data-component="SacredGeometryBg"
        data-variant="flowerOfLife"
      >
        <svg 
          className={`w-full h-full ${animated ? 'animate-sacred-rotate' : ''}`}
          style={{ animationDuration: '120s' }}
          viewBox="0 0 800 800" 
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="sacredGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.6" />
              <stop offset="50%" stopColor={secondaryColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={tertiaryColor} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Central Circle */}
          <circle cx="400" cy="400" r="80" stroke="url(#sacredGradient)" strokeWidth="1" fill="none">
            {animated && (
              <animate attributeName="r" values="78;82;78" dur="4s" repeatCount="indefinite" />
            )}
          </circle>
          
          {/* Flower of Life Pattern - First Ring */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const x = 400 + 80 * Math.cos((angle * Math.PI) / 180);
            const y = 400 + 80 * Math.sin((angle * Math.PI) / 180);
            return (
              <circle 
                key={`ring1-${i}`}
                cx={x} 
                cy={y} 
                r="80" 
                stroke={primaryColor}
                strokeWidth="0.8" 
                fill="none"
                opacity={0.5}
              >
                {animated && (
                  <animate 
                    attributeName="opacity" 
                    values="0.4;0.7;0.4" 
                    dur={`${3 + i * 0.3}s`} 
                    repeatCount="indefinite" 
                  />
                )}
              </circle>
            );
          })}
          
          {/* Second Ring */}
          {[30, 90, 150, 210, 270, 330].map((angle, i) => {
            const x = 400 + 140 * Math.cos((angle * Math.PI) / 180);
            const y = 400 + 140 * Math.sin((angle * Math.PI) / 180);
            return (
              <circle 
                key={`ring2-${i}`}
                cx={x} 
                cy={y} 
                r="80" 
                stroke={secondaryColor}
                strokeWidth="0.6" 
                fill="none"
                opacity={0.35}
              >
                {animated && (
                  <animate 
                    attributeName="opacity" 
                    values="0.3;0.5;0.3" 
                    dur={`${4 + i * 0.2}s`} 
                    repeatCount="indefinite" 
                  />
                )}
              </circle>
            );
          })}
          
          {/* Third Ring - Outer */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
            const x = 400 + 220 * Math.cos((angle * Math.PI) / 180);
            const y = 400 + 220 * Math.sin((angle * Math.PI) / 180);
            return (
              <circle 
                key={`ring3-${i}`}
                cx={x} 
                cy={y} 
                r="80" 
                stroke={tertiaryColor}
                strokeWidth="0.4" 
                fill="none"
                opacity={0.25}
              />
            );
          })}
          
          {/* Outer containing circle */}
          <circle cx="400" cy="400" r="320" stroke={primaryColor} strokeWidth="0.5" fill="none" opacity="0.2" />
          <circle cx="400" cy="400" r="380" stroke={secondaryColor} strokeWidth="0.3" fill="none" opacity="0.15" />
        </svg>
      </div>
    );
  }

  if (variant === "seedOfLife") {
    return (
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: mounted ? opacity : 0, transition: 'opacity 1.5s ease-out' }}
        aria-hidden="true"
        data-component="SacredGeometryBg"
        data-variant="seedOfLife"
      >
        <svg 
          className="w-full h-full"
          viewBox="0 0 600 600" 
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Central Circle */}
          <circle cx="300" cy="300" r="60" stroke={primaryColor} strokeWidth="1" fill="none" opacity="0.5">
            {animated && (
              <animate attributeName="r" values="58;62;58" dur="5s" repeatCount="indefinite" />
            )}
          </circle>
          
          {/* Seed of Life - 6 surrounding circles */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const x = 300 + 60 * Math.cos((angle * Math.PI) / 180);
            const y = 300 + 60 * Math.sin((angle * Math.PI) / 180);
            return (
              <circle 
                key={`seed-${i}`}
                cx={x} 
                cy={y} 
                r="60" 
                stroke={i % 2 === 0 ? primaryColor : secondaryColor}
                strokeWidth="0.8" 
                fill="none"
                opacity={0.4}
              >
                {animated && (
                  <animate 
                    attributeName="opacity" 
                    values="0.3;0.6;0.3" 
                    dur={`${4 + i * 0.5}s`} 
                    repeatCount="indefinite" 
                  />
                )}
              </circle>
            );
          })}
        </svg>
      </div>
    );
  }

  if (variant === "metatronsCube") {
    return (
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: mounted ? opacity : 0, transition: 'opacity 1.5s ease-out' }}
        aria-hidden="true"
        data-component="SacredGeometryBg"
        data-variant="metatronsCube"
      >
        <svg 
          className={`w-full h-full ${animated ? '' : ''}`}
          viewBox="0 0 800 800" 
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Outer hexagon */}
          <polygon 
            points="400,100 635,250 635,550 400,700 165,550 165,250" 
            stroke={primaryColor} 
            strokeWidth="0.8" 
            fill="none" 
            opacity="0.3"
          />
          
          {/* Inner hexagon (rotated) */}
          <polygon 
            points="400,180 580,290 580,510 400,620 220,510 220,290" 
            stroke={secondaryColor} 
            strokeWidth="0.6" 
            fill="none" 
            opacity="0.25"
          />
          
          {/* Central point connections */}
          {[100, 250, 550, 700].map((y, i) => (
            <line key={`line-h-${i}`} x1="165" y1="250" x2="635" y2="550" stroke={tertiaryColor} strokeWidth="0.3" opacity="0.2" />
          ))}
          
          {/* Center circle */}
          <circle cx="400" cy="400" r="40" stroke={primaryColor} strokeWidth="1" fill="none" opacity="0.4">
            {animated && (
              <animate attributeName="r" values="38;44;38" dur="4s" repeatCount="indefinite" />
            )}
          </circle>
          
          {/* Vertex circles */}
          {[
            [400, 100], [635, 250], [635, 550], [400, 700], [165, 550], [165, 250]
          ].map(([x, y], i) => (
            <circle 
              key={`vertex-${i}`}
              cx={x} 
              cy={y} 
              r="20" 
              stroke={i % 2 === 0 ? primaryColor : secondaryColor}
              strokeWidth="0.6" 
              fill="none" 
              opacity="0.3"
            />
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Sacred Geometry Bg — The Genuine Love Project" description="Explore sacred geometry bg tools for your wellness journey." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Sacred Geometry Bg</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );
}
