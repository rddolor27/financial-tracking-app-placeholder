import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from './theme-provider';

let mockThemeMode = 'light';

jest.mock('@financial-tracker/store', () => ({
  useAppStore: (selector: (s: { themeMode: string }) => unknown) =>
    selector({ themeMode: mockThemeMode }),
}));

describe('ThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    mockThemeMode = 'light';
  });

  it('should not add dark class in light mode', () => {
    mockThemeMode = 'light';
    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>,
    );
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should add dark class in dark mode', () => {
    mockThemeMode = 'dark';
    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>,
    );
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should render children', () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Child Content</div>
      </ThemeProvider>,
    );
    expect(getByText('Child Content')).toBeTruthy();
  });
});
