// Minimal React Native mock for unit tests
export const Platform = { OS: 'ios', select: (obj: Record<string, unknown>) => obj.ios };
export const StyleSheet = { create: <T extends Record<string, unknown>>(styles: T) => styles };
export const useColorScheme = () => 'light';
export const Alert = { alert: jest.fn() };
