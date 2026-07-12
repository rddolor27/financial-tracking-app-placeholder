import {
  createApiClient,
  AuthService,
  AccountsService,
  CategoriesService,
  TransactionsService,
  BudgetsService,
  GoalsService,
  BillRemindersService,
  InvestmentsService,
  InsightsService,
  ExportService,
  ImportService,
  UsersService,
} from '@financial-tracker/api-client';
import { authStore } from '@financial-tracker/store';
import { env } from './env';

const baseURL = env.NEXT_PUBLIC_API_URL;

export const apiClient = createApiClient({
  baseURL,
  // Auth is carried by an httpOnly cookie set by the API; send it on every request.
  withCredentials: true,
  getAccessToken: () => authStore.getState().accessToken,
  // Return a sentinel when there is no in-memory token (e.g. after a page reload)
  // so the 401-refresh flow still runs — the refresh token travels in the cookie.
  getRefreshToken: () => authStore.getState().refreshToken ?? 'cookie',
  onRefreshToken: async () => {
    const authService = new AuthService(apiClient);
    // Body may be empty for web; the API reads the refresh token from the cookie.
    const result = await authService.refresh({
      refresh_token: authStore.getState().refreshToken ?? '',
    });
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
export const goalsService = new GoalsService(apiClient);
export const billRemindersService = new BillRemindersService(apiClient);
export const investmentsService = new InvestmentsService(apiClient);
export const insightsService = new InsightsService(apiClient);
export const exportService = new ExportService(apiClient);
export const importService = new ImportService(apiClient);
export const usersService = new UsersService(apiClient);
