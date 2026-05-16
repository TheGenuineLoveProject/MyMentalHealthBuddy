import type { ReactNode } from "react";

export interface WellnessPageShellProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  benefits?: unknown;
  clarity?: unknown;
  examples?: unknown;
  children?: ReactNode;
}

export function WellnessPageShell(props: WellnessPageShellProps): JSX.Element;
