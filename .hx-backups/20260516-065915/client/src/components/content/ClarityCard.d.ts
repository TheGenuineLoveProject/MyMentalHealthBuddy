import type { ReactNode } from "react";

export interface ClarityCardProps {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}
declare const ClarityCard: (props: ClarityCardProps) => JSX.Element;
export default ClarityCard;
