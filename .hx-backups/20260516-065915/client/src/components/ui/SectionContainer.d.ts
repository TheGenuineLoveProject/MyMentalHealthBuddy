import type { ReactNode } from "react";

export interface SectionContainerProps {
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}
export function SectionContainer(props: SectionContainerProps): JSX.Element;
declare const SectionContainerDefault: typeof SectionContainer;
export default SectionContainerDefault;
