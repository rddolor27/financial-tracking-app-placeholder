'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateGoalSchema } from '@financial-tracker/shared-types';
import type { Goal } from '@financial-tracker/shared-types';
import { FiPlus, FiTrash2, FiTarget } from 'react-icons/fi';
import { useGoals, useCreateGoal, useContributeGoal, useDeleteGoal } from '@/lib/crud-hooks';
import { money } from '@financial-tracker/shared-utils';
import { Card, Chip, ProgressBar, IconBox, EmptyState } from '@/components/ui';

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
    defaultValues: { currency: 'PHP', icon: 'fa-bullseye', color: '#3b82f6' },
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
  const summary = useMemo(() => {
    const active = goalsList.filter((g) => !g.is_completed);
    const saved = goalsList.reduce((s, g) => s + g.current_amount, 0);
    const target = goalsList.reduce((s, g) => s + g.target_amount, 0);
    return { active: active.length, saved, target };
  }, [goalsList]);

  const inputCls =
    'w-full px-3 py-2 rounded-[10px] bg-canvas border border-line text-[13px] text-ink focus:outline-none focus:border-primary';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <div>
          <div className="font-bold text-[16px]">Financial goals</div>
          <div className="text-[12px] text-faint mt-0.5">
            {summary.active} active · {money(summary.saved)} saved of {money(summary.target)}
          </div>
        </div>
        <div className="flex-1" />
        <button onClick={() => setShowForm((v) => !v)} className="btn-p">
          <FiPlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'New goal'}
        </button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Goal name</label>
                <input {...register('name')} className={inputCls} placeholder="e.g. Emergency Fund" />
                {errors.name && <p className="text-loss text-[12px] mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Target amount</label>
                <input type="number" step="0.01" {...register('target_amount', { valueAsNumber: true })} className={inputCls} />
                {errors.target_amount && <p className="text-loss text-[12px] mt-1">{errors.target_amount.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-muted mb-1">Target date (optional)</label>
              <input type="date" {...register('target_date')} className={inputCls} />
            </div>
            <button type="submit" disabled={createMutation.isPending} className="btn-p self-start disabled:opacity-50">
              {createMutation.isPending ? 'Creating…' : 'Create goal'}
            </button>
          </form>
        </Card>
      )}

      {isLoading ? (
        <Card><EmptyState>Loading goals…</EmptyState></Card>
      ) : goalsList.length === 0 ? (
        <Card><EmptyState>No goals yet. Create one to start saving.</EmptyState></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {goalsList.map((goal) => {
            const pct = goal.target_amount > 0
              ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
              : 0;
            const remaining = Math.max(0, goal.target_amount - goal.current_amount);
            return (
              <Card key={goal.id}>
                <div className="flex items-center gap-3 mb-3.5">
                  <IconBox bg={`${goal.color}1a`} color={goal.color} radius={12}>
                    <FiTarget className="w-[18px] h-[18px]" />
                  </IconBox>
                  <div className="font-bold text-[13.5px] min-w-0 truncate">{goal.name}</div>
                  <span className="ml-auto">
                    <Chip variant={goal.is_completed ? 'up' : 'vio'}>{Math.round(pct)}%</Chip>
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="mono text-[20px]">{money(goal.current_amount)}</span>
                  <span className="text-[12px] text-faint">/ {money(goal.target_amount)}</span>
                </div>
                <ProgressBar pct={pct} color={goal.color} height={9} />
                <div className="text-[11px] text-faint mt-2.5">
                  {goal.target_date ? `Target ${goal.target_date} · ` : ''}
                  {goal.is_completed ? 'Completed 🎉' : `${money(remaining)} to go`}
                </div>

                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-line2 text-[12px]">
                  {contributeId === goal.id ? (
                    <>
                      <input
                        type="number"
                        step="0.01"
                        value={contributeAmount}
                        onChange={(e) => setContributeAmount(e.target.value)}
                        className="w-28 field-input"
                        placeholder="Amount"
                      />
                      <button
                        onClick={() => handleContribute(goal.id)}
                        disabled={contributeMutation.isPending}
                        className="font-semibold text-gain-light"
                      >
                        Save
                      </button>
                      <button onClick={() => setContributeId(null)} className="text-faint">Cancel</button>
                    </>
                  ) : (
                    <>
                      {!goal.is_completed && (
                        <button
                          onClick={() => setContributeId(goal.id)}
                          className="font-semibold text-primary-light"
                        >
                          Add funds
                        </button>
                      )}
                      <button
                        onClick={() => deleteMutation.mutate(goal.id)}
                        title="Delete"
                        className="ml-auto text-faint hover:text-loss transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
