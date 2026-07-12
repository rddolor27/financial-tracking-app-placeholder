import type { CookieOptions, Response } from 'express';

const isProd = process.env.NODE_ENV === 'production';

/** 7 days — matches the refresh-token lifetime. */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';

/** httpOnly so JS can't read the token; sameSite=lax for standard web flows. */
const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax',
  path: '/',
};

/** Minimal cookie-header parser (avoids a cookie-parser dependency). */
export function parseCookies(header?: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    if (!key) continue;
    out[key] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
): void {
  res.cookie(ACCESS_COOKIE, accessToken, { ...baseCookieOptions, maxAge: MAX_AGE_MS });
  res.cookie(REFRESH_COOKIE, refreshToken, { ...baseCookieOptions, maxAge: MAX_AGE_MS });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_COOKIE, baseCookieOptions);
  res.clearCookie(REFRESH_COOKIE, baseCookieOptions);
}
