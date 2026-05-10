import type { ReactNode } from "react";

export interface HeroProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}
export function Hero(props: HeroProps): JSX.Element;
declare const HeroDefault: typeof Hero;
export default HeroDefault;
