import { createStore, useStore } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'system';

interface AppState {
  themeMode: ThemeMode;
  sidebarOpen: boolean;
  selectedDateRange: { start: string; end: string } | null;
  setThemeMode: (mode: ThemeMode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSelectedDateRange: (range: { start: string; end: string } | null) => void;
}

export const appStore = createStore<AppState>((set) => ({
  themeMode: 'system',
  sidebarOpen: true,
  selectedDateRange: null,
  setThemeMode: (mode) => set({ themeMode: mode }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSelectedDateRange: (range) => set({ selectedDateRange: range }),
}));

export function useAppStore(): AppState;
export function useAppStore<T>(selector: (state: AppState) => T): T;
export function useAppStore<T>(selector?: (state: AppState) => T) {
  return useStore(appStore, selector as (state: AppState) => T);
}

useAppStore.getState = appStore.getState;
useAppStore.setState = appStore.setState;
useAppStore.subscribe = appStore.subscribe;
