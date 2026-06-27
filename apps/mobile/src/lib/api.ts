import { createApiClient, AuthService } from '@financial-tracker/api-client';
import { authStore } from '@financial-tracker/store';
import { clearTokens, setTokens } from './secure-storage';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = createApiClient({
  baseURL,
  getAccessToken: () => authStore.getState().accessToken,
  getRefreshToken: () => authStore.getState().refreshToken,
  onRefreshToken: async (refreshToken: string) => {
    const authService = new AuthService(apiClient);
    const result = await authService.refresh({ refresh_token: refreshToken });
    return { access_token: result.access_token, refresh_token: result.refresh_token };
  },
  onTokenRefreshed: async (tokens) => {
    authStore.getState().setTokens(tokens.access_token, tokens.refresh_token);
    await setTokens(tokens.access_token, tokens.refresh_token);
  },
  onAuthError: async () => {
    authStore.getState().logout();
    await clearTokens();
  },
});

export const authService = new AuthService(apiClient);
