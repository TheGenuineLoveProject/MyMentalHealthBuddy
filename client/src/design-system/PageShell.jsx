export function PageShell({ children, className = "", ...props }) {
  return (
    <main className={`mx-auto w-full max-w-7xl px-4 py-8 md:px-8 ${className}`} {...props}>
      {children}
    </main>
  );
}
