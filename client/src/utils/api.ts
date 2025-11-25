// client/src/utils/api.ts

export interface ApiResponse<T = unknown> {
  ok: boolean;
  error?: string;
  validationErrors?: Array<{ field: string; message: string }>;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  data: ApiResponse;

  constructor(status: number, data: ApiResponse) {
    super(data.error || "An error occurred");
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T & ApiResponse> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(path, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!path.includes("/auth/")) {
        window.location.href = "/login";
      }
      throw new ApiError(401, { ok: false, error: "Session expired. Please log in again." });
    }

    if (res.status === 429) {
      const data = await res.json().catch(() => ({ ok: false, error: "Too many requests" }));
      throw new ApiError(429, data);
    }

    const data = await res.json().catch(() => ({ ok: false, error: "Invalid response" }));

    if (!res.ok) {
      throw new ApiError(res.status, data);
    }

    return data as T & ApiResponse;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }

    if (err instanceof TypeError && err.message.includes("fetch")) {
      throw new ApiError(0, { ok: false, error: "Network error. Please check your connection." });
    }

    throw new ApiError(500, { ok: false, error: "An unexpected error occurred" });
  }
}

export async function apiGet<T = unknown>(path: string): Promise<T & ApiResponse> {
  return apiFetch<T>(path, { method: "GET" });
}

export async function apiPost<T = unknown>(path: string, body: unknown): Promise<T & ApiResponse> {
  return apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiPut<T = unknown>(path: string, body: unknown): Promise<T & ApiResponse> {
  return apiFetch<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function apiDelete<T = unknown>(path: string): Promise<T & ApiResponse> {
  return apiFetch<T>(path, { method: "DELETE" });
}

export function getStoredUser(): { id: number; email: string; name?: string } | null {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}
