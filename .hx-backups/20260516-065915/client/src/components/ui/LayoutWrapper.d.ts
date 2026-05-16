import type { ReactNode } from "react";

export interface LayoutWrapperProps {
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function LayoutWrapper(props: LayoutWrapperProps): JSX.Element;
declare const LayoutWrapperDefault: typeof LayoutWrapper;
export default LayoutWrapperDefault;
