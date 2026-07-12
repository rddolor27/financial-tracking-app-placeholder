let mockThemeMode = 'light';
let mockSystemScheme: string | null = 'light';

jest.mock('@financial-tracker/store', () => ({
  useAppStore: (selector: (s: { themeMode: string }) => unknown) =>
    selector({ themeMode: mockThemeMode }),
}));

jest.mock('react-native', () => ({
  useColorScheme: () => mockSystemScheme,
}));

import { useThemeColors } from './use-theme';

describe('useThemeColors', () => {
  it('should return light colors when themeMode is light', () => {
    mockThemeMode = 'light';
    mockSystemScheme = 'light';
    const { isDark, colors } = useThemeColors();
    expect(isDark).toBe(false);
    expect(colors.background).toBe('#f6f7fb');
    expect(colors.text).toBe('#1a1725');
  });

  it('should return dark colors when themeMode is dark', () => {
    mockThemeMode = 'dark';
    mockSystemScheme = 'light';
    const { isDark, colors } = useThemeColors();
    expect(isDark).toBe(true);
    expect(colors.background).toBe('#0a080f');
    expect(colors.text).toBe('#ece9f6');
  });

  it('should follow system scheme when themeMode is system', () => {
    mockThemeMode = 'system';
    mockSystemScheme = 'dark';
    const { isDark } = useThemeColors();
    expect(isDark).toBe(true);
  });

  it('should be light when system is light and themeMode is system', () => {
    mockThemeMode = 'system';
    mockSystemScheme = 'light';
    const { isDark } = useThemeColors();
    expect(isDark).toBe(false);
  });

  it('keeps the brand primary consistent across themes and defines gain/loss per theme', () => {
    mockThemeMode = 'light';
    const { colors: lightColors } = useThemeColors();
    mockThemeMode = 'dark';
    const { colors: darkColors } = useThemeColors();
    // Brand accent is the same blue in both themes.
    expect(lightColors.primary).toBe(darkColors.primary);
    // Positive/negative hues are tuned per theme for contrast, so both are defined.
    expect(lightColors.success).toBeTruthy();
    expect(darkColors.success).toBeTruthy();
    expect(lightColors.danger).toBeTruthy();
    expect(darkColors.danger).toBeTruthy();
  });
});
