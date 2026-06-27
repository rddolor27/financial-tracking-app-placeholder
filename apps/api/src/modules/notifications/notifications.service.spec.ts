import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification.entity';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
});

describe('NotificationsService', () => {
  let service: NotificationsService;
  let repo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: getRepositoryToken(Notification), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    repo = module.get(getRepositoryToken(Notification));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const notif = { id: '1', user_id: 'u1', is_read: false } as Notification;
      repo.findOne.mockResolvedValue(notif);
      repo.save.mockImplementation((n: Notification) => Promise.resolve(n));

      const result = await service.markAsRead('1', 'u1');
      expect(result.is_read).toBe(true);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.markAsRead('999', 'u1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAllAsRead', () => {
    it('should update all unread notifications', async () => {
      repo.update.mockResolvedValue({ affected: 5 });
      await service.markAllAsRead('u1');
      expect(repo.update).toHaveBeenCalledWith(
        { user_id: 'u1', is_read: false },
        { is_read: true },
      );
    });
  });
});
