export default function LotusLoader({ 
  size = 64, 
  message = "Loading...",
  className = ""
}) {
  return (
    <div 
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      role="status"
      aria-label={message}
      data-testid="loader-lotus"
    >
      <svg
        viewBox="0 0 100 100"
        style={{ width: size, height: size }}
        className="lotus-loader"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8fbf9f" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#8fbf9f" />
          </linearGradient>
        </defs>
        
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse
            key={angle}
            cx="50"
            cy="50"
            rx="10"
            ry="24"
            fill="url(#loaderGradient)"
            fillOpacity={0.6}
            transform={`rotate(${angle} 50 50) translate(0, -8)`}
            style={{ 
              animation: `loaderPetal 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
        
        <circle 
          cx="50" 
          cy="50" 
          r="8" 
          fill="#d4af37"
          style={{ animation: 'loaderCenter 1.5s ease-in-out infinite' }}
        />
      </svg>
      
      <span className="text-sm text-muted-foreground font-serif italic">
        {message}
      </span>

      <style>{`
        @keyframes loaderPetal {
          0%, 100% { 
            opacity: 0.4; 
          }
          50% { 
            opacity: 1; 
          }
        }
        @keyframes loaderCenter {
          0%, 100% { 
            r: 8;
            filter: drop-shadow(0 0 4px #d4af37);
          }
          50% { 
            r: 9;
            filter: drop-shadow(0 0 12px #ffd700);
          }
        }
        .lotus-loader {
          animation: loaderRotate 8s linear infinite;
        }
        @keyframes loaderRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lotus-loader,
          .lotus-loader ellipse,
          .lotus-loader circle {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
