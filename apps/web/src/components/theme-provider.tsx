'use client';

import { useEffect } from 'react';
import { useAppStore } from '@financial-tracker/store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = useAppStore((s) => s.themeMode);

  useEffect(() => {
    const root = document.documentElement;

    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const apply = (e: MediaQueryList | MediaQueryListEvent) => {
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      apply(mq);
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [themeMode]);

  return <>{children}</>;
}
