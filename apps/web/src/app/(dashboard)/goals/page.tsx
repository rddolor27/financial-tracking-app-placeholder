'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateGoalSchema } from '@financial-tracker/shared-types';
import type { Goal } from '@financial-tracker/shared-types';
import { useGoals, useCreateGoal, useContributeGoal, useDeleteGoal } from '@/lib/crud-hooks';
import { formatCurrency } from '@financial-tracker/shared-utils';

type GoalForm = {
  name: string;
  target_amount: number;
  currency?: string;
  target_date?: string | null;
  icon?: string;
  color?: string;
};

export default function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const createMutation = useCreateGoal();
  const contributeMutation = useContributeGoal();
  const deleteMutation = useDeleteGoal();
  const [showForm, setShowForm] = useState(false);
  const [contributeId, setContributeId] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalForm>({
    resolver: zodResolver(CreateGoalSchema),
    defaultValues: { currency: 'PHP', icon: 'fa-bullseye', color: '#4CAF50' },
  });

  const onSubmit = async (data: GoalForm) => {
    await createMutation.mutateAsync(data as Parameters<typeof createMutation.mutateAsync>[0]);
    reset();
    setShowForm(false);
  };

  const handleContribute = async (goalId: string) => {
    const amount = parseFloat(contributeAmount);
    if (isNaN(amount) || amount <= 0) return;
    await contributeMutation.mutateAsync({ id: goalId, data: { amount } });
    setContributeId(null);
    setContributeAmount('');
  };

  const goalsList: Goal[] = goals ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Goals</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          {showForm ? 'Cancel' : 'Add Goal'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Goal Name</label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Emergency Fund"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Amount</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('target_amount', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.target_amount && <p className="text-red-500 text-sm mt-1">{errors.target_amount.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Date (optional)</label>
              <input
                type="date"
                {...register('target_date')}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Goal'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="text-zinc-500">Loading goals...</p>
      ) : goalsList.length === 0 ? (
        <p className="text-zinc-500">No goals yet. Create one to start saving.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goalsList.map((goal) => {
            const progress = goal.target_amount > 0
              ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
              : 0;

            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{goal.name}</h3>
                  {goal.is_completed && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>
                  )}
                </div>
                <p className="text-sm text-zinc-500 mb-3">
                  {formatCurrency(goal.current_amount, goal.currency)} / {formatCurrency(goal.target_amount, goal.currency)}
                </p>
                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-3 mb-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{ width: `${progress}%`, backgroundColor: goal.color }}
                  />
                </div>
                <p className="text-xs text-zinc-500 mb-3">{Math.round(progress)}% complete</p>
                {goal.target_date && (
                  <p className="text-xs text-zinc-500 mb-3">Target: {goal.target_date}</p>
                )}

                <div className="flex items-center gap-2">
                  {contributeId === goal.id ? (
                    <>
                      <input
                        type="number"
                        step="0.01"
                        value={contributeAmount}
                        onChange={(e) => setContributeAmount(e.target.value)}
                        className="w-32 px-2 py-1 border border-zinc-300 dark:border-zinc-700 rounded text-sm bg-transparent"
                        placeholder="Amount"
                      />
                      <button
                        onClick={() => handleContribute(goal.id)}
                        disabled={contributeMutation.isPending}
                        className="text-sm text-green-600 hover:text-green-800 font-medium"
                      >
                        Save
                      </button>
                      <button onClick={() => setContributeId(null)} className="text-sm text-zinc-500">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {!goal.is_completed && (
                        <button
                          onClick={() => setContributeId(goal.id)}
                          className="text-sm text-green-600 hover:text-green-800 font-medium"
                        >
                          Add Funds
                        </button>
                      )}
                      <button
                        onClick={() => deleteMutation.mutate(goal.id)}
                        className="text-sm text-red-500 hover:text-red-700 ml-auto"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
