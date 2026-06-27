'use client';

import { useState, useMemo } from 'react';
import { useSpendingByCategory, useIncomeVsExpense, useTrends, useSavingsRate } from '@/lib/crud-hooks';
import { formatCurrency } from '@financial-tracker/shared-utils';

function getDateRange(period: string) {
  const now = new Date();
  const end = now.toISOString().split('T')[0];
  let start: string;

  switch (period) {
    case 'week': {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      start = d.toISOString().split('T')[0];
      break;
    }
    case 'year': {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() - 1);
      start = d.toISOString().split('T')[0];
      break;
    }
    case 'month':
    default: {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      start = d.toISOString().split('T')[0];
      break;
    }
  }

  return { start, end };
}

const PERIODS = [
  { value: 'week', label: 'Last 7 days' },
  { value: 'month', label: 'Last 30 days' },
  { value: 'year', label: 'Last year' },
] as const;

export default function InsightsPage() {
  const [period, setPeriod] = useState('month');
  const { start, end } = useMemo(() => getDateRange(period), [period]);

  const { data: spending, isLoading: loadingSpending } = useSpendingByCategory(start, end);
  const { data: incomeExpense, isLoading: loadingIE } = useIncomeVsExpense(start, end);
  const { data: trends } = useTrends(start, end);
  const { data: savings } = useSavingsRate(start, end);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Insights</h1>
        <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                period === p.value
                  ? 'bg-white dark:bg-zinc-700 shadow-sm font-medium'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Income vs Expense Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {loadingIE ? (
          <p className="text-zinc-500 col-span-4">Loading...</p>
        ) : incomeExpense ? (
          <>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 mb-1">Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(incomeExpense.income, 'PHP')}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 mb-1">Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(incomeExpense.expense, 'PHP')}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 mb-1">Net</p>
              <p className={`text-2xl font-bold ${incomeExpense.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(incomeExpense.net, 'PHP')}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 mb-1">Savings Rate</p>
              <p className="text-2xl font-bold">{savings?.rate ?? 0}%</p>
            </div>
          </>
        ) : null}
      </div>

      {/* Spending by Category */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-6">
        <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
        {loadingSpending ? (
          <p className="text-zinc-500">Loading...</p>
        ) : !spending || spending.length === 0 ? (
          <p className="text-zinc-500">No spending data for this period.</p>
        ) : (
          <div className="space-y-3">
            {spending.map((item, i) => {
              const maxTotal = spending[0]?.total ?? 1;
              const pct = (item.total / maxTotal) * 100;

              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-600 dark:text-zinc-400">{item.category_id}</span>
                    <span className="font-medium">{formatCurrency(item.total, 'PHP')}</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Monthly Trends */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-4">Monthly Trends</h2>
        {!trends || trends.length === 0 ? (
          <p className="text-zinc-500">No trend data for this period.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700 text-left">
                  <th className="pb-2 font-medium text-zinc-500">Month</th>
                  <th className="pb-2 font-medium text-zinc-500">Type</th>
                  <th className="pb-2 font-medium text-zinc-500 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {trends.map((t, i) => (
                  <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-2">{t.month}</td>
                    <td className="py-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-2 text-right font-mono">{formatCurrency(t.total, 'PHP')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
