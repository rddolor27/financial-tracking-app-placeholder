import { useColorScheme } from 'react-native';
import { useAppStore } from '@financial-tracker/store';

export function useThemeColors() {
  const themeMode = useAppStore((s) => s.themeMode);
  const systemScheme = useColorScheme();

  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');

  return {
    isDark,
    colors: {
      background: isDark ? '#18181b' : '#f5f5f5',
      card: isDark ? '#27272a' : '#ffffff',
      text: isDark ? '#f4f4f5' : '#18181b',
      textSecondary: isDark ? '#a1a1aa' : '#666666',
      border: isDark ? '#3f3f46' : '#e5e5e5',
      primary: '#2563EB',
      danger: '#EF4444',
      success: '#22C55E',
    },
  };
}
