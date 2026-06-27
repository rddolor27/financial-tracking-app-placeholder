'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@financial-tracker/store';
import {
  useAccounts,
  useTransactions,
  useIncomeVsExpense,
  useGoals,
  useBillReminders,
} from '@/lib/crud-hooks';
import { formatCurrency } from '@financial-tracker/shared-utils';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const monthEnd = now.toISOString().split('T')[0];

  const { data: accountsData } = useAccounts();
  const { data: txData } = useTransactions({ limit: 5 });
  const { data: incomeExpense } = useIncomeVsExpense(monthStart, monthEnd);
  const { data: goals } = useGoals();
  const { data: bills } = useBillReminders();

  const accounts = useMemo(() => accountsData?.data ?? [], [accountsData]);
  const recentTransactions = txData?.data ?? [];
  const goalsList = goals ?? [];
  const billsList = bills ?? [];

  const totalBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + Number(a.balance), 0),
    [accounts],
  );

  const activeGoals = goalsList.filter((g) => !g.is_completed);
  const upcomingBills = billsList.filter((b) => b.is_active).slice(0, 3);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Welcome{user ? `, ${user.first_name}` : ''}
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Balance</h3>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totalBalance, 'PHP')}</p>
          <p className="text-xs text-zinc-400 mt-1">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Monthly Income</h3>
          <p className="text-2xl font-bold mt-1 text-green-600">
            {incomeExpense ? formatCurrency(incomeExpense.income, 'PHP') : '--'}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Monthly Expenses</h3>
          <p className="text-2xl font-bold mt-1 text-red-600">
            {incomeExpense ? formatCurrency(incomeExpense.expense, 'PHP') : '--'}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Net This Month</h3>
          <p className={`text-2xl font-bold mt-1 ${incomeExpense && incomeExpense.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {incomeExpense ? formatCurrency(incomeExpense.net, 'PHP') : '--'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-zinc-500">No transactions yet.</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{tx.description || 'No description'}</p>
                    <p className="text-xs text-zinc-500">{tx.date}</p>
                  </div>
                  <p className={`text-sm font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(Number(tx.amount), 'PHP')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Goals & Bills */}
        <div className="space-y-6">
          {/* Active Goals */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold mb-4">Active Goals</h2>
            {activeGoals.length === 0 ? (
              <p className="text-sm text-zinc-500">No active goals.</p>
            ) : (
              <div className="space-y-3">
                {activeGoals.slice(0, 3).map((goal) => {
                  const progress = goal.target_amount > 0
                    ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
                    : 0;
                  return (
                    <div key={goal.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{goal.name}</span>
                        <span className="text-zinc-500">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${progress}%`, backgroundColor: goal.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Bills */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold mb-4">Upcoming Bills</h2>
            {upcomingBills.length === 0 ? (
              <p className="text-sm text-zinc-500">No upcoming bills.</p>
            ) : (
              <div className="space-y-3">
                {upcomingBills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{bill.name}</p>
                      <p className="text-xs text-zinc-500">Due day {bill.due_day} &middot; {bill.frequency}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatCurrency(bill.amount, bill.currency)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
