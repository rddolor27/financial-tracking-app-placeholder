import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsProvider } from './notifications.service';
import { NOTIFICATIONS_SERVICE } from './notifications.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationsController],
  providers: [NotificationsProvider],
  exports: [NOTIFICATIONS_SERVICE],
})
export class NotificationsModule {}
