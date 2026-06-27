'use client';

import { useAuthStore } from '@financial-tracker/store';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Welcome{user ? `, ${user.first_name}` : ''}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Balance</h3>
          <p className="text-2xl font-bold mt-1">--</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Monthly Income</h3>
          <p className="text-2xl font-bold mt-1 text-green-600">--</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Monthly Expenses</h3>
          <p className="text-2xl font-bold mt-1 text-red-600">--</p>
        </div>
      </div>
    </div>
  );
}
