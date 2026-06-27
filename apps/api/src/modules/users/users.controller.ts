import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { UpdateUserSchema } from '@financial-tracker/shared-types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    body: { first_name?: string; last_name?: string; currency?: string },
  ) {
    const user = await this.usersService.update(req.user.id, body);
    const { password_hash: _ph, google_id: _gid, ...profile } = user;
    return profile;
  }
}
