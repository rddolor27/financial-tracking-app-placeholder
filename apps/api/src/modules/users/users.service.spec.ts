import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { USERS_SERVICE } from './users.constants';
import { UsersProvider } from './users.providers';

const mockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersProvider,
        { provide: getRepositoryToken(User), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<UsersService>(USERS_SERVICE);
    repo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const user = { id: '1', email: 'test@test.com' } as User;
      repo.findOne.mockResolvedValue(user);
      const result = await service.findByEmail('test@test.com');
      expect(result).toEqual(user);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });

    it('should return null if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      const result = await service.findByEmail('no@test.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const user = { id: '1', email: 'test@test.com' } as User;
      repo.findOne.mockResolvedValue(user);
      const result = await service.findById('1');
      expect(result).toEqual(user);
    });

    it('should return null if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      const result = await service.findById('999');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const dto = {
        email: 'new@test.com',
        password_hash: 'hashed',
        first_name: 'John',
        last_name: 'Doe',
        auth_provider: 'email' as const,
      };
      const user = { id: '1', ...dto } as User;
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(user);
      repo.save.mockResolvedValue(user);

      const result = await service.create(dto);
      expect(result).toEqual(user);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(user);
    });

    it('should throw ConflictException if email exists', async () => {
      const existing = { id: '1', email: 'dup@test.com' } as User;
      repo.findOne.mockResolvedValue(existing);

      await expect(
        service.create({
          email: 'dup@test.com',
          password_hash: 'hashed',
          first_name: 'Jane',
          last_name: 'Doe',
          auth_provider: 'email',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByGoogleId', () => {
    it('should return a user by google_id', async () => {
      const user = { id: '1', google_id: 'g123' } as User;
      repo.findOne.mockResolvedValue(user);
      const result = await service.findByGoogleId('g123');
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        first_name: 'Old',
      } as User;
      const updated = { ...user, first_name: 'New' } as User;
      repo.findOne.mockResolvedValue(user);
      repo.merge.mockReturnValue(updated);
      repo.save.mockResolvedValue(updated);

      const result = await service.update('1', { first_name: 'New' });
      expect(result.first_name).toBe('New');
    });

    it('should throw NotFoundException if user not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update('999', { first_name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
