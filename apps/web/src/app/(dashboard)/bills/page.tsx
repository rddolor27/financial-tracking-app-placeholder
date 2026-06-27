'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBillReminderSchema } from '@financial-tracker/shared-types';
import type { BillReminder } from '@financial-tracker/shared-types';
import { useBillReminders, useCreateBillReminder, useDeleteBillReminder } from '@/lib/crud-hooks';
import { formatCurrency } from '@financial-tracker/shared-utils';

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bill Reminders</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
        >
          {showForm ? 'Cancel' : 'Add Bill'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Bill Name</label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. Netflix, Electric Bill"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Due Day</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  {...register('due_day', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.due_day && <p className="text-red-500 text-sm mt-1">{errors.due_day.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <select
                  {...register('frequency')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Remind Days Before</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  {...register('reminder_days_before', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register('auto_create_transaction')} id="auto_create" />
              <label htmlFor="auto_create" className="text-sm">Auto-create transaction on due date</label>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm font-medium"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Bill Reminder'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="text-zinc-500">Loading bills...</p>
      ) : billsList.length === 0 ? (
        <p className="text-zinc-500">No bill reminders yet. Add one to stay on top of payments.</p>
      ) : (
        <div className="space-y-3">
          {billsList.map((bill) => (
            <div
              key={bill.id}
              className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">{bill.name}</h3>
                <p className="text-sm text-zinc-500">
                  {formatCurrency(bill.amount, bill.currency)} &middot; Due day {bill.due_day} &middot; {bill.frequency}
                </p>
                <div className="flex gap-2 mt-1">
                  {bill.auto_create_transaction && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Auto-create</span>
                  )}
                  {!bill.is_active && (
                    <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">Inactive</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteMutation.mutate(bill.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
