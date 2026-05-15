import type { ReactNode } from "react";

export interface ExamplesAccordionProps {
  items?: unknown[];
  title?: ReactNode;
  className?: string;
  [key: string]: unknown;
}
declare const ExamplesAccordion: (props: ExamplesAccordionProps) => JSX.Element;
export default ExamplesAccordion;
