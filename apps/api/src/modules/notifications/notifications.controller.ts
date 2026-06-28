import {
  Controller, Get, Post, Patch, Param,
  UseGuards, Req, HttpCode, HttpStatus,
} from '@nestjs/common';
import type { NotificationsService } from './notifications.service';
import { InjectNotificationsService } from './notifications.providers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationModel } from './models/notification.model';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    @InjectNotificationsService() private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  async findAll(@Req() req: { user: { id: string } }): Promise<NotificationModel[]> {
    return this.notificationsService.findAllByUser(req.user.id);
  }

  @Get('unread')
  async findUnread(@Req() req: { user: { id: string } }): Promise<NotificationModel[]> {
    return this.notificationsService.findUnreadByUser(req.user.id);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: { user: { id: string } }): Promise<NotificationModel> {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Post('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead(@Req() req: { user: { id: string } }): Promise<void> {
    await this.notificationsService.markAllAsRead(req.user.id);
  }
}
