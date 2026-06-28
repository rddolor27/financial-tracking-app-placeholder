import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { Goal } from './goal.entity';
import { GOALS_SERVICE } from './goals.constants';
import { GoalsProvider } from './goals.providers';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
});

describe('GoalsService', () => {
  let service: GoalsService;
  let repo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalsProvider,
        { provide: getRepositoryToken(Goal), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<GoalsService>(GOALS_SERVICE);
    repo = module.get(getRepositoryToken(Goal));
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

  describe('contribute', () => {
    it('should add amount to current_amount', async () => {
      const goal = { id: '1', user_id: 'u1', current_amount: 1000, target_amount: 5000, is_completed: false } as Goal;
      repo.findOne.mockResolvedValue(goal);
      repo.save.mockImplementation((g: Goal) => Promise.resolve(g));

      const result = await service.contribute('1', 'u1', 500);
      expect(result.current_amount).toBe(1500);
      expect(result.is_completed).toBe(false);
    });

    it('should mark as completed when target reached', async () => {
      const goal = { id: '1', user_id: 'u1', current_amount: 4500, target_amount: 5000, is_completed: false } as Goal;
      repo.findOne.mockResolvedValue(goal);
      repo.save.mockImplementation((g: Goal) => Promise.resolve(g));

      const result = await service.contribute('1', 'u1', 500);
      expect(result.current_amount).toBe(5000);
      expect(result.is_completed).toBe(true);
    });
  });
});
