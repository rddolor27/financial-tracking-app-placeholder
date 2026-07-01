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
import { InjectUsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { UserModel } from './models/user.model';

@Controller('users')
export class UsersController {
  constructor(
    @InjectUsersService() private readonly usersService: UsersService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: { user: { id: string } }): Promise<UserModel> {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: { user: { id: string } },
    @Body()
    body: UpdateUserDto,
  ): Promise<UserModel> {
    return this.usersService.update(req.user.id, body);
  }

  @Post('me/password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: { user: { id: string } },
    @Body() body: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.usersService.changePassword(req.user.id, body.current_password, body.new_password);
    return { message: 'Password changed successfully' };
  }
}
