import React from "react";

function Icon({ className, style }) {
  return <span className={className} style={style} aria-hidden="true" />;
}

export function Link({ children, href, ...props }) {
  return <a href={href} {...props}>{children}</a>;
}

export function SEO() {
  return null;
}

export {
  Icon as ArrowLeft,
  Icon as Plus,
  Icon as Calendar,
  Icon as FileText,
  Icon as CheckCircle,
  Icon as Clock,
  Icon as Send,
  Icon as LayoutGrid,
  Icon as ListFilter,
  Icon as Sparkles,
  Icon as MessageCircle,
  Icon as AlertCircle,
  Icon as ExternalLink,
  Icon as Settings,
  Icon as Wifi,
  Icon as WifiOff,
  Icon as BarChart2,
  Icon as Activity,
  Icon as PieChart,
  Icon as SiInstagram,
  Icon as SiX,
  Icon as SiYoutube,
  Icon as FaLinkedin,
};
