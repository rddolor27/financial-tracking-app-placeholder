'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogout } from '@/lib/auth-hooks';
import { useAuthStore } from '@financial-tracker/store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/accounts', label: 'Accounts' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/budgets', label: 'Budgets' },
  { href: '/categories', label: 'Categories' },
  { href: '/investments', label: 'Investments' },
  { href: '/goals', label: 'Goals' },
  { href: '/bills', label: 'Bill Reminders' },
  { href: '/insights', label: 'Insights' },
];

export function Sidebar() {
  const pathname = usePathname();
  const logoutMutation = useLogout();
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col min-h-screen">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-bold">Financial Tracker</h2>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        {user && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2 truncate">
            {user.first_name} {user.last_name}
          </p>
        )}
        <button
          onClick={() => logoutMutation.mutate()}
          className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
