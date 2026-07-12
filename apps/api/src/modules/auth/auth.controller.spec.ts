import type { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { ACCESS_COOKIE, REFRESH_COOKIE } from './cookie.util';

const result = {
  access_token: 'access-1',
  refresh_token: 'refresh-1',
  user: { id: 'u1', email: 'a@b.com' },
};

function mockRes() {
  return {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    redirect: jest.fn(),
  } as unknown as Response & {
    cookie: jest.Mock;
    clearCookie: jest.Mock;
    redirect: jest.Mock;
  };
}

describe('AuthController (httpOnly cookies)', () => {
  const authService = {
    register: jest.fn().mockResolvedValue(result),
    login: jest.fn().mockResolvedValue(result),
    refreshTokens: jest.fn().mockResolvedValue(result),
    logout: jest.fn().mockResolvedValue(undefined),
    validateGoogleUser: jest.fn().mockResolvedValue(result),
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controller = new AuthController(authService as any);

  beforeEach(() => jest.clearAllMocks());

  it('sets both auth cookies on login', async () => {
    const res = mockRes();
    const out = await controller.login({ email: 'a@b.com', password: 'x' } as never, res);
    expect(out).toBe(result);
    expect(res.cookie).toHaveBeenCalledWith(ACCESS_COOKIE, 'access-1', expect.objectContaining({ httpOnly: true }));
    expect(res.cookie).toHaveBeenCalledWith(REFRESH_COOKIE, 'refresh-1', expect.objectContaining({ httpOnly: true }));
  });

  it('sets both auth cookies on register', async () => {
    const res = mockRes();
    await controller.register({ email: 'a@b.com' } as never, res);
    expect(res.cookie).toHaveBeenCalledTimes(2);
  });

  it('reads the refresh token from the cookie when the body is empty', async () => {
    const res = mockRes();
    const req = { headers: { cookie: `${REFRESH_COOKIE}=cookie-refresh` } } as Request;
    await controller.refresh({}, req, res);
    expect(authService.refreshTokens).toHaveBeenCalledWith('cookie-refresh');
    expect(res.cookie).toHaveBeenCalledTimes(2);
  });

  it('prefers the body refresh token over the cookie (mobile)', async () => {
    const res = mockRes();
    const req = { headers: { cookie: `${REFRESH_COOKIE}=cookie-refresh` } } as Request;
    await controller.refresh({ refresh_token: 'body-refresh' }, req, res);
    expect(authService.refreshTokens).toHaveBeenCalledWith('body-refresh');
  });

  it('clears cookies and revokes the token on logout', async () => {
    const res = mockRes();
    const req = { headers: { cookie: `${REFRESH_COOKIE}=cookie-refresh` } } as Request;
    await controller.logout({}, req, res);
    expect(authService.logout).toHaveBeenCalledWith('cookie-refresh');
    expect(res.clearCookie).toHaveBeenCalledTimes(2);
  });
});
