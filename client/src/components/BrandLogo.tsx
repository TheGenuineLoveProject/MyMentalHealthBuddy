import { BRAND } from "@shared/brand";

export function BrandLogo({ className = "h-10 w-auto" }) {
  return (
    <img
      src="/brand/logo.png"
      alt={BRAND.name}
      className={className}
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}