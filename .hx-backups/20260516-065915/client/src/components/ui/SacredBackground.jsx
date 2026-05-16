export default function SacredBackground() {
  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden -z-10"
      aria-hidden="true"
    >
      <svg 
        className="w-full h-full" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid slice"
      >
        {[...Array(10)].map((_, i) => (
          <circle 
            key={i}
            cx="50" 
            cy="50" 
            r={5 + i * 5} 
            className="fill-none stroke-white/10"
            style={{
              animation: 'pulse 20s infinite',
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </svg>
      <div 
        className="absolute bottom-[10%] right-[5%] h-[120px] w-[120px] bg-brand-sage/30 rounded-full blur-2xl"
        style={{
          animation: 'float 6s ease-in-out infinite'
        }}
      />
    </div>
  );
}

export { SacredBackground };
