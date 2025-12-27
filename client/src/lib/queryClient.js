import { QueryClient } from "@tanstack/react-query";

const TOKEN_KEY = "mmhb_token";

function getToken() {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(method, url, data) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined;
  }
  
  const text = await res.text();
  if (!text) {
    return undefined;
  }
  
  return JSON.parse(text);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
        const token = getToken();
        const headers = {};
        
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(url, {
          headers,
          credentials: "include",
        });

        await throwIfResNotOk(res);
        
        if (res.status === 204 || res.headers.get("content-length") === "0") {
          return undefined;
        }
        
        const text = await res.text();
        if (!text) {
          return undefined;
        }
        
        return JSON.parse(text);
      },
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error) => {
        if (error.message?.startsWith("401") || error.message?.startsWith("403")) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
