import axios from "axios";
import {
  getTokenFromLocalStorage,
  scheduleNextAccessToken,
} from "./token-manager";
import { store } from "./Redux/store";
import { logout, login } from "./Redux/authSlice";
import { UserResponse } from "./types/loginResponse.type";

const BASE_URL = "http://35.154.36.220:8083/";

const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe functions to be called when token is refreshed
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// Notify subscribers when new token is available
function onTokenRefreshed(newToken: string) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

// Fetch new access token
async function fetchNewAccessToken() {
  console.log("Attempting to refresh token...");
  if (isRefreshing) {
    return new Promise<string>((resolve) => {
      subscribeTokenRefresh(resolve);
    });
  }

  isRefreshing = true;

  try {
    const response = await axios.get(`${BASE_URL}/api/refreshToken`, {
      withCredentials: true,
    });

    console.log("Refresh Token Response:", response);

    const newAccessToken = response.data.accessToken;

    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
      scheduleNextAccessToken(newAccessToken);
      onTokenRefreshed(newAccessToken);

      http.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;

      const currentUser =
        store.getState().auth.user?.user ?? ({} as UserResponse);

      store.dispatch(
        login({
          user: currentUser,
          authTokenResponse: {
            accessToken: newAccessToken,
            tokenExpiryTime: new Date(Date.now() + 3600 * 1000).toISOString(),
            refreshTokenExpiryTime: new Date(
              Date.now() + 24 * 3600 * 1000
            ).toISOString(),
            statusCode: 200,
          },
        })
      );

      return newAccessToken;
    } else {
      throw new Error("No access token returned from refresh token endpoint.");
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    store.dispatch(logout());
    localStorage.removeItem("accessToken");
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
}

// Request Interceptor (Attach Token)
http.interceptors.request.use(
  (config) => {
    const token =
      getTokenFromLocalStorage() || localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Handle Expired Token)
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await fetchNewAccessToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return http(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed. Redirecting to login.");
        store.dispatch(logout());
        sessionStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

console.log("Axios Initialized with Base URL:", http.defaults.baseURL);

export default http;
