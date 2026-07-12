'use client';

import { usePathname } from 'next/navigation';
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';
import { useAuthStore } from '@financial-tracker/store';

const PAGE_META: Record<string, { title: string; sub: string }> = {
  '/dashboard': { title: 'Dashboard', sub: '' },
  '/transactions': { title: 'Transactions', sub: 'Search, filter & manage records' },
  '/accounts': { title: 'Accounts', sub: 'Manage your sources of funds' },
  '/budgets': { title: 'Budgets', sub: 'Track spending against limits' },
  '/investments': { title: 'Investments', sub: 'Portfolio & market data' },
  '/goals': { title: 'Goals', sub: 'Save toward what matters' },
  '/bills': { title: 'Bills', sub: 'Reminders & auto-transactions' },
  '/insights': { title: 'Insights', sub: 'Spending analytics' },
  '/statements': { title: 'Statements', sub: 'PDF import & parsing' },
  '/categories': { title: 'Categories', sub: 'Organize income & expenses' },
  '/import': { title: 'Import CSV', sub: 'Bring in transactions from a file' },
  '/export': { title: 'Export', sub: 'Download your data' },
  '/settings': { title: 'Settings', sub: 'Profile & preferences' },
};

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function TopBar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const key =
    Object.keys(PAGE_META).find(
      (k) => pathname === k || pathname.startsWith(`${k}/`),
    ) ?? '/dashboard';
  const meta = PAGE_META[key];

  const isDashboard = key === '/dashboard';
  const title = isDashboard
    ? `${greeting()}${user ? `, ${user.first_name}` : ''}`
    : meta.title;
  const sub = isDashboard
    ? new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : meta.sub;

  const monthLabel = new Date().toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex items-center gap-3.5 px-[30px] py-4 border-b border-line bg-card sticky top-0 z-10">
      <div className="min-w-0">
        <h1 className="text-[18px] font-extrabold tracking-[-0.02em] truncate">
          {title}
        </h1>
        {sub ? <div className="text-[12px] text-faint mt-0.5">{sub}</div> : null}
      </div>

      <div className="flex-1" />

      <div className="hidden md:flex items-center gap-2 bg-canvas border border-line rounded-[10px] px-3 py-2 w-[240px] text-faint text-[13px]">
        <FiSearch className="w-4 h-4 shrink-0" />
        <span>Search…</span>
      </div>

      <div className="pill">
        {monthLabel}
        <FiChevronDown className="w-3.5 h-3.5 text-faint" />
      </div>

      <button className="relative w-[38px] h-[38px] rounded-[10px] bg-card border border-line flex items-center justify-center text-ink">
        <FiBell className="w-4 h-4" />
        <span
          className="absolute top-2 right-2 w-[7px] h-[7px] rounded-full"
          style={{ background: 'var(--red)', border: '2px solid var(--card)' }}
        />
      </button>
    </div>
  );
}
