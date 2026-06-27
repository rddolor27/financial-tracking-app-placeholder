'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@financial-tracker/query-hooks';
import type {
  CreateAccount,
  UpdateAccount,
  CreateTransaction,
  UpdateTransaction,
  CreateCategory,
  UpdateCategory,
  CreateBudget,
  UpdateBudget,
} from '@financial-tracker/shared-types';
import { accountsService, transactionsService, categoriesService, budgetsService } from './api';

// ---- Accounts ----

export function useAccounts() {
  return useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: () => accountsService.getAll(),
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: queryKeys.accounts.detail(id),
    queryFn: () => accountsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAccount) => accountsService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.accounts.all }),
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccount }) => accountsService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.accounts.all }),
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.accounts.all }),
  });
}

// ---- Transactions ----

export function useTransactions(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.transactions.list(filters),
    queryFn: () => transactionsService.getAll(filters as Parameters<typeof transactionsService.getAll>[0]),
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransaction) => transactionsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.transactions.all });
      qc.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.transactions.all });
      qc.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
}

// ---- Categories ----

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoriesService.getAll(),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategory) => categoriesService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.categories.all }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategory }) => categoriesService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.categories.all }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.categories.all }),
  });
}

// ---- Budgets ----

export function useBudgets() {
  return useQuery({
    queryKey: queryKeys.budgets.all,
    queryFn: () => budgetsService.getAll(),
  });
}

export function useCreateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBudget) => budgetsService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.budgets.all }),
  });
}

export function useUpdateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudget }) => budgetsService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.budgets.all }),
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => budgetsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.budgets.all }),
  });
}
