'use client';

import { useAuthStore } from '@financial-tracker/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  // While we probe the httpOnly cookie via /users/me we must not redirect.
  const [checking, setChecking] = useState(!isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      setChecking(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const response = await apiClient.get('/users/me');
        if (!cancelled) {
          useAuthStore.setState({ user: response.data, isAuthenticated: true });
        }
      } catch {
        if (!cancelled) router.replace('/login');
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
