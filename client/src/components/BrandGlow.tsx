export default function BrandGlow() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-sage/25 blur-3xl" />
      <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-brand-gold/15 blur-3xl" />
      <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-brand-sage/15 blur-3xl" />
    </div>
  );
}