import axios from "axios";

const resolveApiBaseUrl = () => {
  const configuredUrl = process.env.NEXT_API_URL ?? process.env.BASE_URL ?? "http://localhost:4000/api/v1";
  return configuredUrl.replace(/\/$/, "");
};

export const BaseURL = resolveApiBaseUrl();

export const AxiosInstance = axios.create({
  baseURL: BaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let accessToken = "";
let refreshPromise: Promise<string | null> | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token ?? "";
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
    // Skip token refresh logic for auth endpoints (login, register, refresh, etc.)
    if (!originalRequest || originalRequest.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        refreshPromise ??= axios.post(`${BaseURL}/auth/refresh`, {}, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }).then((response) => {
          const payload = response.data?.data ?? response.data ?? {};
          const newAccessToken = payload.accessToken ?? payload.token ?? null;
          setAccessToken(newAccessToken);
          return newAccessToken;
        }).catch(() => {
          setAccessToken(null);
          return null;
        }).finally(() => {
          refreshPromise = null;
        });

        const newAccessToken = await refreshPromise;
        if (newAccessToken) {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return AxiosInstance(originalRequest);
        }
      } catch {
        setAccessToken(null);
      }
    }

    return Promise.reject(error);
  },
);