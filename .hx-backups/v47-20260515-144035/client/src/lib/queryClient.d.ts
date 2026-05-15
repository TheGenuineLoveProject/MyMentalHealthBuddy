import { QueryClient } from "@tanstack/react-query";

export const queryClient: QueryClient;

export function apiRequest(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  body?: unknown
): Promise<Response>;

export function getQueryFn<T>(options?: { on401?: "returnNull" | "throw" }): (context: { queryKey: readonly unknown[] }) => Promise<T>;
