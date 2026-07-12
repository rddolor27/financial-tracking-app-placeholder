import { useColorScheme } from 'react-native';
import { useAppStore } from '@financial-tracker/store';

export interface ThemeColors {
  /** App background (near-black on dark) */
  background: string;
  /** Deepest backdrop behind cards / status bar */
  backdrop: string;
  /** Card / surface */
  card: string;
  /** Card borders */
  border: string;
  /** Subtle row dividers */
  border2: string;
  /** Primary text */
  text: string;
  /** Secondary label text */
  textSecondary: string;
  /** Faint meta text */
  faint: string;
  /** Brand / accent (blue) */
  primary: string;
  /** Lighter primary for active text/links */
  primaryLight: string;
  /** Primary tint (chips, icon backgrounds) */
  primaryTint: string;
  /** Positive / gain */
  success: string;
  successLight: string;
  successTint: string;
  /** Negative */
  danger: string;
  dangerTint: string;
  /** Warning */
  amber: string;
  amberTint: string;
  /** Support accent */
  support: string;
  /** Hero gradient stops (deep-blue balance/portfolio cards) */
  heroFrom: string;
  heroTo: string;
}

const dark: ThemeColors = {
  background: '#0a080f',
  backdrop: '#000000',
  card: '#141019',
  border: '#241f2e',
  border2: '#1b1822',
  text: '#ece9f6',
  textSecondary: '#a49dc0',
  faint: '#6f6890',
  primary: '#3b82f6',
  primaryLight: '#93c0ff',
  primaryTint: 'rgba(59,130,246,0.16)',
  success: '#34d399',
  successLight: '#4ade9f',
  successTint: 'rgba(16,185,129,0.16)',
  danger: '#ff6b6f',
  dangerTint: 'rgba(229,72,77,0.16)',
  amber: '#f5b23f',
  amberTint: 'rgba(245,165,36,0.16)',
  support: '#818cf8',
  heroFrom: '#0d1a3a',
  heroTo: '#0a1530',
};

const light: ThemeColors = {
  background: '#f6f7fb',
  backdrop: '#eceef4',
  card: '#ffffff',
  border: '#e6e8ef',
  border2: '#eef0f6',
  text: '#1a1725',
  textSecondary: '#5c5872',
  faint: '#8b86a3',
  primary: '#3b82f6',
  primaryLight: '#2563eb',
  primaryTint: 'rgba(59,130,246,0.10)',
  success: '#059669',
  successLight: '#059669',
  successTint: 'rgba(16,185,129,0.12)',
  danger: '#e5484d',
  dangerTint: 'rgba(229,72,77,0.10)',
  amber: '#b7791f',
  amberTint: 'rgba(245,165,36,0.14)',
  support: '#6366f1',
  heroFrom: '#0d1a3a',
  heroTo: '#0a1530',
};

export function useThemeColors() {
  const themeMode = useAppStore((s) => s.themeMode);
  const systemScheme = useColorScheme();

  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');

  return { isDark, colors: isDark ? dark : light };
}
