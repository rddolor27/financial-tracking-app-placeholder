import { createStore, useStore } from 'zustand';
import type { UserResponse } from '@financial-tracker/shared-types';

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (data: {
    access_token: string;
    refresh_token: string;
    user: UserResponse;
  }) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const authStore = createStore<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  setAuth: (data) =>
    set({
      user: data.user,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      isAuthenticated: true,
    }),
  setTokens: (accessToken, refreshToken) =>
    set({ accessToken, refreshToken }),
  logout: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    }),
}));

// React hook (requires React context)
export function useAuthStore(): AuthState;
export function useAuthStore<T>(selector: (state: AuthState) => T): T;
export function useAuthStore<T>(selector?: (state: AuthState) => T) {
  return useStore(authStore, selector as (state: AuthState) => T);
}

// Non-React access (for interceptors, etc.)
useAuthStore.getState = authStore.getState;
useAuthStore.setState = authStore.setState;
useAuthStore.subscribe = authStore.subscribe;
