import { queryClient } from "./queryClient";

export const HEALTH_REQUEST_TIMEOUT_MS = 10000;

// Keep browser session authentication in the shared query client. Operational
// tokens are deliberately neither accepted nor sent by this browser contract.
export async function boundedHealthQuery(context) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  if (context.signal?.aborted) cancel();
  else context.signal?.addEventListener("abort", cancel, { once: true });
  const timeout = setTimeout(cancel, HEALTH_REQUEST_TIMEOUT_MS);
  try {
    const data = await queryClient.getDefaultOptions().queries.queryFn({
      ...context, signal: controller.signal,
    });
    if (context.queryKey[0] === "/api/admin/browser-health") {
      if (!data || typeof data.ok !== "boolean" ||
          !["healthy", "degraded"].includes(data.status) ||
          typeof data.uptime !== "string" ||
          !Number.isFinite(data.uptimeSeconds) ||
          !["connected", "disconnected"].includes(data.database?.status) ||
          typeof data.system?.nodeVersion !== "string" ||
          !data.environment || typeof data.environment !== "object") {
        throw new Error("Invalid health summary response");
      }
    }
    return data;
  } finally {
    clearTimeout(timeout);
    context.signal?.removeEventListener("abort", cancel);
  }
}

export const healthQueryOptions = {
  queryFn: boundedHealthQuery,
  retry: false,
  refetchInterval: 30000,
};