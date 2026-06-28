import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoryModel } from './models/category.model';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
  ) {}

  private async findEntityForUser(id: string, userId: string): Promise<Category> {
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

  async findAllForUser(userId: string): Promise<CategoryModel[]> {
    const categories = await this.categoriesRepo.find({
      where: [{ user_id: userId }, { user_id: IsNull() }],
      order: { is_default: 'DESC', name: 'ASC' },
    });
    return categories.map((category) => CategoryModel.fromEntity(category));
  }

  async findOneForUser(id: string, userId: string): Promise<CategoryModel> {
    const category = await this.findEntityForUser(id, userId);
    return CategoryModel.fromEntity(category);
  }

  async create(userId: string, data: CreateCategoryDto): Promise<CategoryModel> {
    const category = this.categoriesRepo.create({
      ...data,
      user_id: userId,
      is_default: false,
    });
    const saved = await this.categoriesRepo.save(category);
    return CategoryModel.fromEntity(saved);
  }

  async update(
    id: string,
    userId: string,
    data: UpdateCategoryDto | Partial<Category>,
  ): Promise<CategoryModel> {
    const category = await this.findEntityForUser(id, userId);

    if (category.is_default && category.user_id === null) {
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
    const saved = await this.categoriesRepo.save(category);
    return CategoryModel.fromEntity(saved);
  }

  async remove(id: string, userId: string): Promise<void> {
    const category = await this.findEntityForUser(id, userId);

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
