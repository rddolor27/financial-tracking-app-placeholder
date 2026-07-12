import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export interface ApiClientConfig {
  baseURL: string;
  /** Send cookies with cross-origin requests (web httpOnly-cookie auth). */
  withCredentials?: boolean;
  getAccessToken?: () => string | null;
  onRefreshToken?: (refreshToken: string) => Promise<{ access_token: string; refresh_token: string }>;
  getRefreshToken?: () => string | null;
  onTokenRefreshed?: (tokens: { access_token: string; refresh_token: string }) => void;
  onAuthError?: () => void;
}

export function createApiClient(config: ApiClientConfig): AxiosInstance {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: 30000,
    withCredentials: config.withCredentials ?? false,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor: attach JWT token
  instance.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      if (config.getAccessToken) {
        const token = config.getAccessToken();
        if (token && requestConfig.headers) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
      }
      return requestConfig;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor: handle 401 refresh
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
  }> = [];

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        config.onRefreshToken &&
        config.getRefreshToken
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = config.getRefreshToken();
          if (!refreshToken) throw new Error('No refresh token');

          const tokens = await config.onRefreshToken(refreshToken);
          config.onTokenRefreshed?.(tokens);

          processQueue(null, tokens.access_token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
          }
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          config.onAuthError?.();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
}
