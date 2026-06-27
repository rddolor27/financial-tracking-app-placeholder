'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateAccountSchema } from '@financial-tracker/shared-types';
import type { AccountResponse } from '@financial-tracker/shared-types';
import { useAccounts, useCreateAccount, useDeleteAccount } from '@/lib/crud-hooks';
import { formatCurrency } from '@financial-tracker/shared-utils';

type AccountForm = {
  name: string;
  type: 'checking' | 'savings' | 'credit_card' | 'cash' | 'investment' | 'loan' | 'e_wallet';
  bank_name?: string | null;
  balance?: number;
  currency?: string;
  color?: string;
  icon?: string;
};

const ACCOUNT_TYPES = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'investment', label: 'Investment' },
  { value: 'loan', label: 'Loan' },
  { value: 'e_wallet', label: 'E-Wallet' },
] as const;

export default function AccountsPage() {
  const { data: accountsData, isLoading } = useAccounts();
  const createMutation = useCreateAccount();
  const deleteMutation = useDeleteAccount();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountForm>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: { balance: 0, currency: 'PHP', color: '#4A90D9', icon: 'fa-wallet' },
  });

  const accounts: AccountResponse[] = accountsData?.data ?? [];

  const onSubmit = async (data: AccountForm) => {
    await createMutation.mutateAsync(data as Parameters<typeof createMutation.mutateAsync>[0]);
    reset();
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {showForm ? 'Cancel' : 'Add Account'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My Account"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  {...register('type')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Bank Name (optional)</label>
                <input
                  {...register('bank_name')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. BDO, BPI"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Initial Balance</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('balance', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="text-zinc-500">Loading accounts...</p>
      ) : accounts.length === 0 ? (
        <p className="text-zinc-500">No accounts yet. Create one to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: account.color }}
                />
                <span className="text-xs text-zinc-500 uppercase">{account.type.replace('_', ' ')}</span>
              </div>
              <h3 className="font-semibold text-lg">{account.name}</h3>
              {account.bank_name && (
                <p className="text-sm text-zinc-500">{account.bank_name}</p>
              )}
              <p className="text-xl font-bold mt-2">
                {formatCurrency(account.balance, account.currency)}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => deleteMutation.mutate(account.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
