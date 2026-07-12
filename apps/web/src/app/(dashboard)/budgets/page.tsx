'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBudgetSchema } from '@financial-tracker/shared-types';
import type { BudgetResponse } from '@financial-tracker/shared-types';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import {
  useBudgets,
  useCreateBudget,
  useDeleteBudget,
  useCategories,
  useSpendingByCategory,
} from '@/lib/crud-hooks';
import { money } from '@financial-tracker/shared-utils';
import { Card, Chip, ProgressBar, EmptyState } from '@/components/ui';

type BudgetForm = {
  category_id: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  alert_threshold?: number;
};

const monthRange = () => {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
    end: now.toISOString().split('T')[0],
  };
};

const chipVariant = (pct: number) => (pct >= 100 ? 'down' : pct > 80 ? 'amb' : 'up');
const barColor = (pct: number) => (pct >= 100 ? 'var(--red)' : pct > 80 ? 'var(--amber)' : 'var(--green)');

export default function BudgetsPage() {
  const { start, end } = monthRange();
  const { data: budgetsData, isLoading } = useBudgets();
  const { data: categories = [] } = useCategories();
  const { data: spending } = useSpendingByCategory(start, end);
  const createMutation = useCreateBudget();
  const deleteMutation = useDeleteBudget();
  const [showForm, setShowForm] = useState(false);

  const budgets: BudgetResponse[] = budgetsData?.data ?? [];
  const catMap = useMemo(() => {
    const m = new Map<string, { name: string; type: string }>();
    (categories as Array<{ id: string; name: string; type: string }>).forEach((c) =>
      m.set(c.id, { name: c.name, type: c.type }),
    );
    return m;
  }, [categories]);
  const spentByCat = useMemo(() => {
    const m = new Map<string, number>();
    (spending ?? []).forEach((s) => m.set(s.category_id, Number(s.total)));
    return m;
  }, [spending]);

  const expenseCategories = (categories as Array<{ id: string; name: string; type: string }>).filter(
    (c) => c.type === 'expense',
  );

  const rows = useMemo(
    () =>
      budgets.map((b) => {
        const spent = spentByCat.get(b.category_id) ?? 0;
        const limit = Number(b.amount);
        const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
        return { budget: b, name: catMap.get(b.category_id)?.name ?? 'Budget', spent, limit, pct };
      }),
    [budgets, spentByCat, catMap],
  );

  const totalSpent = rows.reduce((s, r) => s + r.spent, 0);
  const totalLimit = rows.reduce((s, r) => s + r.limit, 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetForm>({
    resolver: zodResolver(CreateBudgetSchema),
    defaultValues: {
      period: 'monthly',
      start_date: new Date().toISOString().split('T')[0],
      alert_threshold: 0.8,
    },
  });

  const onSubmit = async (data: BudgetForm) => {
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
          <div className="font-bold text-[16px]">Monthly budgets</div>
          <div className="text-[12px] text-faint mt-0.5">
            {money(totalSpent)} of {money(totalLimit)} spent
          </div>
        </div>
        <div className="flex-1" />
        <button onClick={() => setShowForm((v) => !v)} className="btn-p">
          <FiPlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'New budget'}
        </button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Category</label>
                <select {...register('category_id')} className={inputCls}>
                  <option value="">Select category</option>
                  {expenseCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-loss text-[12px] mt-1">{errors.category_id.message}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Amount</label>
                <input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} className={inputCls} />
                {errors.amount && <p className="text-loss text-[12px] mt-1">{errors.amount.message}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Period</label>
                <select {...register('period')} className={inputCls}>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={createMutation.isPending} className="btn-p self-start disabled:opacity-50">
              {createMutation.isPending ? 'Creating…' : 'Create budget'}
            </button>
          </form>
        </Card>
      )}

      {isLoading ? (
        <Card><EmptyState>Loading budgets…</EmptyState></Card>
      ) : rows.length === 0 ? (
        <Card><EmptyState>No budgets yet. Create one to track your spending.</EmptyState></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rows.map(({ budget, name, spent, limit, pct }) => (
            <Card key={budget.id}>
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-[13.5px]">{name}</div>
                <div className="flex items-center gap-2">
                  <Chip variant={chipVariant(pct)}>{pct}%</Chip>
                  <button
                    onClick={() => deleteMutation.mutate(budget.id)}
                    title="Delete"
                    className="text-faint hover:text-loss transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="mono text-[20px]">{money(spent)}</span>
                <span className="text-[12px] text-faint">/ {money(limit)}</span>
              </div>
              <ProgressBar pct={pct} color={barColor(pct)} height={9} />
              <div className="text-[11px] text-faint mt-2.5">
                {pct >= 100 ? 'Over budget' : `${money(Math.max(0, limit - spent))} remaining`} · {budget.period}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
