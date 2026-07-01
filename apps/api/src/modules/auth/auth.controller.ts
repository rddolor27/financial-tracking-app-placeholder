import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { AuthService } from './auth.service';
import { InjectAuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectAuthService() private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body()
    body: RegisterDto,
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body()
    body: LoginDto,
  ) {
    return this.authService.login(body);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body()
    body: RefreshTokenDto,
  ) {
    return this.authService.refreshTokens(body.refresh_token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body: { refresh_token: string }) {
    await this.authService.logout(body.refresh_token);
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
  ) {
    return this.authService.validateGoogleUser(req.user);
  }
}
