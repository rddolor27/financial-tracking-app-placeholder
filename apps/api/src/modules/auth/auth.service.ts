import { randomUUID } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import type { UsersService } from '../users/users.service';
import { InjectUsersService } from '../users/users.providers';
import { RefreshToken } from './refresh-token.entity';
import { User } from '../users/user.entity';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

export interface AuthResult {
  access_token: string;
  refresh_token: string;
  user: User;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectUsersService() private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.create({
      email: dto.email,
      password_hash: passwordHash,
      first_name: dto.first_name,
      last_name: dto.last_name,
      auth_provider: 'email',
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refreshTokens(token: string): Promise<AuthResult> {
    let payload: { sub: string; jti: string };
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const storedToken = await this.refreshTokenRepo.findOne({
      where: { id: payload.jti },
    });

    if (!storedToken || storedToken.is_revoked) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    if (storedToken.expires_at < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const isValid = await bcrypt.compare(token, storedToken.token_hash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Revoke old token (rotation)
    await this.refreshTokenRepo.update(storedToken.id, { is_revoked: true });

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateTokens(user);
  }

  async logout(token: string): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      await this.refreshTokenRepo.update(payload.jti, { is_revoked: true });
    } catch {
      // Silently ignore invalid tokens on logout
    }
  }

  async validateGoogleUser(profile: {
    email: string;
    google_id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  }): Promise<AuthResult> {
    let user = await this.usersService.findByGoogleId(profile.google_id);

    if (!user) {
      // Check if email exists (link accounts)
      user = await this.usersService.findByEmail(profile.email);
      if (user) {
        user = await this.usersService.update(user.id, {
          google_id: profile.google_id,
          auth_provider: 'both',
          avatar_url: profile.avatar_url || user.avatar_url,
        });
      } else {
        user = await this.usersService.create({
          email: profile.email,
          google_id: profile.google_id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url,
          auth_provider: 'google',
        });
      }
    }

    return this.generateTokens(user);
  }

  private async generateTokens(user: User): Promise<AuthResult> {
    const tokenId = randomUUID();

    const accessExpiry = this.configService.get<string>('JWT_ACCESS_EXPIRY') ?? '15m';
    const refreshExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRY') ?? '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: accessExpiry as `${number}${'s' | 'm' | 'h' | 'd'}`,
        },
      ),
      this.jwtService.signAsync(
        { sub: user.id, jti: tokenId },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: refreshExpiry as `${number}${'s' | 'm' | 'h' | 'd'}`,
        },
      ),
    ]);

    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepo.save(
      this.refreshTokenRepo.create({
        id: tokenId,
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      }),
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }
}
