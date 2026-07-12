import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import type { AuthService } from './auth.service';
import { InjectAuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import {
  REFRESH_COOKIE,
  clearAuthCookies,
  parseCookies,
  setAuthCookies,
} from './cookie.util';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectAuthService() private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(body);
    setAuthCookies(res, result.access_token, result.refresh_token);
    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);
    setAuthCookies(res, result.access_token, result.refresh_token);
    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() body: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token =
      body?.refresh_token || parseCookies(req.headers.cookie)[REFRESH_COOKIE];
    const result = await this.authService.refreshTokens(token ?? '');
    setAuthCookies(res, result.access_token, result.refresh_token);
    return result;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Body() body: { refresh_token?: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token =
      body?.refresh_token || parseCookies(req.headers.cookie)[REFRESH_COOKIE];
    if (token) {
      await this.authService.logout(token);
    }
    clearAuthCookies(res);
    return { message: 'Logged out successfully' };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Redirect to Google handled by Passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req()
    req: {
      user: {
        email: string;
        google_id: string;
        first_name: string;
        last_name: string;
        avatar_url?: string;
      };
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.validateGoogleUser(req.user);
    setAuthCookies(res, result.access_token, result.refresh_token);
    const webOrigin = process.env.WEB_ORIGIN ?? 'http://localhost:3000';
    res.redirect(`${webOrigin}/dashboard`);
  }
}
