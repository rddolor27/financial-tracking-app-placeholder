import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@financial-tracker/store';
import type { CreateUser, Login } from '@financial-tracker/shared-types';
import { authService } from './api';
import { setTokens, clearTokens } from './secure-storage';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: Login) => authService.login(data),
    onSuccess: async (result) => {
      setAuth(result);
      await setTokens(result.access_token, result.refresh_token);
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: CreateUser) => authService.register(data),
    onSuccess: async (result) => {
      setAuth(result);
      await setTokens(result.access_token, result.refresh_token);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: async () => {
      logout();
      queryClient.clear();
      await clearTokens();
    },
  });
}
