import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecurringService } from './recurring.service';
import { Transaction } from './transaction.entity';
import { RECURRING_SERVICE } from './transactions.constants';
import { RecurringProvider } from './recurring.service';

const mockRepository = () => ({
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('RecurringService', () => {
  let service: RecurringService;
  let repo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecurringProvider,
        { provide: getRepositoryToken(Transaction), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<RecurringService>(RECURRING_SERVICE);
    repo = module.get(getRepositoryToken(Transaction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process due recurring transactions', async () => {
    const template = {
      id: '1',
      user_id: 'u1',
      account_id: 'a1',
      category_id: 'c1',
      type: 'expense',
      amount: 100,
      description: 'Monthly Sub',
      is_recurring: true,
      recurring_interval: 'monthly',
      recurring_next_date: '2026-01-01',
      tags: [],
    };

    repo.find.mockResolvedValue([template]);
    repo.create.mockReturnValue({ ...template, id: '2' });
    repo.save.mockImplementation((entity: unknown) => Promise.resolve(entity));

    const created = await service.processRecurringTransactions();
    expect(created).toBe(1);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalledTimes(2); // new transaction + updated template
  });

  it('should return 0 when no recurring transactions are due', async () => {
    repo.find.mockResolvedValue([]);
    const created = await service.processRecurringTransactions();
    expect(created).toBe(0);
  });
});
