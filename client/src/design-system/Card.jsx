export function Card({ children, className = "", ...props }) {
  return (
    <section
      className={`rounded-2xl border bg-white/80 p-6 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
