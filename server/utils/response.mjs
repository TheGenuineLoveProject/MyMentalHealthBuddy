// server/utils/response.mjs

export const ok = (res, data = {}, status = 200) =>
  res.status(status).json({ success: true, ...data });

export const fail = (res, error, status = 400) => {
  const message =
    typeof error === "string" ? error : error?.message || "Unknown error";
  console.error("[API ERROR]", message, error);
  return res.status(status).json({ success: false, error: message });
};

export const serverError = (res, error, customMessage = null) => {
  const message = customMessage || error?.message || "Internal server error";
  console.error("[SERVER ERROR]", message, error);
  return res.status(500).json({ success: false, error: message });
};

export const unauthorized = (res, message = "Unauthorized") => {
  return res.status(401).json({ success: false, error: message });
};

export const sendError = (res, message, status = 500, details = null) => {
  console.error("[SEND ERROR]", message, details);
  return res.status(status).json({ 
    success: false, 
    error: message,
    ...(details && { details })
  });
};

// Aliases for backward compatibility
export const success = ok;
export const badRequest = fail;