import type { ReactNode } from "react";

export interface PageScaffoldProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}
export function PageScaffold(props: PageScaffoldProps): JSX.Element;
declare const PageScaffoldDefault: typeof PageScaffold;
export default PageScaffoldDefault;
