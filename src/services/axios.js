import axios from "axios";
import { DEV_BASE_URL, DEV_MEDIA_URL, MODE, PROD_MEDIA_URL } from "../utils/constants"; //  PROD || DEV
import qs from "qs";
// ===================
// API Configuration
// ===================

export const MEDIA_URL =
  MODE == "DEV" ? DEV_MEDIA_URL : PROD_MEDIA_URL;
export const BASE_URL =
  MODE == "DEV"
    ? DEV_BASE_URL
    : PROD_MEDIA_URL;

// ===================
// Redirect to Login
// ===================

const redirectToLogin = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// ===================
// Axios Instance
// ===================

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: "comma" });
  },
});

// ===================
// Request Interceptor
// ===================

axiosInstance.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    request.headers["Accept-Language"] =
      localStorage.getItem("haraj_lang") || "en";
    return request;
  },
  (error) => Promise.reject(error)
);

// ===================
// Response Interceptor
// ===================

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    token ? resolve(token) : reject(error);
  });
  refreshQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Track retry count directly on the request
    originalRequest._retryCount = originalRequest._retryCount || 0;

    // Only handle 401 errors (Unauthorized)
    if (error.response?.status !== 401 || originalRequest._retryCount >= 1) {
      return Promise.reject(error);
    }

    // If the request URL is /refresh, and we get a 401 response, do not retry
    if (
      originalRequest.url.includes("/auth/refresh") &&
      error.response?.status === 401
    ) {
      console.log("Refresh token request failed (401). Redirecting to login.");
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retryCount++;

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const { data } = await axiosInstance.get("/auth/refresh");
        const { access_token } = data;

        localStorage.setItem("token", access_token);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;
        processQueue(null, access_token);
        isRefreshing = false;

        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    return new Promise((resolve, reject) => {
      refreshQueue.push({ resolve, reject });
    }).then((token) => {
      originalRequest.headers["Authorization"] = `Bearer ${token}`;
      return axiosInstance(originalRequest);
    });
  }
);
