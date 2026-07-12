import React from 'react';
import { render, screen } from '@testing-library/react';
import { TopBar } from './top-bar';

let mockPathname = '/accounts';
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

jest.mock('@financial-tracker/store', () => ({
  useAuthStore: (selector: (s: { user: { first_name: string } | null }) => unknown) =>
    selector({ user: { first_name: 'Jamie' } }),
}));

describe('TopBar', () => {
  it('shows the page title and subtitle for a known route', () => {
    mockPathname = '/accounts';
    render(<TopBar />);
    expect(screen.getByText('Accounts')).toBeTruthy();
    expect(screen.getByText('Manage your sources of funds')).toBeTruthy();
  });

  it('greets the user by first name on the dashboard', () => {
    mockPathname = '/dashboard';
    render(<TopBar />);
    expect(screen.getByText(/Jamie/)).toBeTruthy();
  });

  it('falls back to the dashboard meta for an unknown route', () => {
    mockPathname = '/totally-unknown';
    render(<TopBar />);
    // Unknown routes resolve to the dashboard greeting, not a crash.
    expect(screen.getByText(/Jamie/)).toBeTruthy();
  });
});
