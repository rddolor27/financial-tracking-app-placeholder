import { Inject, Injectable, NotFoundException, type Provider } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { NotificationModel } from './models/notification.model';
import { NOTIFICATIONS_SERVICE } from './notifications.constants';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
  ) {}

  async findAllByUser(userId: string): Promise<NotificationModel[]> {
    const notifications = await this.notificationsRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: 50,
    });
    return notifications.map((entity) => NotificationModel.fromEntity(entity));
  }

  async findUnreadByUser(userId: string): Promise<NotificationModel[]> {
    const notifications = await this.notificationsRepo.find({
      where: { user_id: userId, is_read: false },
      order: { created_at: 'DESC' },
    });
    return notifications.map((entity) => NotificationModel.fromEntity(entity));
  }

  async create(userId: string, data: Partial<Notification>): Promise<NotificationModel> {
    const notification = this.notificationsRepo.create({ ...data, user_id: userId });
    const saved = await this.notificationsRepo.save(notification);
    return NotificationModel.fromEntity(saved);
  }

  async markAsRead(id: string, userId: string): Promise<NotificationModel> {
    const notification = await this.notificationsRepo.findOne({
      where: { id, user_id: userId },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    notification.is_read = true;
    const saved = await this.notificationsRepo.save(notification);
    return NotificationModel.fromEntity(saved);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepo.update(
      { user_id: userId, is_read: false },
      { is_read: true },
    );
  }
}

export const InjectNotificationsService = (): PropertyDecorator &
  ParameterDecorator => Inject(NOTIFICATIONS_SERVICE);

export const NotificationsProvider: Provider = {
  provide: NOTIFICATIONS_SERVICE,
  useClass: NotificationsService,
};
