declare module "*.jsx" {
  import { ComponentType } from "react";
  const Component: ComponentType<any>;
  export default Component;
}

declare module "*.js" {
  const value: any;
  export default value;
  export const queryClient: any;
  export const apiRequest: any;
}

declare module "./pages/Home" {
  const Component: React.ComponentType;
  export default Component;
}

declare module "./pages/Dashboard" {
  const Component: React.ComponentType;
  export default Component;
}

declare module "./pages/Wellness" {
  const Component: React.ComponentType;
  export default Component;
}

declare module "./pages/JournalPage" {
  const Component: React.ComponentType;
  export default Component;
}

declare module "./pages/NotFound" {
  const Component: React.ComponentType;
  export default Component;
}

declare module "./lib/queryClient" {
  import { QueryClient } from "@tanstack/react-query";
  export const queryClient: QueryClient;
  export function apiRequest(method: string, url: string, data?: any): Promise<any>;
}
