import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthGuard } from './auth-guard';

const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const mockGet = jest.fn();
jest.mock('@/lib/api', () => ({
  apiClient: { get: (...args: unknown[]) => mockGet(...args) },
}));

jest.mock('@financial-tracker/store', () => {
  let authenticated = false;
  const useAuthStore = (selector: (s: { isAuthenticated: boolean }) => unknown) =>
    selector({ isAuthenticated: authenticated });
  useAuthStore.setState = jest.fn();
  return {
    useAuthStore,
    __setAuthenticated: (value: boolean) => {
      authenticated = value;
    },
  };
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { __setAuthenticated } = require('@financial-tracker/store');

describe('AuthGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to /login when the cookie probe fails', async () => {
    __setAuthenticated(false);
    mockGet.mockRejectedValueOnce(new Error('401'));

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>,
    );

    // While probing, protected content is hidden.
    expect(screen.queryByText('Protected Content')).toBeNull();
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'));
  });

  it('renders children when already authenticated (no probe)', () => {
    __setAuthenticated(true);
    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>,
    );
    expect(screen.getByText('Protected Content')).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockGet).not.toHaveBeenCalled();
  });
});
