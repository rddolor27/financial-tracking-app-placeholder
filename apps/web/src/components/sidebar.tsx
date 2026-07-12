'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import {
  FiGrid,
  FiRepeat,
  FiCreditCard,
  FiPieChart,
  FiTrendingUp,
  FiTarget,
  FiClock,
  FiBarChart2,
  FiFileText,
  FiTag,
  FiUpload,
  FiDownload,
  FiSettings,
  FiSun,
  FiMoon,
  FiMonitor,
  FiLogOut,
} from 'react-icons/fi';
import { useLogout } from '@/lib/auth-hooks';
import { useAuthStore, useAppStore } from '@financial-tracker/store';

type NavItem = { href: string; label: string; icon: IconType };

const primaryNav: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { href: '/transactions', label: 'Transactions', icon: FiRepeat },
  { href: '/accounts', label: 'Accounts', icon: FiCreditCard },
  { href: '/budgets', label: 'Budgets', icon: FiPieChart },
  { href: '/investments', label: 'Investments', icon: FiTrendingUp },
  { href: '/goals', label: 'Goals', icon: FiTarget },
  { href: '/bills', label: 'Bills', icon: FiClock },
  { href: '/insights', label: 'Insights', icon: FiBarChart2 },
  { href: '/statements', label: 'Statements', icon: FiFileText },
];

const secondaryNav: NavItem[] = [
  { href: '/categories', label: 'Categories', icon: FiTag },
  { href: '/import', label: 'Import CSV', icon: FiUpload },
  { href: '/export', label: 'Export', icon: FiDownload },
  { href: '/settings', label: 'Settings', icon: FiSettings },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-[11px] text-[13.5px] font-semibold transition-colors ${
        active
          ? 'text-primary-light'
          : 'text-muted hover:text-ink hover:bg-canvas'
      }`}
      style={
        active
          ? {
              background:
                'linear-gradient(100deg, var(--primary-tint), var(--green-tint))',
            }
          : undefined
      }
    >
      <Icon className="w-[18px] h-[18px] shrink-0" />
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const logoutMutation = useLogout();
  const user = useAuthStore((s) => s.user);
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);

  const cycleTheme = () => {
    const next =
      themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';
    setThemeMode(next);
  };

  const ThemeIcon =
    themeMode === 'light' ? FiSun : themeMode === 'dark' ? FiMoon : FiMonitor;
  const themeLabel =
    themeMode === 'light' ? 'Light' : themeMode === 'dark' ? 'Dark' : 'System';

  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() ||
      'U'
    : 'U';

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="w-[246px] shrink-0 bg-card border-r border-line flex flex-col p-[15px] pt-5 sticky top-0 h-screen overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-2 pb-[18px]">
        <div
          className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-white font-extrabold text-[17px]"
          style={{
            background: 'linear-gradient(145deg, var(--primary), var(--green))',
          }}
        >
          ₱
        </div>
        <b className="text-[16px] tracking-[-0.02em]">Fintrack</b>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-1">
        {primaryNav.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>

      <div className="h-px bg-line my-3" />

      {/* Secondary nav */}
      <nav className="flex flex-col gap-1">
        {secondaryNav.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>

      <div className="flex-1" />

      {/* Premium promo */}
      <div
        className="rounded-[15px] p-[15px] text-white mt-2"
        style={{
          background: 'linear-gradient(155deg, var(--primary), var(--green-d))',
        }}
      >
        <div className="font-bold text-[13px]">Upgrade to Premium</div>
        <div className="text-[11.5px] opacity-85 leading-relaxed mt-0.5">
          Investments, insights, PDF parsing &amp; more.
        </div>
        <Link
          href="/settings"
          className="block bg-white text-blue-600 font-bold text-[12px] text-center py-2 rounded-[9px] mt-[11px]"
        >
          Unlock — ₱149/mo
        </Link>
      </div>

      {/* User + controls */}
      <div className="flex items-center gap-2.5 pt-3">
        <div
          className="w-[31px] h-[31px] rounded-full flex items-center justify-center font-bold text-[12px] text-primary-light"
          style={{ background: 'var(--primary-tint)' }}
        >
          {initials}
        </div>
        <div className="leading-tight min-w-0 flex-1">
          <div className="font-semibold text-[12.5px] truncate">
            {user ? `${user.first_name} ${user.last_name}` : 'Guest'}
          </div>
          <div className="text-[11px] text-faint">Free plan</div>
        </div>
        <button
          onClick={cycleTheme}
          title={`Theme: ${themeLabel}`}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-ink hover:bg-canvas transition-colors"
        >
          <ThemeIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => logoutMutation.mutate()}
          title="Sign out"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-loss transition-colors"
        >
          <FiLogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
