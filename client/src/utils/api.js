const getToken = () => localStorage.getItem("token");

async function apiFetch(url, options = {}) {
  const token = getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || data.error || "API request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  if (data.success !== undefined) {
    return {
      ok: data.success,
      data: extractData(data),
      message: data.message || "",
    };
  }

  if (data.ok !== undefined) {
    return data;
  }

  return {
    ok: true,
    data: data,
    message: "",
  };
}

function extractData(responseData) {
  const { success, ok, message, error, ...rest } = responseData;
  return rest;
}

export async function apiGet(url) {
  return apiFetch(url, { method: "GET" });
}

export async function apiPost(url, body) {
  return apiFetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiPut(url, body) {
  return apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function apiDelete(url) {
  return apiFetch(url, { method: "DELETE" });
}

export default apiFetch;
