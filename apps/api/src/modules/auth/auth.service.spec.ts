import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { AUTH_SERVICE } from './auth.constants';
import { AuthProvider } from './auth.providers';
import { USERS_SERVICE } from '../users/users.constants';
import { RefreshToken } from './refresh-token.entity';
import type { User } from '../users/user.entity';

jest.mock('bcrypt');

const mockUsersService = () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findByGoogleId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

const mockJwtService = () => ({
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
});

const mockConfigService = () => ({
  get: jest.fn((key: string) => {
    const config: Record<string, string> = {
      JWT_ACCESS_SECRET: 'access-secret',
      JWT_REFRESH_SECRET: 'refresh-secret',
      JWT_ACCESS_EXPIRY: '15m',
      JWT_REFRESH_EXPIRY: '7d',
    };
    return config[key];
  }),
});

const mockRefreshTokenRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: ReturnType<typeof mockUsersService>;
  let jwtService: ReturnType<typeof mockJwtService>;
  let refreshTokenRepo: ReturnType<typeof mockRefreshTokenRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthProvider,
        { provide: USERS_SERVICE, useFactory: mockUsersService },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: ConfigService, useFactory: mockConfigService },
        {
          provide: getRepositoryToken(RefreshToken),
          useFactory: mockRefreshTokenRepo,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AUTH_SERVICE);
    usersService = module.get(USERS_SERVICE);
    jwtService = module.get(JwtService);
    refreshTokenRepo = module.get(getRepositoryToken(RefreshToken));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash password, create user, and return tokens', async () => {
      const dto = {
        email: 'new@test.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
      };
      const user = {
        id: 'user-1',
        email: dto.email,
        first_name: dto.first_name,
        last_name: dto.last_name,
        auth_provider: 'email',
      } as User;

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      usersService.create.mockResolvedValue(user);
      jwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed-password').mockResolvedValueOnce('hashed-refresh-token');
      refreshTokenRepo.create.mockReturnValue({} as RefreshToken);
      refreshTokenRepo.save.mockResolvedValue({} as RefreshToken);

      const result = await service.register(dto);

      expect(result.access_token).toBe('access-token');
      expect(result.refresh_token).toBe('refresh-token');
      expect(result.user.id).toBe('user-1');
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(usersService.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const user = {
        id: 'user-1',
        email: 'test@test.com',
        password_hash: 'hashed',
        auth_provider: 'email',
      } as User;

      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-refresh');
      refreshTokenRepo.create.mockReturnValue({} as RefreshToken);
      refreshTokenRepo.save.mockResolvedValue({} as RefreshToken);

      const result = await service.login({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(result.access_token).toBe('access-token');
      expect(result.user.id).toBe('user-1');
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'no@test.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const user = {
        id: 'user-1',
        email: 'test@test.com',
        password_hash: 'hashed',
      } as User;
      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens for valid refresh token', async () => {
      const user = { id: 'user-1', email: 'test@test.com' } as User;
      const storedToken = {
        id: 'rt-1',
        user_id: 'user-1',
        token_hash: 'hashed',
        is_revoked: false,
        expires_at: new Date(Date.now() + 86400000),
      } as RefreshToken;

      jwtService.verifyAsync.mockResolvedValue({ sub: 'user-1', jti: 'rt-1' });
      refreshTokenRepo.findOne.mockResolvedValue(storedToken);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      usersService.findById.mockResolvedValue(user);
      refreshTokenRepo.update.mockResolvedValue({});
      jwtService.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-refresh');
      refreshTokenRepo.create.mockReturnValue({} as RefreshToken);
      refreshTokenRepo.save.mockResolvedValue({} as RefreshToken);

      const result = await service.refreshTokens('old-refresh-token');

      expect(result.access_token).toBe('new-access-token');
      expect(result.refresh_token).toBe('new-refresh-token');
    });

    it('should throw UnauthorizedException for revoked token', async () => {
      const storedToken = {
        id: 'rt-1',
        user_id: 'user-1',
        token_hash: 'hashed',
        is_revoked: true,
        expires_at: new Date(Date.now() + 86400000),
      } as RefreshToken;

      jwtService.verifyAsync.mockResolvedValue({ sub: 'user-1', jti: 'rt-1' });
      refreshTokenRepo.findOne.mockResolvedValue(storedToken);

      await expect(
        service.refreshTokens('revoked-token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should revoke the refresh token', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: 'user-1', jti: 'rt-1' });
      refreshTokenRepo.update.mockResolvedValue({});

      await service.logout('some-refresh-token');

      expect(refreshTokenRepo.update).toHaveBeenCalledWith('rt-1', {
        is_revoked: true,
      });
    });
  });
});
