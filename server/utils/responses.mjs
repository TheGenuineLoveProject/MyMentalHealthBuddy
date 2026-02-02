// server/utils/responses.mjs
// Re-export from response.mjs for backwards compatibility
export { 
  ok, 
  fail, 
  serverError, 
  unauthorized, 
  sendError, 
  success, 
  badRequest, 
  created, 
  failWithCode 
} from "./response.mjs";

export const forbidden = (res, message = "Forbidden") => {
  return res.status(403).json({ ok: false, message });
};

export const notFound = (res, message = "Not found") => {
  return res.status(404).json({ ok: false, message });
};
