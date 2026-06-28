import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthGuard } from './auth-guard';

const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@financial-tracker/store', () => {
  let authenticated = false;
  return {
    useAuthStore: (selector: (s: { isAuthenticated: boolean }) => unknown) =>
      selector({ isAuthenticated: authenticated }),
    __setAuthenticated: (value: boolean) => { authenticated = value; },
  };
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { __setAuthenticated } = require('@financial-tracker/store');

describe('AuthGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to /login when not authenticated', () => {
    __setAuthenticated(false);
    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>,
    );
    expect(screen.queryByText('Protected Content')).toBeNull();
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  it('should render children when authenticated', () => {
    __setAuthenticated(true);
    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>,
    );
    expect(screen.getByText('Protected Content')).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
