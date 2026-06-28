import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './budget.entity';
import type { CreateBudgetDto, UpdateBudgetDto } from './dtos';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetsRepo: Repository<Budget>,
  ) {}

  async findAllByUser(userId: string): Promise<Budget[]> {
    return this.budgetsRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findOneByUser(id: string, userId: string): Promise<Budget> {
    const budget = await this.budgetsRepo.findOne({
      where: { id, user_id: userId },
    });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    return budget;
  }

  async create(userId: string, data: CreateBudgetDto): Promise<Budget> {
    const budget = this.budgetsRepo.create({ ...data, user_id: userId });
    return this.budgetsRepo.save(budget);
  }

  async update(
    id: string,
    userId: string,
    data: UpdateBudgetDto,
  ): Promise<Budget> {
    const budget = await this.findOneByUser(id, userId);
    this.budgetsRepo.merge(budget, data as Partial<Budget>);
    return this.budgetsRepo.save(budget);
  }

  async remove(id: string, userId: string): Promise<void> {
    const budget = await this.findOneByUser(id, userId);
    await this.budgetsRepo.remove(budget);
  }
}
