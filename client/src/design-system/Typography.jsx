export function PageTitle({ children, className = "" }) {
  return <h1 className={`text-3xl md:text-5xl font-bold tracking-tight ${className}`}>{children}</h1>;
}

export function SectionTitle({ children, className = "" }) {
  return <h2 className={`text-2xl md:text-3xl font-semibold ${className}`}>{children}</h2>;
}

export function BodyText({ children, className = "" }) {
  return <p className={`text-base leading-7 ${className}`}>{children}</p>;
}
