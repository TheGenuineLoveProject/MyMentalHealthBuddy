import { QueryClient } from "@tanstack/react-query";
const defaultFetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok)
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
};
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: ({ queryKey }) => defaultFetcher(queryKey[0]),
            staleTime: 1000 * 60,
            retry: 1
        }
    }
});
export async function apiRequest(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(error.error || `HTTP ${res.status}`);
    }
    if (res.status === 204)
        return null;
    return res.json();
}
