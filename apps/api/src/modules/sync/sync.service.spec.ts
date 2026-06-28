import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SyncService } from './sync.service';
import { Account } from '../accounts/account.entity';
import { Category } from '../categories/category.entity';
import { Transaction } from '../transactions/transaction.entity';
import { Budget } from '../budgets/budget.entity';
import { SYNC_SERVICE } from './sync.constants';
import { SyncProvider } from './sync.providers';

const mockRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
});

describe('SyncService', () => {
  let service: SyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncProvider,
        { provide: getRepositoryToken(Account), useFactory: mockRepo },
        { provide: getRepositoryToken(Category), useFactory: mockRepo },
        { provide: getRepositoryToken(Transaction), useFactory: mockRepo },
        { provide: getRepositoryToken(Budget), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<SyncService>(SYNC_SERVICE);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('pull', () => {
    it('should return entities updated after lastSyncedAt', async () => {
      const accountRepo = service['accountsRepo'];
      const categoryRepo = service['categoriesRepo'];
      const transactionRepo = service['transactionsRepo'];
      const budgetRepo = service['budgetsRepo'];

      (accountRepo.find as jest.Mock).mockResolvedValue([{ id: '1', name: 'Acc' }]);
      (categoryRepo.find as jest.Mock).mockResolvedValue([]);
      (transactionRepo.find as jest.Mock).mockResolvedValue([]);
      (budgetRepo.find as jest.Mock).mockResolvedValue([]);

      const result = await service.pull('user1', '2026-01-01T00:00:00.000Z');
      expect(result.accounts).toHaveLength(1);
      expect(result.categories).toHaveLength(0);
    });
  });
});
