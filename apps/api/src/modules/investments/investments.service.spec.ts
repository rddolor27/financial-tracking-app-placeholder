import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { Investment } from './investment.entity';
import { InvestmentTransaction } from './investment-transaction.entity';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
});

describe('InvestmentsService', () => {
  let service: InvestmentsService;
  let repo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvestmentsService,
        { provide: getRepositoryToken(Investment), useFactory: mockRepository },
        { provide: getRepositoryToken(InvestmentTransaction), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<InvestmentsService>(InvestmentsService);
    repo = module.get(getRepositoryToken(Investment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByUser', () => {
    it('should return investments', async () => {
      const investments = [{ id: '1', user_id: 'u1' }] as Investment[];
      repo.find.mockResolvedValue(investments);
      const result = await service.findAllByUser('u1');
      expect(result).toEqual(investments);
    });
  });

  describe('findOneByUser', () => {
    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOneByUser('999', 'u1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create an investment', async () => {
      const dto = { symbol: 'BTC', name: 'Bitcoin', asset_type: 'crypto' as const };
      const investment = { id: '1', user_id: 'u1', ...dto } as Investment;
      repo.create.mockReturnValue(investment);
      repo.save.mockResolvedValue(investment);
      const result = await service.create('u1', dto);
      expect(result).toEqual(investment);
    });
  });

  describe('remove', () => {
    it('should remove an investment', async () => {
      const investment = { id: '1', user_id: 'u1' } as Investment;
      repo.findOne.mockResolvedValue(investment);
      repo.remove.mockResolvedValue(investment);
      await service.remove('1', 'u1');
      expect(repo.remove).toHaveBeenCalledWith(investment);
    });
  });
});
