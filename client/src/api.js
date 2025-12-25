// C:\Users\Asus\code\Koset Console\client\src\api.js

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(method, path, body) {
  try {
    const res = await fetch(API + path, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      // If server sent structured error, surface it
      if (data?.error) {
        return { ok: false, error: data.error };
      }
      // Fallback generic error
      return {
        ok: false,
        error: {
          code: "HTTP_ERROR",
          message: `HTTP ${res.status} - ${res.statusText}`,
        },
      };
    }

    // Success
    return data;
  } catch (err) {
    return {
      ok: false,
      error: { code: "NETWORK_ERROR", message: err.message },
    };
  }
}

export function post(path, body) {
  return request("POST", path, body);
}

export function put(path, body) {
  return request("PUT", path, body);
}

export function get(path) {
  return request("GET", path);
}

export const endpoints = {
  googleStart: () => `${API}/auth/google`,
};
