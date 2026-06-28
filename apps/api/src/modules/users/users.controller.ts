import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { UsersService } from './users.service';
import { InjectUsersService } from './users.providers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { type UpdateUserDto, UpdateUserSchema } from './dtos';

@Controller('users')
export class UsersController {
  constructor(
    @InjectUsersService() private readonly usersService: UsersService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: { user: { id: string } }) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      return null;
    }
    const { password_hash: _ph, google_id: _gid, ...profile } = user;
    return profile;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: { user: { id: string } },
    @Body(new ZodValidationPipe(UpdateUserSchema))
    body: UpdateUserDto,
  ) {
    const user = await this.usersService.update(req.user.id, body);
    const { password_hash: _ph, google_id: _gid, ...profile } = user;
    return profile;
  }

  @Post('me/password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: { user: { id: string } },
    @Body() body: { current_password: string; new_password: string },
  ) {
    await this.usersService.changePassword(req.user.id, body.current_password, body.new_password);
    return { message: 'Password changed successfully' };
  }
}
