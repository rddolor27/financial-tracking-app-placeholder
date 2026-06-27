import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from './account.entity';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  softDelete: jest.fn(),
  count: jest.fn(),
});

describe('AccountsService', () => {
  let service: AccountsService;
  let repo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        { provide: getRepositoryToken(Account), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    repo = module.get(getRepositoryToken(Account));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByUser', () => {
    it('should return accounts for a user', async () => {
      const accounts = [
        { id: '1', user_id: 'u1', name: 'Savings' },
        { id: '2', user_id: 'u1', name: 'Checking' },
      ] as Account[];
      repo.find.mockResolvedValue(accounts);

      const result = await service.findAllByUser('u1');
      expect(result).toEqual(accounts);
      expect(repo.find).toHaveBeenCalledWith({
        where: { user_id: 'u1' },
        order: { created_at: 'DESC' },
      });
    });
  });

  describe('findOneByUser', () => {
    it('should return an account', async () => {
      const account = { id: '1', user_id: 'u1', name: 'Savings' } as Account;
      repo.findOne.mockResolvedValue(account);

      const result = await service.findOneByUser('1', 'u1');
      expect(result).toEqual(account);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOneByUser('999', 'u1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return an account', async () => {
      const dto = { name: 'New Account', type: 'savings' as const };
      const account = { id: '1', user_id: 'u1', ...dto } as Account;
      repo.create.mockReturnValue(account);
      repo.save.mockResolvedValue(account);

      const result = await service.create('u1', dto);
      expect(result).toEqual(account);
      expect(repo.create).toHaveBeenCalledWith({ ...dto, user_id: 'u1' });
    });
  });

  describe('update', () => {
    it('should update and return the account', async () => {
      const account = { id: '1', user_id: 'u1', name: 'Old' } as Account;
      const updated = { ...account, name: 'Updated' } as Account;
      repo.findOne.mockResolvedValue(account);
      repo.merge.mockReturnValue(updated);
      repo.save.mockResolvedValue(updated);

      const result = await service.update('1', 'u1', { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(
        service.update('999', 'u1', { name: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should deactivate the account', async () => {
      const account = { id: '1', user_id: 'u1', is_active: true } as Account;
      repo.findOne.mockResolvedValue(account);
      repo.save.mockResolvedValue({ ...account, is_active: false });

      await service.remove('1', 'u1');
      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ is_active: false }),
      );
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.remove('999', 'u1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
