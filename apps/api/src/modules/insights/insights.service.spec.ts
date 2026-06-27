import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InsightsService } from './insights.service';
import { Transaction } from '../transactions/transaction.entity';

const mockRepo = () => ({
  find: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    addGroupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue([]),
  }),
});

describe('InsightsService', () => {
  let service: InsightsService;
  let repo: ReturnType<typeof mockRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsightsService,
        { provide: getRepositoryToken(Transaction), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<InsightsService>(InsightsService);
    repo = module.get(getRepositoryToken(Transaction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate income vs expense', async () => {
    repo.find.mockResolvedValue([
      { type: 'income', amount: 5000 },
      { type: 'expense', amount: 2000 },
      { type: 'expense', amount: 1000 },
    ]);

    const result = await service.incomeVsExpense('u1', '2026-01-01', '2026-01-31');
    expect(result.income).toBe(5000);
    expect(result.expense).toBe(3000);
    expect(result.net).toBe(2000);
  });

  it('should calculate savings rate', async () => {
    repo.find.mockResolvedValue([
      { type: 'income', amount: 10000 },
      { type: 'expense', amount: 7000 },
    ]);

    const result = await service.savingsRate('u1', '2026-01-01', '2026-01-31');
    expect(result.rate).toBe(30);
  });
});
