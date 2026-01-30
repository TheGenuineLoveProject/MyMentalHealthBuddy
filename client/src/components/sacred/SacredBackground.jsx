const goldColor = 'var(--glp-gold, #d4af37)';
const goldLightColor = 'var(--glp-gold-dark, #c9a227)';
const sageColor = 'var(--glp-sage, #8fbf9f)';
const sageDeepColor = 'var(--glp-sage-deep, #2f5d5d)';

export default function SacredBackground({ variant = "hero", opacity = 0.15 }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {variant === "hero" && (
        <>
          <svg 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] sacred-rotate-slow opacity-20"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="200" cy="200" r="180" stroke={goldColor} strokeWidth="0.5" opacity="0.4" />
            <circle cx="200" cy="200" r="140" stroke={goldColor} strokeWidth="0.5" opacity="0.5" />
            <circle cx="200" cy="200" r="100" stroke={goldColor} strokeWidth="0.5" opacity="0.6" />
            <circle cx="200" cy="80" r="60" stroke={goldColor} strokeWidth="0.5" opacity="0.3" />
            <circle cx="200" cy="320" r="60" stroke={goldColor} strokeWidth="0.5" opacity="0.3" />
            <circle cx="80" cy="200" r="60" stroke={goldColor} strokeWidth="0.5" opacity="0.3" />
            <circle cx="320" cy="200" r="60" stroke={goldColor} strokeWidth="0.5" opacity="0.3" />
            <circle cx="115" cy="115" r="50" stroke={goldColor} strokeWidth="0.5" opacity="0.25" />
            <circle cx="285" cy="115" r="50" stroke={goldColor} strokeWidth="0.5" opacity="0.25" />
            <circle cx="115" cy="285" r="50" stroke={goldColor} strokeWidth="0.5" opacity="0.25" />
            <circle cx="285" cy="285" r="50" stroke={goldColor} strokeWidth="0.5" opacity="0.25" />
          </svg>

          <svg 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sacred-rotate-medium opacity-10"
            style={{ animationDirection: 'reverse' }}
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M150,30 L270,150 L150,270 L30,150 Z" stroke={sageColor} strokeWidth="0.5" />
            <path d="M150,50 L250,150 L150,250 L50,150 Z" stroke={sageColor} strokeWidth="0.5" opacity="0.8" />
            <path d="M150,70 L230,150 L150,230 L70,150 Z" stroke={sageDeepColor} strokeWidth="0.5" opacity="0.6" />
          </svg>
        </>
      )}

      {variant === "lotus" && (
        <svg 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] sacred-halo"
          viewBox="0 0 200 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity }}
        >
          <path d="M100,90 Q80,60 70,30 Q90,50 100,20 Q110,50 130,30 Q120,60 100,90" stroke={goldColor} strokeWidth="0.8" fill="none" opacity="0.8" />
          <path d="M100,90 Q60,70 40,40 Q70,55 100,20 Q130,55 160,40 Q140,70 100,90" stroke={goldColor} strokeWidth="0.6" fill="none" opacity="0.6" />
          <path d="M100,90 Q40,80 20,50 Q60,60 100,20 Q140,60 180,50 Q160,80 100,90" stroke={goldColor} strokeWidth="0.4" fill="none" opacity="0.4" />
        </svg>
      )}

      {variant === "flowerOfLife" && (
        <svg 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sacred-halo"
          viewBox="0 0 250 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity }}
        >
          <circle cx="125" cy="125" r="40" stroke={goldColor} strokeWidth="0.5" />
          <circle cx="125" cy="85" r="40" stroke={goldColor} strokeWidth="0.5" opacity="0.8" />
          <circle cx="125" cy="165" r="40" stroke={goldColor} strokeWidth="0.5" opacity="0.8" />
          <circle cx="90" cy="105" r="40" stroke={goldColor} strokeWidth="0.5" opacity="0.8" />
          <circle cx="160" cy="105" r="40" stroke={goldColor} strokeWidth="0.5" opacity="0.8" />
          <circle cx="90" cy="145" r="40" stroke={goldColor} strokeWidth="0.5" opacity="0.8" />
          <circle cx="160" cy="145" r="40" stroke={goldColor} strokeWidth="0.5" opacity="0.8" />
          <circle cx="125" cy="125" r="80" stroke={goldColor} strokeWidth="0.3" opacity="0.5" />
          <circle cx="125" cy="125" r="120" stroke={goldColor} strokeWidth="0.3" opacity="0.3" />
        </svg>
      )}

      {variant === "footer" && (
        <>
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center bottom, var(--glp-gold-10, rgba(212, 175, 55, 0.08)) 0%, transparent 60%)'
            }}
          />
          <svg 
            className="absolute bottom-0 left-0 right-0 w-full h-24"
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.3 }}
          >
            <path d="M0,50 Q300,0 600,50 T1200,50 V100 H0 Z" fill={goldColor} fillOpacity="0.3" />
          </svg>
        </>
      )}
    </div>
  );
}

export function SacredDivider({ icon: Icon }) {
  return (
    <div className="sacred-divider" aria-hidden="true">
      {Icon && (
        <div className="sacred-divider-icon">
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

export function GlowingHeartLogo({ size = 64 }) {
  return (
    <div 
      className="relative sacred-pulse rounded-full flex items-center justify-center"
      style={{ 
        width: size, 
        height: size,
        background: 'var(--metallic-gold)',
        boxShadow: '0 0 30px var(--metallic-gold-glow)'
      }}
      aria-hidden="true"
    >
      <svg 
        viewBox="0 0 24 24" 
        fill="white"
        style={{ width: size * 0.5, height: size * 0.5 }}
        aria-hidden="true"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </div>
  );
}
