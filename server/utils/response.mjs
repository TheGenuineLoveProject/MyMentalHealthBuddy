// server/utils/response.mjs
import { logger } from "./logger.mjs";

export const ok = (res, data = {}, status = 200) =>
  res.status(status).json({ success: true, ...data });

export const fail = (res, error, status = 400) => {
  const message =
    typeof error === "string" ? error : error?.message || "Unknown error";
  logger.error("API error", { message, status });
  return res.status(status).json({ success: false, error: message });
};

export const serverError = (res, error, customMessage = null) => {
  const message = customMessage || error?.message || "Internal server error";
  logger.error("Server error", { message, error: error?.message });
  return res.status(500).json({ success: false, error: message });
};

export const unauthorized = (res, message = "Unauthorized") => {
  return res.status(401).json({ success: false, error: message });
};

export const sendError = (res, message, status = 500, details = null) => {
  logger.error("Send error", { message, status, details });
  return res.status(status).json({ 
    success: false, 
    error: message,
    ...(details && { details })
  });
};

export const success = (res, data = {}, message = null, status = 200) => {
  return res.status(status).json({ 
    ok: true, 
    data,
    ...(message && { message })
  });
};

export const badRequest = (res, message = "Bad request") => {
  return res.status(400).json({ ok: false, message });
};

export const created = (res, data = null, message = "Created") =>
  res.status(201).json({ ok: true, data, message });

export const failWithCode = (res, status = 400, message = "Request failed", errorCode = null) => {
  logger.error("API error", { message, status, errorCode });
  return res.status(status).json({ ok: false, message, errorCode });
};
