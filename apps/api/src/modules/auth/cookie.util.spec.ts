import type { Response } from 'express';
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  clearAuthCookies,
  parseCookies,
  setAuthCookies,
} from './cookie.util';

describe('parseCookies', () => {
  it('returns an empty object for undefined/empty headers', () => {
    expect(parseCookies(undefined)).toEqual({});
    expect(parseCookies('')).toEqual({});
  });

  it('parses a single cookie', () => {
    expect(parseCookies('access_token=abc')).toEqual({ access_token: 'abc' });
  });

  it('parses multiple cookies and trims whitespace', () => {
    expect(parseCookies('access_token=abc; refresh_token=def')).toEqual({
      access_token: 'abc',
      refresh_token: 'def',
    });
  });

  it('url-decodes values', () => {
    expect(parseCookies('t=a%20b')).toEqual({ t: 'a b' });
  });

  it('ignores malformed segments without an =', () => {
    expect(parseCookies('garbage; access_token=abc')).toEqual({ access_token: 'abc' });
  });
});

describe('setAuthCookies / clearAuthCookies', () => {
  it('sets httpOnly access and refresh cookies', () => {
    const cookie = jest.fn();
    setAuthCookies({ cookie } as unknown as Response, 'a-token', 'r-token');

    expect(cookie).toHaveBeenCalledTimes(2);
    const [accessName, accessValue, accessOpts] = cookie.mock.calls[0];
    expect(accessName).toBe(ACCESS_COOKIE);
    expect(accessValue).toBe('a-token');
    expect(accessOpts).toMatchObject({ httpOnly: true, sameSite: 'lax', path: '/' });

    const [refreshName, refreshValue] = cookie.mock.calls[1];
    expect(refreshName).toBe(REFRESH_COOKIE);
    expect(refreshValue).toBe('r-token');
  });

  it('clears both auth cookies', () => {
    const clearCookie = jest.fn();
    clearAuthCookies({ clearCookie } as unknown as Response);

    expect(clearCookie).toHaveBeenCalledTimes(2);
    expect(clearCookie.mock.calls[0][0]).toBe(ACCESS_COOKIE);
    expect(clearCookie.mock.calls[1][0]).toBe(REFRESH_COOKIE);
  });
});
