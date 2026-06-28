import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from './category.entity';
import type { CreateCategoryDto, UpdateCategoryDto } from './dtos';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
  ) {}

  async findAllForUser(userId: string): Promise<Category[]> {
    return this.categoriesRepo.find({
      where: [{ user_id: userId }, { user_id: IsNull() }],
      order: { is_default: 'DESC', name: 'ASC' },
    });
  }

  async findOneForUser(id: string, userId: string): Promise<Category> {
    const category = await this.categoriesRepo.findOne({
      where: [
        { id, user_id: userId },
        { id, user_id: IsNull() },
      ],
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async create(userId: string, data: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepo.create({
      ...data,
      user_id: userId,
      is_default: false,
    });
    return this.categoriesRepo.save(category);
  }

  async update(
    id: string,
    userId: string,
    data: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOneForUser(id, userId);

    if (category.is_default && category.user_id === null) {
      // Default categories can only be hidden, not renamed/recolored
      const allowedKeys = ['is_hidden'];
      const attemptedKeys = Object.keys(data);
      const disallowed = attemptedKeys.filter(
        (k) => !allowedKeys.includes(k),
      );
      if (disallowed.length > 0) {
        throw new ForbiddenException(
          'Default categories can only be hidden',
        );
      }
    }

    this.categoriesRepo.merge(category, data);
    return this.categoriesRepo.save(category);
  }

  async remove(id: string, userId: string): Promise<void> {
    const category = await this.findOneForUser(id, userId);

    if (category.is_default) {
      throw new ForbiddenException(
        'Default categories cannot be deleted, only hidden',
      );
    }

    if (category.user_id !== userId) {
      throw new ForbiddenException('Cannot delete this category');
    }

    await this.categoriesRepo.remove(category);
  }
}
