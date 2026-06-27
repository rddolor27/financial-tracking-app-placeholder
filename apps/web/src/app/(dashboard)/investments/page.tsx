'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateInvestmentSchema } from '@financial-tracker/shared-types';
import { useInvestments, useCreateInvestment, useDeleteInvestment, useAccounts } from '@/lib/crud-hooks';
import { formatCurrency } from '@financial-tracker/shared-utils';

type InvestmentForm = {
  account_id: string;
  symbol: string;
  name: string;
  asset_type: 'crypto' | 'us_stock' | 'ph_stock';
  quantity?: number;
  avg_buy_price?: number;
  currency?: string;
};

const ASSET_TYPES = [
  { value: 'crypto', label: 'Crypto' },
  { value: 'us_stock', label: 'US Stock' },
  { value: 'ph_stock', label: 'PH Stock' },
] as const;

export default function InvestmentsPage() {
  const { data: investmentsData, isLoading } = useInvestments();
  const { data: accountsData } = useAccounts();
  const createMutation = useCreateInvestment();
  const deleteMutation = useDeleteInvestment();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvestmentForm>({
    resolver: zodResolver(CreateInvestmentSchema),
    defaultValues: { quantity: 0, avg_buy_price: 0, currency: 'USD' },
  });

  const investments = investmentsData?.data ?? [];
  const investmentAccounts = (accountsData?.data ?? []).filter((a) => a.type === 'investment');

  const onSubmit = async (data: InvestmentForm) => {
    await createMutation.mutateAsync(data as Parameters<typeof createMutation.mutateAsync>[0]);
    reset();
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Investments</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          {showForm ? 'Cancel' : 'Add Investment'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Symbol</label>
                <input
                  {...register('symbol')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. BTC, AAPL, SM"
                />
                {errors.symbol && <p className="text-red-500 text-sm mt-1">{errors.symbol.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. Bitcoin, Apple Inc."
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Asset Type</label>
                <select
                  {...register('asset_type')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {ASSET_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account</label>
                <select
                  {...register('account_id')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select account</option>
                  {investmentAccounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
                {errors.account_id && <p className="text-red-500 text-sm mt-1">{errors.account_id.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <select
                  {...register('currency')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="USD">USD</option>
                  <option value="PHP">PHP</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  step="0.0001"
                  {...register('quantity', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Avg Buy Price</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('avg_buy_price', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
            >
              {createMutation.isPending ? 'Creating...' : 'Add Investment'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="text-zinc-500">Loading investments...</p>
      ) : investments.length === 0 ? (
        <p className="text-zinc-500">No investments yet. Add one to track your portfolio.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700 text-left text-sm text-zinc-500">
                <th className="pb-3 font-medium">Symbol</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium text-right">Qty</th>
                <th className="pb-3 font-medium text-right">Avg Price</th>
                <th className="pb-3 font-medium text-right">Current</th>
                <th className="pb-3 font-medium text-right">Value</th>
                <th className="pb-3 font-medium text-right">P&L</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv) => {
                const value = inv.quantity * inv.current_price;
                const cost = inv.quantity * inv.avg_buy_price;
                const pnl = value - cost;
                const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;

                return (
                  <tr key={inv.id} className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 font-mono font-semibold">{inv.symbol}</td>
                    <td className="py-3 text-sm">{inv.name}</td>
                    <td className="py-3">
                      <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                        {inv.asset_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono">{inv.quantity}</td>
                    <td className="py-3 text-right font-mono">{formatCurrency(inv.avg_buy_price, inv.currency)}</td>
                    <td className="py-3 text-right font-mono">{formatCurrency(inv.current_price, inv.currency)}</td>
                    <td className="py-3 text-right font-mono font-semibold">{formatCurrency(value, inv.currency)}</td>
                    <td className={`py-3 text-right font-mono ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {pnl >= 0 ? '+' : ''}{formatCurrency(pnl, inv.currency)} ({pnlPct.toFixed(1)}%)
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => deleteMutation.mutate(inv.id)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
