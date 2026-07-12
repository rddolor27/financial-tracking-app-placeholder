import React from 'react';
import { render, screen } from '@testing-library/react';
import { Sidebar } from './sidebar';

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('@/lib/auth-hooks', () => ({
  useLogout: () => ({ mutate: jest.fn() }),
}));

jest.mock('@financial-tracker/store', () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      user: { first_name: 'John', last_name: 'Doe', email: 'john@test.com' },
      isAuthenticated: true,
    }),
  useAppStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      themeMode: 'light',
      setThemeMode: jest.fn(),
    }),
}));

describe('Sidebar', () => {
  it('should render all navigation links', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Accounts')).toBeTruthy();
    expect(screen.getByText('Transactions')).toBeTruthy();
    expect(screen.getByText('Budgets')).toBeTruthy();
    expect(screen.getByText('Categories')).toBeTruthy();
    expect(screen.getByText('Investments')).toBeTruthy();
    expect(screen.getByText('Goals')).toBeTruthy();
    expect(screen.getByText('Bills')).toBeTruthy();
    expect(screen.getByText('Insights')).toBeTruthy();
    expect(screen.getByText('Export')).toBeTruthy();
    expect(screen.getByText('Import CSV')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('should display user name', () => {
    render(<Sidebar />);
    expect(screen.getByText('John Doe')).toBeTruthy();
  });

  it('should render Sign Out button', () => {
    render(<Sidebar />);
    expect(screen.getByTitle('Sign out')).toBeTruthy();
  });

  it('should render theme toggle', () => {
    render(<Sidebar />);
    expect(screen.getByTitle('Theme: Light')).toBeTruthy();
  });
});
