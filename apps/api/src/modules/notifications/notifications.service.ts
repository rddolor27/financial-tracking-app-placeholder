import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
  ) {}

  async findAllByUser(userId: string): Promise<Notification[]> {
    return this.notificationsRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: 50,
    });
  }

  async findUnreadByUser(userId: string): Promise<Notification[]> {
    return this.notificationsRepo.find({
      where: { user_id: userId, is_read: false },
      order: { created_at: 'DESC' },
    });
  }

  async create(userId: string, data: Partial<Notification>): Promise<Notification> {
    const notification = this.notificationsRepo.create({ ...data, user_id: userId });
    return this.notificationsRepo.save(notification);
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationsRepo.findOne({
      where: { id, user_id: userId },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    notification.is_read = true;
    return this.notificationsRepo.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepo.update(
      { user_id: userId, is_read: false },
      { is_read: true },
    );
  }
}
