export default function BrandGlow() {
  return (
    <div aria-hidden className="brand-glow pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="brand-glow-blob brand-glow-blob--sage absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-sage/25 blur-3xl" />
      <div className="brand-glow-blob brand-glow-blob--gold absolute top-40 right-10 h-72 w-72 rounded-full bg-brand-gold/15 blur-3xl" />
      <div className="brand-glow-blob brand-glow-blob--sage2 absolute bottom-10 left-10 h-72 w-72 rounded-full bg-brand-sage/15 blur-3xl" />
      <style>{`
        @keyframes brandGlowDriftA {
          0%, 100% { transform: translate(-50%, 0) scale(1); }
          50%      { transform: translate(-50%, 24px) scale(1.08); }
        }
        @keyframes brandGlowDriftB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(-32px, 18px) scale(1.10); }
        }
        @keyframes brandGlowDriftC {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(28px, -16px) scale(1.06); }
        }
        .brand-glow-blob--sage  { animation: brandGlowDriftA 18s ease-in-out infinite; }
        .brand-glow-blob--gold  { animation: brandGlowDriftB 22s ease-in-out infinite; animation-delay: -6s; }
        .brand-glow-blob--sage2 { animation: brandGlowDriftC 26s ease-in-out infinite; animation-delay: -12s; }
        @media (prefers-reduced-motion: reduce) {
          .brand-glow-blob { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
