import axios from "axios";

const productionApiBaseUrl = "https://rupakar-backend.onrender.com/api/v1";

const resolveApiBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (process.env.NODE_ENV === "production") {
    // Keep auth requests same-origin so the HttpOnly refresh cookie is first-party.
    return "/api/v1";
  }

  return (configuredUrl || productionApiBaseUrl).replace(/\/$/, "");
};

export const BaseURL = resolveApiBaseUrl();
export const ACCESS_TOKEN_STORAGE_KEY = "rupakar_access_token";

export const AxiosInstance = axios.create({
  baseURL: BaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let accessToken = "";
let refreshPromise: Promise<string | null> | null = null;

const getStoredAccessToken = () => {
  if (typeof window === "undefined") return "";

  try {
    return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
};

export const setAccessToken = (token: string | null) => {
  accessToken = token ?? "";

  if (typeof window !== "undefined") {
    if (accessToken) {
      window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
    } else {
      window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      window.localStorage.removeItem("auth_user");
    }
  }
};

type TokenListener = (token: string) => void;
const tokenListeners: Set<TokenListener> = new Set();

export const onTokenRefreshed = (fn: TokenListener) => {
  tokenListeners.add(fn);
  return () => {
    tokenListeners.delete(fn);
  };
};

const notifyTokenRefreshed = (token: string) => {
  tokenListeners.forEach((fn) => {
    try {
      fn(token);
    } catch {}
  });
};

const triggerAuthExpired = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("rupakar:auth-expired"));
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(`${BaseURL}/auth/refresh`, {}, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    const payload = response.data?.data ?? response.data ?? {};
    const newAccessToken = payload.accessToken ?? payload.token ?? null;

    setAccessToken(newAccessToken);
    if (newAccessToken) {
      notifyTokenRefreshed(newAccessToken);
    }
    return newAccessToken;
  } catch {
    setAccessToken(null);
    triggerAuthExpired();
    return null;
  } finally {
    refreshPromise = null;
  }
};

const getGuestSessionId = () => {
  if (typeof window === "undefined") return "";
  let id = "";
  try {
    id = localStorage.getItem("rupakar_guest_session") || "";
    if (!id) {
      id = "guest_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem("rupakar_guest_session", id);
    }
  } catch {
    id = "guest_fallback";
  }
  return id;
};

AxiosInstance.interceptors.request.use((config) => {
  if (!accessToken) {
    accessToken = getStoredAccessToken();
  }

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  const guestSessionId = getGuestSessionId();
  if (guestSessionId && config.headers) {
    config.headers["x-guest-session-id"] = guestSessionId;
  }
  return config;
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/") || originalRequest?.url?.includes("auth/");

    // Skip token refresh logic for auth endpoints (login, register, refresh, etc.)
    if (!originalRequest || isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      refreshPromise ??= refreshAccessToken();

      try {
        const newAccessToken = await refreshPromise;

        if (newAccessToken) {
          if (originalRequest.headers && typeof originalRequest.headers.set === "function") {
            originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
          } else {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return AxiosInstance(originalRequest);
        }
      } catch {
        setAccessToken(null);
        triggerAuthExpired();
      }
    }

    return Promise.reject(error);
  },
);