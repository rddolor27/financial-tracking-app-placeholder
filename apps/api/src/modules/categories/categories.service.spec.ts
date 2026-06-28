import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { CATEGORIES_SERVICE } from './categories.constants';
import { CategoriesProvider } from './categories.providers';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
});

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesProvider,
        { provide: getRepositoryToken(Category), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<CategoriesService>(CATEGORIES_SERVICE);
    repo = module.get(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllForUser', () => {
    it('should return system defaults and user categories', async () => {
      const categories = [
        { id: '1', user_id: null, name: 'Food', is_default: true },
        { id: '2', user_id: 'u1', name: 'Custom', is_default: false },
      ] as Category[];
      repo.find.mockResolvedValue(categories);

      const result = await service.findAllForUser('u1');
      expect(result).toEqual(categories);
    });
  });

  describe('findOneForUser', () => {
    it('should return a category owned by user', async () => {
      const cat = { id: '1', user_id: 'u1', name: 'Custom' } as Category;
      repo.findOne.mockResolvedValue(cat);
      const result = await service.findOneForUser('1', 'u1');
      expect(result).toEqual(cat);
    });

    it('should return a system default category', async () => {
      const cat = {
        id: '1',
        user_id: null,
        name: 'Food',
        is_default: true,
      } as Category;
      repo.findOne.mockResolvedValue(cat);
      const result = await service.findOneForUser('1', 'u1');
      expect(result).toEqual(cat);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOneForUser('999', 'u1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a user category', async () => {
      const dto = { name: 'Custom', type: 'expense' as const, icon: 'fa-tag', color: '#FF0000' };
      const cat = { id: '1', user_id: 'u1', ...dto } as Category;
      repo.create.mockReturnValue(cat);
      repo.save.mockResolvedValue(cat);

      const result = await service.create('u1', dto);
      expect(result).toEqual(cat);
      expect(repo.create).toHaveBeenCalledWith({
        ...dto,
        user_id: 'u1',
        is_default: false,
      });
    });
  });

  describe('update', () => {
    it('should update a user-owned category', async () => {
      const cat = { id: '1', user_id: 'u1', name: 'Old', is_default: false } as Category;
      const updated = { ...cat, name: 'New' } as Category;
      repo.findOne.mockResolvedValue(cat);
      repo.merge.mockReturnValue(updated);
      repo.save.mockResolvedValue(updated);

      const result = await service.update('1', 'u1', { name: 'New' });
      expect(result.name).toBe('New');
    });

    it('should allow hiding a default category', async () => {
      const cat = {
        id: '1',
        user_id: null,
        name: 'Food',
        is_default: true,
        is_hidden: false,
      } as Category;
      const updated = { ...cat, is_hidden: true } as Category;
      repo.findOne.mockResolvedValue(cat);
      repo.merge.mockReturnValue(updated);
      repo.save.mockResolvedValue(updated);

      const result = await service.update('1', 'u1', { is_hidden: true });
      expect(result.is_hidden).toBe(true);
    });

    it('should throw ForbiddenException when editing default name', async () => {
      const cat = {
        id: '1',
        user_id: null,
        name: 'Food',
        is_default: true,
      } as Category;
      repo.findOne.mockResolvedValue(cat);

      await expect(
        service.update('1', 'u1', { name: 'Renamed' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should throw ForbiddenException for default categories', async () => {
      const cat = {
        id: '1',
        user_id: null,
        is_default: true,
      } as Category;
      repo.findOne.mockResolvedValue(cat);

      await expect(service.remove('1', 'u1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
