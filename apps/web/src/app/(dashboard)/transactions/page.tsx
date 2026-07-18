'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTransactionSchema } from '@financial-tracker/shared-types';
import type { TransactionResponse } from '@financial-tracker/shared-types';
import { FiSearch, FiDownload, FiPlus, FiTrash2 } from 'react-icons/fi';
import {
  useTransactions,
  useCreateTransaction,
  useDeleteTransaction,
  useAccounts,
  useCategories,
} from '@/lib/crud-hooks';
import { money } from '@financial-tracker/shared-utils';
import { Card, Kpi, IconBox, EmptyState } from '@/components/ui';

type TransactionForm = {
  account_id: string;
  category_id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description?: string | null;
  date: string;
};

export default function TransactionsPage() {
  const { data: transactionsData, isLoading } = useTransactions();
  const { data: accountsData } = useAccounts();
  const { data: categoriesData } = useCategories();
  const createMutation = useCreateTransaction();
  const deleteMutation = useDeleteTransaction();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const accounts = useMemo(() => accountsData?.data ?? [], [accountsData]);
  const categories = useMemo(() => categoriesData ?? [], [categoriesData]);
  const transactions: TransactionResponse[] = useMemo(
    () => transactionsData?.data ?? [],
    [transactionsData],
  );

  const catMap = useMemo(() => {
    const m = new Map<string, { name: string; color: string }>();
    categories.forEach((c) => m.set(c.id, { name: c.name, color: c.color }));
    return m;
  }, [categories]);
  const acctMap = useMemo(() => {
    const m = new Map<string, string>();
    accounts.forEach((a) => m.set(a.id, a.name));
    return m;
  }, [accounts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter(
      (t) =>
        (t.description ?? '').toLowerCase().includes(q) ||
        (catMap.get(t.category_id)?.name ?? '').toLowerCase().includes(q),
    );
  }, [transactions, search, catMap]);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    filtered.forEach((t) => {
      if (t.type === 'income') income += Number(t.amount);
      else if (t.type === 'expense') expense += Number(t.amount);
    });
    return { income, expense, net: income - expense };
  }, [filtered]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionForm>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: { type: 'expense', date: new Date().toISOString().split('T')[0] },
  });

  const onSubmit = async (data: TransactionForm) => {
    await createMutation.mutateAsync(data as Parameters<typeof createMutation.mutateAsync>[0]);
    reset();
    setShowForm(false);
  };

  const inputCls =
    'w-full px-3 py-2 rounded-[10px] bg-canvas border border-line text-[13px] text-ink focus:outline-none focus:border-primary';

  return (
    <div className="flex flex-col gap-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-2 bg-canvas border border-line rounded-[10px] px-3 py-2 w-[280px] text-faint text-[13px]">
          <FiSearch className="w-4 h-4 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search description or category…"
            className="bg-transparent outline-none text-ink placeholder:text-faint w-full"
          />
        </div>
        <div className="flex-1" />
        <button className="btn-g">
          <FiDownload className="w-4 h-4" /> Export
        </button>
        <button onClick={() => setShowForm((v) => !v)} className="btn-p">
          <FiPlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add transaction'}
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Kpi label="Income · this view" value={money(totals.income)} valueClass="text-gain-light" />
        <Kpi label="Expenses · this view" value={money(totals.expense)} valueClass="text-loss" />
        <Kpi
          label="Net"
          value={`${totals.net >= 0 ? '+' : '−'}${money(Math.abs(totals.net))}`}
          valueClass={totals.net >= 0 ? 'text-gain-light' : 'text-loss'}
        />
      </div>

      {/* Add form */}
      {showForm && (
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Type</label>
                <select {...register('type')} className={inputCls}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Amount</label>
                <input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} className={inputCls} />
                {errors.amount && <p className="text-loss text-[12px] mt-1">{errors.amount.message}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Date</label>
                <input type="date" {...register('date')} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Account</label>
                <select {...register('account_id')} className={inputCls}>
                  <option value="">Select account</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
                {errors.account_id && <p className="text-loss text-[12px] mt-1">{errors.account_id.message}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Category</label>
                <select {...register('category_id')} className={inputCls}>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-loss text-[12px] mt-1">{errors.category_id.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-muted mb-1">Description (optional)</label>
              <input {...register('description')} className={inputCls} placeholder="What was this for?" />
            </div>
            <button type="submit" disabled={createMutation.isPending} className="btn-p self-start disabled:opacity-50">
              {createMutation.isPending ? 'Creating…' : 'Create transaction'}
            </button>
          </form>
        </Card>
      )}

      {/* Table */}
      <Card>
        {isLoading ? (
          <EmptyState>Loading transactions…</EmptyState>
        ) : filtered.length === 0 ? (
          <EmptyState>No transactions found.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Transaction', 'Category', 'Account', 'Date', 'Amount', ''].map((h, i) => (
                    <th
                      key={h || i}
                      className={`text-[11px] font-bold text-faint uppercase tracking-[0.04em] pb-3 ${
                        i >= 4 ? 'text-right' : 'text-left'
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => {
                  const cat = catMap.get(tx.category_id);
                  const income = tx.type === 'income';
                  return (
                    <tr key={tx.id} className="border-t border-line2">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <IconBox bg="var(--primary-tint)" color={cat?.color ?? 'var(--primary-light)'} size={32} radius={9}>
                            {cat?.name?.[0] ?? '•'}
                          </IconBox>
                          <b className="font-semibold text-[13px]">{tx.description || cat?.name || 'Transaction'}</b>
                        </div>
                      </td>
                      <td className="py-3 text-[13px] text-muted">{cat?.name ?? 'Uncategorized'}</td>
                      <td className="py-3 text-[13px] text-muted">{acctMap.get(tx.account_id) ?? '—'}</td>
                      <td className="py-3 text-[13px] text-faint">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="py-3 text-right">
                        <b
                          className="mono text-[13px]"
                          style={{ color: income ? 'var(--green-d)' : tx.type === 'expense' ? 'var(--red)' : 'var(--ink)' }}
                        >
                          {income ? '+' : tx.type === 'expense' ? '−' : ''}
                          {money(Math.abs(Number(tx.amount)))}
                        </b>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => deleteMutation.mutate(tx.id)}
                          title="Delete"
                          className="text-faint hover:text-loss transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4 text-[12px] text-faint">
              <span>Showing {filtered.length} of {transactions.length}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
