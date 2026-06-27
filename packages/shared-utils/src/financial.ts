import type { AccountType } from '@financial-tracker/shared-types';

interface AccountBalance {
  balance: number;
  type: AccountType;
}

export function calculateNetWorth(accounts: AccountBalance[]): number {
  return accounts.reduce((total, account) => total + account.balance, 0);
}

export function calculateSavingsRate(
  income: number,
  expenses: number,
): number {
  if (income === 0) return 0;
  return Math.round(((income - expenses) / income) * 100) / 100;
}

export function calculateBudgetUtilization(
  spent: number,
  budget: number,
): number {
  if (budget === 0 || spent === 0) return 0;
  return Math.round((spent / budget) * 100) / 100;
}

export function calculateInvestmentReturn(
  currentValue: number,
  totalInvested: number,
): { absoluteReturn: number; percentageReturn: number } {
  const absoluteReturn = currentValue - totalInvested;
  const percentageReturn =
    totalInvested === 0
      ? 0
      : Math.round((absoluteReturn / totalInvested) * 10000) / 100;

  return { absoluteReturn, percentageReturn };
}
