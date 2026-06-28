import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { Budget } from './budget.entity';
import { BUDGETS_SERVICE } from './budgets.constants';
import { BudgetsProvider } from './budgets.providers';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
});

describe('BudgetsService', () => {
  let service: BudgetsService;
  let repo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetsProvider,
        { provide: getRepositoryToken(Budget), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<BudgetsService>(BUDGETS_SERVICE);
    repo = module.get(getRepositoryToken(Budget));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByUser', () => {
    it('should return budgets for a user', async () => {
      const budgets = [
        { id: '1', user_id: 'u1', amount: 5000 },
      ] as Budget[];
      repo.find.mockResolvedValue(budgets);

      const result = await service.findAllByUser('u1');
      expect(result).toEqual(budgets);
    });
  });

  describe('findOneByUser', () => {
    it('should return a budget', async () => {
      const budget = { id: '1', user_id: 'u1' } as Budget;
      repo.findOne.mockResolvedValue(budget);
      const result = await service.findOneByUser('1', 'u1');
      expect(result).toEqual(budget);
    });

    it('should throw NotFoundException', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOneByUser('999', 'u1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a budget', async () => {
      const dto = {
        category_id: 'c1',
        amount: 5000,
        period: 'monthly' as const,
        start_date: '2026-07-01',
        alert_threshold: 80,
      };
      const budget = { id: '1', user_id: 'u1', ...dto } as Budget;
      repo.create.mockReturnValue(budget);
      repo.save.mockResolvedValue(budget);

      const result = await service.create('u1', dto);
      expect(result).toEqual(budget);
    });
  });

  describe('update', () => {
    it('should update a budget', async () => {
      const budget = { id: '1', user_id: 'u1', amount: 5000 } as Budget;
      const updated = { ...budget, amount: 8000 } as Budget;
      repo.findOne.mockResolvedValue(budget);
      repo.merge.mockReturnValue(updated);
      repo.save.mockResolvedValue(updated);

      const result = await service.update('1', 'u1', { amount: 8000 });
      expect(result.amount).toBe(8000);
    });
  });

  describe('remove', () => {
    it('should remove a budget', async () => {
      const budget = { id: '1', user_id: 'u1' } as Budget;
      repo.findOne.mockResolvedValue(budget);
      repo.remove.mockResolvedValue(budget);

      await service.remove('1', 'u1');
      expect(repo.remove).toHaveBeenCalledWith(budget);
    });
  });
});
