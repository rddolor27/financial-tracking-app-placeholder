import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';
import { AccountsService } from '../accounts/accounts.service';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
});

const mockAccountsService = () => ({
  findOneByUser: jest.fn(),
  update: jest.fn(),
});

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repo: ReturnType<typeof mockRepository>;
  let accountsService: ReturnType<typeof mockAccountsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getRepositoryToken(Transaction), useFactory: mockRepository },
        { provide: AccountsService, useFactory: mockAccountsService },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repo = module.get(getRepositoryToken(Transaction));
    accountsService = module.get(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByUser', () => {
    it('should return a transaction', async () => {
      const tx = { id: '1', user_id: 'u1', amount: 100 } as Transaction;
      repo.findOne.mockResolvedValue(tx);

      const result = await service.findOneByUser('1', 'u1');
      expect(result).toEqual(tx);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOneByUser('999', 'u1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a transaction and update account balance for expense', async () => {
      const dto = {
        account_id: 'a1',
        category_id: 'c1',
        type: 'expense' as const,
        amount: 500,
        date: '2026-06-28',
      };
      const account = { id: 'a1', user_id: 'u1', balance: 1000 };
      const tx = { id: 't1', user_id: 'u1', ...dto } as Transaction;

      accountsService.findOneByUser.mockResolvedValue(account);
      repo.create.mockReturnValue(tx);
      repo.save.mockResolvedValue(tx);

      const result = await service.create('u1', dto);
      expect(result).toEqual(tx);
      expect(accountsService.update).toHaveBeenCalledWith('a1', 'u1', {
        balance: 500,
      });
    });

    it('should create a transaction and update account balance for income', async () => {
      const dto = {
        account_id: 'a1',
        category_id: 'c1',
        type: 'income' as const,
        amount: 1000,
        date: '2026-06-28',
      };
      const account = { id: 'a1', user_id: 'u1', balance: 500 };
      const tx = { id: 't1', user_id: 'u1', ...dto } as Transaction;

      accountsService.findOneByUser.mockResolvedValue(account);
      repo.create.mockReturnValue(tx);
      repo.save.mockResolvedValue(tx);

      const result = await service.create('u1', dto);
      expect(result).toEqual(tx);
      expect(accountsService.update).toHaveBeenCalledWith('a1', 'u1', {
        balance: 1500,
      });
    });
  });

  describe('remove', () => {
    it('should remove the transaction and reverse balance', async () => {
      const tx = {
        id: 't1',
        user_id: 'u1',
        account_id: 'a1',
        type: 'expense',
        amount: 500,
      } as Transaction;
      const account = { id: 'a1', user_id: 'u1', balance: 500 };

      repo.findOne.mockResolvedValue(tx);
      accountsService.findOneByUser.mockResolvedValue(account);
      repo.remove.mockResolvedValue(tx);

      await service.remove('t1', 'u1');
      expect(repo.remove).toHaveBeenCalledWith(tx);
      expect(accountsService.update).toHaveBeenCalledWith('a1', 'u1', {
        balance: 1000,
      });
    });
  });
});
