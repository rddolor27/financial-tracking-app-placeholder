'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBillReminderSchema } from '@financial-tracker/shared-types';
import type { BillReminder } from '@financial-tracker/shared-types';
import { FiPlus, FiTrash2, FiClock } from 'react-icons/fi';
import { useBillReminders, useCreateBillReminder, useDeleteBillReminder } from '@/lib/crud-hooks';
import { money } from '@financial-tracker/shared-utils';
import { Card, Chip, IconBox, EmptyState } from '@/components/ui';

type BillForm = {
  name: string;
  amount: number;
  currency?: string;
  due_day: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  reminder_days_before?: number;
  auto_create_transaction?: boolean;
};

const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
] as const;

export default function BillsPage() {
  const { data: bills, isLoading } = useBillReminders();
  const createMutation = useCreateBillReminder();
  const deleteMutation = useDeleteBillReminder();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BillForm>({
    resolver: zodResolver(CreateBillReminderSchema),
    defaultValues: { currency: 'PHP', frequency: 'monthly', reminder_days_before: 3, auto_create_transaction: false },
  });

  const onSubmit = async (data: BillForm) => {
    await createMutation.mutateAsync(data as Parameters<typeof createMutation.mutateAsync>[0]);
    reset();
    setShowForm(false);
  };

  const billsList: BillReminder[] = bills ?? [];
  const today = new Date().getDate();
  const upcomingTotal = useMemo(
    () => billsList.filter((b) => b.is_active).reduce((s, b) => s + b.amount, 0),
    [billsList],
  );

  const inputCls =
    'w-full px-3 py-2 rounded-[10px] bg-canvas border border-line text-[13px] text-ink focus:outline-none focus:border-primary';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <div>
          <div className="font-bold text-[16px]">Bill reminders</div>
          <div className="text-[12px] text-faint mt-0.5">{money(upcomingTotal)} across active bills</div>
        </div>
        <div className="flex-1" />
        <button onClick={() => setShowForm((v) => !v)} className="btn-p">
          <FiPlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add bill'}
        </button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Bill name</label>
                <input {...register('name')} className={inputCls} placeholder="e.g. Netflix, Electric Bill" />
                {errors.name && <p className="text-loss text-[12px] mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Amount</label>
                <input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} className={inputCls} />
                {errors.amount && <p className="text-loss text-[12px] mt-1">{errors.amount.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Due day</label>
                <input type="number" min="1" max="31" {...register('due_day', { valueAsNumber: true })} className={inputCls} />
                {errors.due_day && <p className="text-loss text-[12px] mt-1">{errors.due_day.message}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Frequency</label>
                <select {...register('frequency')} className={inputCls}>
                  {FREQUENCIES.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Remind days before</label>
                <input type="number" min="0" max="30" {...register('reminder_days_before', { valueAsNumber: true })} className={inputCls} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" {...register('auto_create_transaction')} />
              Auto-create transaction on due date
            </label>
            <button type="submit" disabled={createMutation.isPending} className="btn-p self-start disabled:opacity-50">
              {createMutation.isPending ? 'Creating…' : 'Create bill reminder'}
            </button>
          </form>
        </Card>
      )}

      {isLoading ? (
        <Card><EmptyState>Loading bills…</EmptyState></Card>
      ) : billsList.length === 0 ? (
        <Card><EmptyState>No bill reminders yet. Add one to stay on top of payments.</EmptyState></Card>
      ) : (
        <Card>
          {billsList.map((bill) => {
            const due = bill.due_day <= today;
            return (
              <div key={bill.id} className="flex items-center gap-3 py-[11px] border-b border-line2 last:border-none">
                <IconBox bg="var(--primary-tint)" color="var(--primary-light)">
                  <FiClock className="w-4 h-4" />
                </IconBox>
                <div className="min-w-0">
                  <div className="font-semibold text-[13px] truncate">{bill.name}</div>
                  <div className="text-[11px] text-faint mt-0.5">
                    {bill.frequency} · due day {bill.due_day}
                    {bill.auto_create_transaction ? ' · auto-create' : ''}
                  </div>
                </div>
                <div className="flex-1" />
                <div className="mono text-[13.5px] mr-3">{money(bill.amount, bill.currency)}</div>
                <Chip variant={!bill.is_active ? 'vio' : due ? 'down' : 'vio'}>
                  {!bill.is_active ? 'Inactive' : due ? 'Due now' : 'Upcoming'}
                </Chip>
                <button
                  onClick={() => deleteMutation.mutate(bill.id)}
                  title="Delete"
                  className="ml-3 text-faint hover:text-loss transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
