import type { ReactNode } from "react";

export interface BenefitsBlockProps {
  title?: ReactNode;
  items?: unknown[];
  className?: string;
  [key: string]: unknown;
}
declare const BenefitsBlock: (props: BenefitsBlockProps) => JSX.Element;
export default BenefitsBlock;

export function QuickBenefits(props: { items?: unknown[]; className?: string }): JSX.Element;
export const benefitsPresets: Record<string, unknown>;
