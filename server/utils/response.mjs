// server/utils/response.mjs

export const ok = (res, data = {}, status = 200) =>
  res.status(status).json({ success: true, ...data });

export const fail = (res, error, status = 400) => {
  const message =
    typeof error === "string" ? error : error?.message || "Unknown error";
  console.error("[API ERROR]", message, error);
  return res.status(status).json({ success: false, error: message });
};