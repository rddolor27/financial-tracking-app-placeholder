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
import { InjectAuthService } from './auth.providers';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  type CreateUserDto,
  CreateUserSchema,
  type LoginDto,
  LoginSchema,
  type RefreshTokenDto,
  RefreshTokenRequestSchema,
} from './dtos';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectAuthService() private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(CreateUserSchema))
    body: CreateUserDto,
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(LoginSchema))
    body: LoginDto,
  ) {
    return this.authService.login(body);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body(new ZodValidationPipe(RefreshTokenRequestSchema))
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
