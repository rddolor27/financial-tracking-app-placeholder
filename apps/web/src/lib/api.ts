import {
  createApiClient,
  AuthService,
  AccountsService,
  CategoriesService,
  TransactionsService,
  BudgetsService,
} from '@financial-tracker/api-client';
import { authStore } from '@financial-tracker/store';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = createApiClient({
  baseURL,
  getAccessToken: () => authStore.getState().accessToken,
  getRefreshToken: () => authStore.getState().refreshToken,
  onRefreshToken: async (refreshToken: string) => {
    const authService = new AuthService(apiClient);
    const result = await authService.refresh({ refresh_token: refreshToken });
    return { access_token: result.access_token, refresh_token: result.refresh_token };
  },
  onTokenRefreshed: (tokens) => {
    authStore.getState().setTokens(tokens.access_token, tokens.refresh_token);
  },
  onAuthError: () => {
    authStore.getState().logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
});

export const authService = new AuthService(apiClient);
export const accountsService = new AccountsService(apiClient);
export const categoriesService = new CategoriesService(apiClient);
export const transactionsService = new TransactionsService(apiClient);
export const budgetsService = new BudgetsService(apiClient);
