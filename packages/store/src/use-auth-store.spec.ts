import { useAuthStore } from './use-auth-store';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('should start unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });

  it('should set tokens and user on login', () => {
    const user = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
      auth_provider: 'email' as const,
      first_name: 'John',
      last_name: 'Doe',
      avatar_url: null,
      currency: 'PHP',
      created_at: '2026-06-28T12:00:00.000Z',
      updated_at: '2026-06-28T12:00:00.000Z',
    };

    useAuthStore.getState().setAuth({
      access_token: 'access-token',
      refresh_token: 'refresh-token',
      user,
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('test@example.com');
    expect(state.accessToken).toBe('access-token');
    expect(state.refreshToken).toBe('refresh-token');
  });

  it('should clear state on logout', () => {
    useAuthStore.getState().setAuth({
      access_token: 'token',
      refresh_token: 'refresh',
      user: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        auth_provider: 'email' as const,
        first_name: 'John',
        last_name: 'Doe',
        avatar_url: null,
        currency: 'PHP',
        created_at: '2026-06-28T12:00:00.000Z',
        updated_at: '2026-06-28T12:00:00.000Z',
      },
    });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });

  it('should update tokens', () => {
    useAuthStore.getState().setTokens('new-access', 'new-refresh');
    const state = useAuthStore.getState();
    expect(state.accessToken).toBe('new-access');
    expect(state.refreshToken).toBe('new-refresh');
  });
});
