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
    expect(colors.background).toBe('#f5f5f5');
    expect(colors.text).toBe('#18181b');
  });

  it('should return dark colors when themeMode is dark', () => {
    mockThemeMode = 'dark';
    mockSystemScheme = 'light';
    const { isDark, colors } = useThemeColors();
    expect(isDark).toBe(true);
    expect(colors.background).toBe('#18181b');
    expect(colors.text).toBe('#f4f4f5');
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

  it('should have consistent primary, danger, and success colors', () => {
    mockThemeMode = 'light';
    const { colors: lightColors } = useThemeColors();
    mockThemeMode = 'dark';
    const { colors: darkColors } = useThemeColors();
    expect(lightColors.primary).toBe(darkColors.primary);
    expect(lightColors.danger).toBe(darkColors.danger);
    expect(lightColors.success).toBe(darkColors.success);
  });
});
