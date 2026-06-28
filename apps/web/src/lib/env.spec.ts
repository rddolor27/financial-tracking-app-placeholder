/* eslint-disable @typescript-eslint/no-require-imports */
describe('env validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use default API URL when env var is not set', () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    const { env } = require('./env');
    expect(env.NEXT_PUBLIC_API_URL).toBe('http://localhost:3001');
  });

  it('should use provided API URL when env var is set', () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
    const { env } = require('./env');
    expect(env.NEXT_PUBLIC_API_URL).toBe('https://api.example.com');
  });

  it('should throw on invalid URL', () => {
    process.env.NEXT_PUBLIC_API_URL = 'not-a-url';
    expect(() => require('./env')).toThrow();
  });
});
