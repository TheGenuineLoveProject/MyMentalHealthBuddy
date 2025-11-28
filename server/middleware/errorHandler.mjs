import { sendError } from "../utils/response.mjs";

export function errorHandler(err, req, res, next) {
  console.error("SERVER ERROR →", err);
  return sendError(res, "Server error", 500, err?.message || null);
}