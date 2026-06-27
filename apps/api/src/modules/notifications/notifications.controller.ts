import {
  Controller, Get, Post, Patch, Param,
  UseGuards, Req, HttpCode, HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Req() req: { user: { id: string } }) {
    return this.notificationsService.findAllByUser(req.user.id);
  }

  @Get('unread')
  async findUnread(@Req() req: { user: { id: string } }) {
    return this.notificationsService.findUnreadByUser(req.user.id);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Post('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead(@Req() req: { user: { id: string } }) {
    await this.notificationsService.markAllAsRead(req.user.id);
  }
}
