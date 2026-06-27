'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBudgetSchema } from '@financial-tracker/shared-types';
import type { BudgetResponse } from '@financial-tracker/shared-types';
import { useBudgets, useCreateBudget, useDeleteBudget, useCategories } from '@/lib/crud-hooks';
import { formatCurrency } from '@financial-tracker/shared-utils';

type BudgetForm = {
  category_id: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  alert_threshold?: number;
};

export default function BudgetsPage() {
  const { data: budgetsData, isLoading } = useBudgets();
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateBudget();
  const deleteMutation = useDeleteBudget();
  const [showForm, setShowForm] = useState(false);

  const budgets: BudgetResponse[] = budgetsData?.data ?? [];
  const expenseCategories = (categories as Array<{ id: string; name: string; type: string }>).filter((c) => c.type === 'expense');

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {showForm ? 'Cancel' : 'Add Budget'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  {...register('category_id')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {expenseCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Period</label>
                <select
                  {...register('period')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Budget'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="text-zinc-500">Loading budgets...</p>
      ) : budgets.length === 0 ? (
        <p className="text-zinc-500">No budgets yet. Create one to track your spending.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <div
              key={budget.id}
              className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-zinc-500 uppercase">{budget.period}</span>
                <button
                  onClick={() => deleteMutation.mutate(budget.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              <p className="text-xl font-bold">{formatCurrency(budget.amount, 'PHP')}</p>
              <div className="mt-3">
                <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '0%' }} />
                </div>
                <p className="text-xs text-zinc-500 mt-1">Alert at {Math.round(budget.alert_threshold * 100)}%</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
