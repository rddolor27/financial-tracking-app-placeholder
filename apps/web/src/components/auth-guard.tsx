'use client';

import { useAuthStore } from '@financial-tracker/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { apiClient } from '@/lib/api';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) return;

    // Not authenticated in memory — probe the httpOnly cookie. Success restores
    // the session (external store update → re-render), failure redirects.
    let cancelled = false;
    (async () => {
      try {
        const response = await apiClient.get('/users/me');
        if (!cancelled) {
          useAuthStore.setState({ user: response.data, isAuthenticated: true });
        }
      } catch {
        if (!cancelled) router.replace('/login');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-canvas">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
