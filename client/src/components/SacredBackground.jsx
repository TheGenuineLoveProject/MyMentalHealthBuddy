export default function SacredBackground() {
  return (
    <div 
      className="sacred-bg-container absolute inset-0 pointer-events-none overflow-hidden -z-10"
      aria-hidden="true"
    >
      <svg 
        className="sacred-pattern w-full h-full" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid slice"
      >
        <circle 
          cx="50" cy="50" r="45" 
          className="fill-none stroke-white/10 animate-pulse" 
        />
        <circle 
          cx="50" cy="50" r="30" 
          className="fill-none stroke-white/10 animate-pulse" 
          style={{ animationDelay: '0.5s' }}
        />
        <circle 
          cx="50" cy="50" r="15" 
          className="fill-none stroke-white/10 animate-pulse" 
          style={{ animationDelay: '1s' }}
        />
      </svg>
    </div>
  );
}

export { SacredBackground };
