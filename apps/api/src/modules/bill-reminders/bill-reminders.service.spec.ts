import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { BillRemindersService } from './bill-reminders.service';
import { BillReminder } from './bill-reminder.entity';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
});

describe('BillRemindersService', () => {
  let service: BillRemindersService;
  let repo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillRemindersService,
        { provide: getRepositoryToken(BillReminder), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<BillRemindersService>(BillRemindersService);
    repo = module.get(getRepositoryToken(BillReminder));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByUser', () => {
    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOneByUser('999', 'u1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a bill reminder', async () => {
      const dto = { name: 'Electric Bill', amount: 2500, due_day: 15 };
      const reminder = { id: '1', user_id: 'u1', ...dto } as BillReminder;
      repo.create.mockReturnValue(reminder);
      repo.save.mockResolvedValue(reminder);
      const result = await service.create('u1', dto);
      expect(result).toEqual(reminder);
    });
  });

  describe('remove', () => {
    it('should remove a bill reminder', async () => {
      const reminder = { id: '1', user_id: 'u1' } as BillReminder;
      repo.findOne.mockResolvedValue(reminder);
      repo.remove.mockResolvedValue(reminder);
      await service.remove('1', 'u1');
      expect(repo.remove).toHaveBeenCalledWith(reminder);
    });
  });
});
