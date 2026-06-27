import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@financial-tracker/query-hooks';
import type {
  CreateAccount,
  CreateTransaction,
  CreateCategory,
  CreateBudget,
  CreateGoal,
  ContributeGoal,
  CreateBillReminder,
  CreateInvestment,
} from '@financial-tracker/shared-types';
import {
  accountsService,
  transactionsService,
  categoriesService,
  budgetsService,
  goalsService,
  billRemindersService,
  investmentsService,
} from './api';

// ---- Accounts ----

export function useAccounts() {
  return useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: () => accountsService.getAll(),
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAccount) => accountsService.create(data),
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

// ---- Goals ----

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals.all,
    queryFn: () => goalsService.getAll(),
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGoal) => goalsService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.goals.all }),
  });
}

export function useContributeGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ContributeGoal }) => goalsService.contribute(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.goals.all }),
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => goalsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.goals.all }),
  });
}

// ---- Bill Reminders ----

export function useBillReminders() {
  return useQuery({
    queryKey: queryKeys.billReminders.all,
    queryFn: () => billRemindersService.getAll(),
  });
}

export function useCreateBillReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBillReminder) => billRemindersService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.billReminders.all }),
  });
}

export function useDeleteBillReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => billRemindersService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.billReminders.all }),
  });
}

// ---- Investments ----

export function useInvestments() {
  return useQuery({
    queryKey: queryKeys.investments.all,
    queryFn: () => investmentsService.getAll(),
  });
}

export function useCreateInvestment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInvestment) => investmentsService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.investments.all }),
  });
}

export function useDeleteInvestment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => investmentsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.investments.all }),
  });
}
