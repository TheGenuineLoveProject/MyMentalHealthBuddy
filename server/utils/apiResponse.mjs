// [MMB] Standard responses
export const ok = (res, data = null, message = "Success") =>
  res.status(200).json({ ok: true, data, message });

export const created = (res, data = null, message = "Created") =>
  res.status(201).json({ ok: true, data, message });

export const fail = (res, status = 400, message = "Request failed", errorCode = null, data = null) =>
  res.status(status).json({ ok: false, message, errorCode, data });
