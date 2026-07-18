'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateAccountSchema } from '@financial-tracker/shared-types';
import type { AccountResponse } from '@financial-tracker/shared-types';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAccounts, useCreateAccount, useDeleteAccount } from '@/lib/crud-hooks';
import { money } from '@financial-tracker/shared-utils';
import { Card, IconBox, EmptyState } from '@/components/ui';

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

const typeLabel = (t: string) => t.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function AccountsPage() {
  const { data: accountsData, isLoading } = useAccounts();
  const createMutation = useCreateAccount();
  const deleteMutation = useDeleteAccount();
  const [showForm, setShowForm] = useState(false);

  const accounts: AccountResponse[] = useMemo(
    () => accountsData?.data ?? [],
    [accountsData],
  );
  const netWorth = useMemo(
    () => accounts.reduce((s, a) => s + Number(a.balance), 0),
    [accounts],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountForm>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: { balance: 0, currency: 'PHP', color: '#3b82f6', icon: 'fa-wallet' },
  });

  const onSubmit = async (data: AccountForm) => {
    await createMutation.mutateAsync(data as Parameters<typeof createMutation.mutateAsync>[0]);
    reset();
    setShowForm(false);
  };

  const inputCls =
    'w-full px-3 py-2 rounded-[10px] bg-canvas border border-line text-[13px] text-ink focus:outline-none focus:border-primary';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <div>
          <div className="font-bold text-[16px]">Sources of funds</div>
          <div className="text-[12px] text-faint mt-0.5">
            {accounts.length} account{accounts.length !== 1 ? 's' : ''} · net {money(netWorth)}
          </div>
        </div>
        <div className="flex-1" />
        <button onClick={() => setShowForm((v) => !v)} className="btn-p">
          <FiPlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add account'}
        </button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Name</label>
                <input {...register('name')} className={inputCls} placeholder="My Account" />
                {errors.name && <p className="text-loss text-[12px] mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Type</label>
                <select {...register('type')} className={inputCls}>
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Bank name (optional)</label>
                <input {...register('bank_name')} className={inputCls} placeholder="e.g. BDO, BPI" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Initial balance</label>
                <input type="number" step="0.01" {...register('balance', { valueAsNumber: true })} className={inputCls} />
              </div>
            </div>
            <button type="submit" disabled={createMutation.isPending} className="btn-p self-start disabled:opacity-50">
              {createMutation.isPending ? 'Creating…' : 'Create account'}
            </button>
          </form>
        </Card>
      )}

      {isLoading ? (
        <Card><EmptyState>Loading accounts…</EmptyState></Card>
      ) : accounts.length === 0 ? (
        <Card><EmptyState>No accounts yet. Create one to get started.</EmptyState></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts.map((account) => {
            const negative = Number(account.balance) < 0 || account.type === 'credit_card' || account.type === 'loan';
            return (
              <Card key={account.id}>
                <div className="flex items-center gap-3 mb-4">
                  <IconBox bg="var(--primary-tint)" color={account.color || 'var(--primary-light)'} radius={12}>
                    <span className="font-extrabold">{account.name[0]?.toUpperCase() ?? '•'}</span>
                  </IconBox>
                  <div className="min-w-0">
                    <div className="font-bold text-[13.5px] truncate">{account.name}</div>
                    <div className="text-[11px] text-faint mt-0.5 truncate">
                      {typeLabel(account.type)}{account.bank_name ? ` · ${account.bank_name}` : ''}
                    </div>
                  </div>
                  <div className="flex-1" />
                  <button
                    onClick={() => deleteMutation.mutate(account.id)}
                    title="Delete"
                    className="text-faint hover:text-loss transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <div
                  className="mono text-[23px]"
                  style={{ color: negative ? 'var(--red)' : 'var(--ink)' }}
                >
                  {Number(account.balance) < 0 ? '−' : ''}
                  {money(Math.abs(Number(account.balance)), account.currency)}
                </div>
                <div className="text-[11px] text-faint mt-1">
                  {negative ? 'Outstanding balance' : 'Available balance'}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
