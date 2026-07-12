import { useAppStore } from './use-app-store';

describe('useAppStore', () => {
  it('should default to dark theme', () => {
    expect(useAppStore.getState().themeMode).toBe('dark');
  });

  it('should toggle sidebar', () => {
    const initial = useAppStore.getState().sidebarOpen;
    useAppStore.getState().toggleSidebar();
    expect(useAppStore.getState().sidebarOpen).toBe(!initial);
  });

  it('should set theme mode', () => {
    useAppStore.getState().setThemeMode('dark');
    expect(useAppStore.getState().themeMode).toBe('dark');
  });

  it('should set date range', () => {
    useAppStore.getState().setSelectedDateRange({
      start: '2026-06-01',
      end: '2026-06-30',
    });
    expect(useAppStore.getState().selectedDateRange).toEqual({
      start: '2026-06-01',
      end: '2026-06-30',
    });
  });
});
